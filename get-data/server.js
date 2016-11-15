const fs = require('fs'); //Accsess the filesystem
var config = require('./config');
var GPIO = require('onoff').Gpio; // Constructor function for Gpio objects.
var express = require('express');

var app = express();
var port = process.env.PORT || config.apiPort; // set our port

var led = new GPIO(14, 'out');    // Export GPIO #14 as an output.
var pins = config.pins;

var logging;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Base route with info to make sure everything is working (accessed at GET http://localhost:80/get-data)
router.get('/', function (req, res) {
    res.send("<p>Welcome to the API '/', availible options are /startLog, /stopLog , /logs, /logs/<fileName>.</p>");
});

router.get('/beginLog', function (req, res) {
    if (logging) {
        res.json({ error: "Currently Logging", data: logging.data });
        return 0;
    }
    if (req.query.duration) {
        logging = startLogging(req.query.duration);
        res.json({
            sucsess: 0
        });
    } else {
        res.json({
            error: 1,
            reason: "missing duration"
        });
    }
});

router.get('/stopLog', function (req, res) {
    if (logging) {
        clearInterval(logging.interval);
        res.json({ sucsess: "logging stopped", data: logging.data });
        for (pin in pins) {
            pins[pin][2].number.unwatchAll();
        }
        logging = undefined;
    } else {
        res.json({ error: "Not Currently Logging" });
        return 0;
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
app.use('/get-data', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Get-Data running on port: ' + port);

function startLogging(time) {
    //create a file, named by the start time
    var fileName = new Date().toISOString();
    header = "date,";
    for (pin in pins) {
        header += pins[pin][0];
        if (pin < pins.length - 1) {
            header += ",";
        }
    }
    header += "\n";

    if (!fs.existsSync(config.logDir)) {
        fs.mkdirSync(config.logDir);
    }

    //Write just the header to the file
    fs.writeFile(config.logDir + "/" + fileName + ".log", header, function (err) {
        if (err) throw err;
        console.log("Logging started in " + fileName);
    });

    for (pin in pins) {
        pins[pin].push(new coincidence(pins[pin][1]));
        pins[pin][2].number.watch(function (err, value) {
            pins[pin][2].count++;
        });
    }

    function coincidence(number) {
        this.number = new GPIO(number, 'in', 'falling');
        this.count = 0;
    }

    function writeCountsToFile() {
        var logLine = new Date().toISOString() + ",";
        for (pin in pins) {
            logLine += pins[pin][2].count.toString();
            pins[pin][2].count = 0;
            if (pin < pins.length - 1) {
                logLine += ",";
            } else {
                logLine += "\n";
            }
        }
        fs.appendFile(config.logDir + "/" + fileName + ".log", logLine, function (err) {
        });
    }

    //Every x miliseconds, write the current counts to file
    return {
        data: { filename: fileName, header: header },
        interval: setInterval(writeCountsToFile, time)
    }
}