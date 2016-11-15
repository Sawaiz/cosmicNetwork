var http = require("http");
var mysql = require("mysql");
var url = require('url');
var uuid = require('uuid');
var Sequelize = require("sequelize");
var express = require('express');
var config = require('./config');

var app = express();

var sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPasswd, {
    host: config.dbHost,
    dialect: config.dbDialect,
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
});

// buildTestTables()

// build Detector Table
var detector = sequelize.import(__dirname + "/detector.model.js");
sequelize.sync();

var tables = [];
getModels(function(models) {
    for (index in models) {
        tables[index] = sequelize.define(models[index].name, models[index].schema);
    }
    sequelize.sync();
});

var apiKeys = {};
detector
    .findAll({ "attributes": ["alias", "apiKey"] })
    .then(function(detectorKey) {
        if (detectorKey.length != 0) {
            apiKeys[detectorKey[0].alias] = detectorKey[0].apiKey;
        }
    });

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Base route with info (accessed at GET http://localhost:80/api/db)
router.get('/', function(req, res) {
    res.send("<p>Welcome to the API '/', availible options are /tableName , /mppcInterface/0x08</p>");
});

router.get('/:tableName', function(req, res) {
    var tableName = req.params.tableName;
    var select = JSON.parse(req.query.select || "{}");
    var type = req.query.type;

    //If the table exists, return it.
    if (getTableByName(tableName)) {
        switch (type) {
            case "json":
                //serve json
                getDatabaseInfoObject(tableName, select, function(meta, tableData) {
                    res.json({ meta: meta, data: tableData });
                });
                break;

            case "csv":
                //serve csv                
                getDatabaseInfoObject(tableName, select, function(meta, tableData) {
                    res.send(jsonToCsv(tableData));
                });
                break;

            default:
                //error, select a type
                res.send("<p>Select parameter \"type\", json,csv.</p>");
        }
    } else {
        var response = { error: "Table does not exist", tables: [] }
        for (index in tables) {
            response.tables.push(tables[index].name);
        }
        res.json(response);
    }
});

router.post('/add/:tableName', function(req, res) {
    var tableName = req.params.tableName;
    //this is where we take data that we get
    if (tableName == "detector") {
        //this is the default table
        req.query.apiKey = uuid.v4();
        //create a new table here
        createTable(req.query.alias, JSON.parse(req.query.fields));


        getTableByName(tableName).create(req.query)
            .then(function(response) {
                res.json(response);
            }, function(err) {
                res.json(err);
            });

    } else if (req.query.key == apiKeys[tableName] && req.query.key != null) {
        //Check if apikey exists
        delete req.query.key;
        getTableByName(tableName).create(req.query)
            .then(function(response) {
                res.json(response);
            }, function(err) {
                res.json(err);
            });

    } else {
        res.json({ error: "Key does not match", query: req.query });
    }

});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/db', router);

// START THE SERVER
// =============================================================================
app.listen(config.apiPort);
console.log('Magic happens on port ' + config.apiPort);

function jsonToCsv(jsonObject) {
    var buffer = "";
    //Print header
    var headerNumber = 0;
    for (keys in jsonObject[0].dataValues) {
        buffer += keys;
        headerNumber++;
        if (headerNumber < Object.keys(jsonObject[0].dataValues).length) {
            buffer += ",";
        } else {
            buffer += "\r\n";
        }
    }
    for (line in jsonObject) {
        var keyNumber = 0;
        for (key in jsonObject[line].dataValues) {
            buffer += JSON.stringify(jsonObject[line][key]);
            keyNumber++;
            if (keyNumber < Object.keys(jsonObject[line].dataValues).length) {
                buffer += ",";
            } else {
                buffer += "\r\n";
            }
        }
    }
    return buffer;
}

//look through tablesname to see if we have that table
function getTableByName(tableName) {
    for (index in tables) {
        if (tables[index].name == tableName) {
            return tables[index];
        }
    }
    return null;
}

function createTable(alias, schemaRaw) {
    //define a new table and sync it
    var schema = {};
    for (key in schemaRaw) {
        schema[key] = stringToSequelizeType(schemaRaw[key]);
    }
    var newTable = sequelize.define(alias, schema);
    sequelize.sync().then(function() {
        //rebuild get all the tables
        getModels(function(models) {
            for (index in models) {
                tables[index] = sequelize.define(models[index].name, models[index].schema);
            }
            sequelize.sync();
        });
    });
}

function buildTestTables() {
    var detector = sequelize.import(__dirname + "/detector.model.js");
    sequelize.sync()
        .then(function() {
            detector.create({
                name: "Drug Loard Griffin",
                description: " a legendary creature with the body, tail, and back legs of a lion",
                alias: "griffin",
                tags: "guarding ,priceless ,possessions",
                fields: "{ \
                oneAndTwo    : Sequelize.INTEGER, \
                oneAndThree  : Sequelize.INTEGER, \
                oneAndFour   : Sequelize.INTEGER, \
                twoAndThree  : Sequelize.INTEGER, \
                twoAndFour   : Sequelize.INTEGER, \
                threeAndFour : Sequelize.INTEGER, \
            }",
                location: "Egypt",
                apiKey: "Egypt",
                public: true
            }).catch(function(err) {
                console.log(JSON.stringify(err, null, 2));
            });
        });

    var sawaiz = sequelize.define("sawaiz", {
        height: Sequelize.INTEGER,
        width: Sequelize.INTEGER,
        depth: Sequelize.INTEGER
    });

    sequelize.sync().then(function() {
        sawaiz.create({
            height: 500,
            width: 500,
            depth: 500,
        });
    });


}

function getDatabaseInfoObject(tableName, select, callback) {
    var pathName = tableName;
    for (index in tables) {
        if (tables[index].name == pathName) {
            var meta = {
                name: tables[index].name
            };
            tables[index].findAll(select)
                .then(function(tableData) {
                    callback(meta, tableData);
                },
                function(err) {
                    callback({ name: "error" }, err);
                });
        }
    }
}

function stringToSequelizeType(stringInput) {
    //type conversion
    switch (stringInput) {
        case "int(11)":
            return Sequelize.INTEGER;
        case "varchar(255)":
            return Sequelize.STRING;
        case "text":
            return Sequelize.TEXT;
        case "tinyint(1)":
            return Sequelize.BOOLEAN;
        case "datetime":
            return Sequelize.DATE;
        default:
    }
}

function getModels(callback) {

    var tables = [];
    var tableList = [];

    sequelize.query("SHOW TABLES").then(function(tablesArray) {
        for (table in tablesArray[0]) {
            tableList.push(tablesArray[0][table].Tables_in_cosmic);
        }
        return tableList;
    }).each(function(table) {
        sequelize.query("DESCRIBE " + table).then(function(descriptionList) {
            var tableInfo = {};
            var schema = {};

            for (descriptions in descriptionList[0]) {
                for (fields in descriptionList[0][descriptions]) {
                    var fieldDescription = {};
                    fieldDescription.type = stringToSequelizeType(descriptionList[0][descriptions].Type);


                    if (descriptionList[0][descriptions].Default != null) {
                        fieldDescription.defaultValue = descriptionList[0][descriptions].Default;
                    }

                    if (descriptionList[0][descriptions].Null == "NO") {
                        fieldDescription.allowNull = false;
                    }

                    switch (descriptionList[0][descriptions].Key) {
                        case "PRI":
                            fieldDescription.primaryKey = true;
                            break;
                        case "UNI":
                            fieldDescription.unique = true;
                            break;
                        case "MUL":
                            console.log(JSON.stringify(descriptionList[0][descriptions], null, 2));
                            break;
                    }

                    switch (descriptionList[0][descriptions].Extra) {
                        case "auto_increment":
                            fieldDescription.autoIncrement = true;
                            break;
                        case "":
                            break;
                        default:
                            fieldDescription.comment = descriptionList[0][descriptions].Extra;
                    }

                    schema[descriptionList[0][descriptions].Field] = fieldDescription;
                }
            }

            tableInfo.name = table;
            tableInfo.schema = schema;
            tables.push(tableInfo);
        }).then(function() {
            if (tables.length == tableList.length) {
                callback(tables);
            }
        });
    });

}


