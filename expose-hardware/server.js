//Nodejs server contoling GPIO for HV/LV
//Config.js file has all the sttings
var config = require('./config')

var express = require('express');
var app = express();

//mppcHV import
var mppcHV = require('./mppcHV');
var mppcInterface = config.mppcInterface;
for(board in mppcInterface){
    mppcInterface[board] = new mppcHV(mppcInterface[board]);
}

//GPS import
var NEO6m = require('./neo6m');
var gps = new NEO6m();

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Base route with info
router.get('/', function (req, res) {
    res.send("<p>Welcome to the API '/', availible options are /gps , /mppcInterface/0</p>");
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

router.get('/mppcInterface/:board', function (req, res) {
    var board = Number(req.params.board);
    var data = {};
    data.board = board;
    data.boardADDR = mppcInterface[board].SLAVE_ADDR;
    data.channel = [];
    for (var channelNo = 0; channelNo < 8; channelNo++) {
        data.channel.push({});
        data.channel[channelNo].target = mppcInterface[board].readTarget(channelNo);
        data.channel[channelNo].voltage = mppcInterface[board].readVoltage(channelNo);
        data.channel[channelNo].temp = mppcInterface[board].readTemp(channelNo);
    }
    res.json(data);
});

router.post('/mppcInterface/:board/', function (req, res) {
    if (req.query.apiKey == config.apiKey) {
        var board = Number(req.params.board);
        mppcInterface[board].setTarget(Number(req.query.channel), Number(req.query.target));
        res.json(req.query);
    } else {
        res.json({ error: "Check API key" })
    }

});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with the route location
app.use(config.routeLocation, router);

// START THE SERVER
// =============================================================================
app.listen(config.port);
console.log('Expose Hardware running on port: ' + config.port);