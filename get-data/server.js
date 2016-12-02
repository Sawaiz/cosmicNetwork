var config = require('./config');

var express = require('express');
var fs = require('fs');

var app = express();

var logging;

//Create the fields to log from interupt pins
config.detector.fields = {};
for (pin in config.pins) {
    config.detector.fields[config.pins[pin][0]] = "int(11)";
}
// Add the sensors into the fields
for (getter in config.sensors) {
    config.detector.fields[config.sensors[getter].name] = "varchar(255)";
}

// Begin watching coincidence pins
var Coincidence = require("./coincidence");
var coincidence = new Coincidence(config.pins);

// Data destination: Where to send the data db connection stays "open"
var LogToDB = require("./logToDB");
var db = new LogToDB(config.databaseLocation, config.detector);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Base route with info to make sure everything is working (accessed at GET http://localhost:80/api/getdata)
router.get('/', function (req, res) {
    res.send("<p>Welcome to the API '/', availible options are /startLog, /stopLog , /logs, /logs/<fileName>.</p>");
});

router.post('/beginLog', function (req, res) {
    if (logging) {
        res.json({ error: "Alerady Logging", data: logging.data  });
    } else {
        logging = beginLog(req.query.duration);
        res.json({ sucsess: "Begin Logging ", data: logging.data });
    }
});

router.post('/stopLog', function (req, res) {
    if (logging) {
        res.json({ sucsess: "Logging stopped", data: logging.data });
        endLog();
    } else {
        res.json({ error: "No Current Run" });
    }
});

router.get('/logs', function (req, res) {
    fs.readdir(config.logDir, function (err, files) {
        res.json(files);
    });
});

router.get('/logs/:log', function (req, res) {
    var log = req.params.log.toString();
    res.sendFile(log, { root: config.logDir });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api, but nginx will send us there
app.use('/api/getdata', router);

// START THE SERVER
// =============================================================================
app.listen(config.apiPort);
console.log('Get-Data running on port: ' + config.apiPort);

function beginLog(duration) {

    // Reset conincidence numbers to 0
    coincidence.log();

    // Destination, a new log file is made every time
    var LogToFile = require("./logToFile");
    var file = new LogToFile(config.logDir, config.detector);

    function logData() {
        var dataObj = aggregateData();
        file.log(dataObj);
        db.log(dataObj);
    }

    //Every x miliseconds, write the current counts to file
    return {
        data: { filename: file.fileName },
        interval: setInterval(logData, duration)
    }
}

function endLog() {
    clearInterval(logging.interval);
    logging = undefined;
}

function aggregateData() {
    var data = {};

    Object.assign(data, coincidence.log());

    // Go through all the sensor functions and call them
    for (getter in config.sensors) {
        Object.assign(data, config.sensors[getter]());
    }

    return data;
}
