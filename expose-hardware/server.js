//Nodejs server contoling GPIO for HV/LV
//Config.js file has all the sttings
var MPPC_INTERFACE_ADDR = 0x08;
var apiKey = "5309583059353902309";

var express = require('express');
var app = express();

//Api Imports
var readVoltage = require('./readVoltage');
var readTarget = require('./readTarget');
var setTarget = require('./setTarget');
var readTemp = require('./readTemp');

var voltageDump = require('./voltageDump');

//GPS import
var NEO6m = require('./neo6m.js');
var gps = new NEO6m();

var port = process.env.PORT || 80; // set our port

console.log("Server started");

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Base route with info to make sure everything is working (accessed at GET http://localhost:80/api)
router.get('/', function (req, res) {
    res.send("<p>Welcome to the API '/', availible options are /gps , /mppcInterface/0x08</p>");
});

router.get('/gps', function (req, res) {
    while (true) {
        try {
            var data = gps.data();
        } catch (EIO) {
            res.json({ error: "Communication error" });
            break;
        }
        if (data != null) {
            res.json(data);
            break;
        }
    }
});

router.get('/mppcInterface/:SLAVE_ADDR', function (req, res) {
    var SLAVE_ADDR = Number(req.params.SLAVE_ADDR);
    var data = {};
    data.boardADDR = SLAVE_ADDR;
    data.channel = [];
    for (var channelNo = 0; channelNo < 8; channelNo++) {
        data.channel.push({});
        data.channel[channelNo].target = readTarget(SLAVE_ADDR, channelNo);
        data.channel[channelNo].voltage = readVoltage(SLAVE_ADDR, channelNo);
        data.channel[channelNo].temp = readTemp(SLAVE_ADDR, channelNo);
    }
    res.json(data);
});

router.post('/mppcInterface/:SLAVE_ADDR/', function (req, res) {
    if (req.query.apiKey == apiKey) {
        var SLAVE_ADDR = Number(req.params.SLAVE_ADDR);
        setTarget(SLAVE_ADDR, Number(req.query.channel), Number(req.query.target));
        res.json(req.query);
    } else {
        res.json({ error: "Check API key" })
    }

});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);