var http = require("http");
var mysql = require("mysql");
var url = require('url');
var uuid = require('uuid');
var Sequelize = require("sequelize");
var config = require('./config');


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
getModels(function (models) {
    for (index in models) {
        tables[index] = sequelize.define(models[index].name, models[index].schema);
    }
    sequelize.sync();
});

var apiKeys = {};
detector
    .findAll({ "attributes": ["alias", "apiKey"] })
    .then(function (detectorKey) {
        apiKeys[detectorKey[0].alias] = detectorKey[0].apiKey;
    });

// Configure our HTTP server to take data, and put it into sql db.
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url, true).pathname.split("/");
    path.shift();
    var queryData = url.parse(request.url, true).query;
    var select = {};
    if (queryData.select) {
        select = JSON.parse(queryData.select);
    }

    //If you arrived at the correct url
    if (path.shift() == "data") {
        //Serve info about API page, and then break
        //Check to see if we have the table, serve the json if we do, error if we dont
        if (haveTable(path[0])) {
            //looks like we have it
            switch (path[1]) {
                case "json":
                    //serve json
                    response.writeHead(200, { "Content-Type": "application/vnd.api+json" });
                    getDatabaseInfoObject(path[0], select, function (meta, tableData) {
                        response.end(
                            JSON.stringify({
                                meta: meta,
                                data: tableData
                            }, null, 2
                            ));
                    });
                    break;
                case "csv":
                    //serve csv                
                    response.writeHead(200, { "Content-Type": "text/plain" });
                    getDatabaseInfoObject(path[0], select, function (meta, tableData) {
                        var buffer = "";
                        //Print header
                        var headerNumber = 0;
                        for (keys in tableData[0].dataValues) {
                            buffer += keys;
                            headerNumber++;
                            if (headerNumber < Object.keys(tableData[0].dataValues).length) {
                                buffer += ",";
                            } else {
                                buffer += "\r\n";
                            }
                        }
                        for (line in tableData) {
                            var keyNumber = 0;
                            for (key in tableData[line].dataValues) {
                                buffer += JSON.stringify(tableData[line][key]);
                                keyNumber++;
                                if (keyNumber < Object.keys(tableData[line].dataValues).length) {
                                    buffer += ",";
                                } else {
                                    buffer += "\r\n";
                                }
                            }
                        }
                        response.end(buffer);
                    });

                    break;
                case "root":
                    //serve rootFile                    
                    response.writeHead(200, { "Content-Type": "text/plain" });
                    response.end("I don't know how to make a root file.");
                    break;
                default:
                    //this is where we take data that we get
                    //find path[0] and create there
                    if (path[0] == "detector") {
                        //this is the default table
                        queryData.apiKey = uuid.v4();
                        //create a new table here
                        createTable(queryData.alias, JSON.parse(queryData.fields));
                        break;
                        //Check if apikey exists
                    } else if (queryData.key == apiKeys[path[0]]) {
                        delete queryData.key;
                        getTableByName(path[0]).create(queryData)
                            .then(function (res) {
                                response.writeHead(200, { "Content-Type": "text/plain" });
                                response.end("0 Sucsess \r\n" + JSON.stringify(res, null, 2));
                            }, function (err) {
                                response.writeHead(200, { "Content-Type": "text/plain" });
                                response.end("1 Error \r\n" + JSON.stringify(err, null, 2));
                            });

                    } else {
                        response.writeHead(200, { "Content-Type": "text/plain" });
                        response.end(
                            "1 Error API key doesn not match the one on the server\r\n" + 
                            JSON.stringify(queryData, null, 2)
                        );
                    }
                    break;
            }

        } else {
            //we dont have it, give an error instead
            response.writeHead(200, { "Content-Type": "application/vnd.api+json" });
            response.end(
                //Error
                "1 No database " +
                path.shift() +
                " Found" +
                "\r\n\r\n" +
                JSON.stringify(url.parse(request.url, true), null, 2)
            );
            //break out of this somehow
        }

    } else {
        //serve 404, you typed something else past data
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("0 try typing \"data\" properly")
    }


    // getModels(function (models) {
    //     response.writeHead(200, { "Content-Type": "application/vnd.api+json" });
    //     response.end(JSON.stringify(models, null, 2));
    // });
});
// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(config.apiPort);

//look through tablesname to see if we have that table
function haveTable(tableName) {
    for (index in tables) {
        if (tables[index].name == tableName) {
            return true;
        }
    }
    return false;
}

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
    sequelize.sync().then(function () {
        //rebuild get all the tables
        getModels(function (models) {
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
    .then(function () {
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
        }).catch(function (err) {
            console.log(JSON.stringify(err, null, 2));
        });
    });

    var sawaiz = sequelize.define("sawaiz", {
        height: Sequelize.INTEGER,
        width: Sequelize.INTEGER,
        depth: Sequelize.INTEGER
    });

    sequelize.sync().then(function () {
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
                .then(function (tableData) {
                    callback(meta, tableData);
                },
                function (err) {
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

    sequelize.query("SHOW TABLES").then(function (tablesArray) {
        for (table in tablesArray[0]) {
            tableList.push(tablesArray[0][table].Tables_in_cosmic);
        }
        return tableList;
    }).each(function (table) {
        sequelize.query("DESCRIBE " + table).then(function (descriptionList) {
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
        }).then(function () {
            if (tables.length == tableList.length) {
                callback(tables);
            }
        });
    });

}


