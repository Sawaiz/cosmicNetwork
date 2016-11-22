var config = {};

config.databaseLocation = "http://10.50.0.106";
config.apiPort = 8000;
config.logDir = "./logs"

// Detector model
config.detector = {};
config.detector.name = "Lloyd Wright";
config.detector.description = "First three paddle detector, 2mmx2mm 50uM pixel size TSV MPPC Attached to 145mmx145mm plastic scintilator pannel with embedded fibers.";
config.detector.alias = "lloydWright";
config.detector.apiKey = "a3e68f42-03f6-4570-85bd-cc5f66c2da96";
config.detector.tags = "Three Paddle, Humidity, GPS";
config.detector.location = "Atlanta, GA";
config.detector.public = "true";


//Coincidence: Intruept pins to log counts from
config.pins = [
    ['Zero and One'  , 17],
    ['Zero and Two'  , 18],
    ['Zero and Three', 27],
    ['One and Two'   , 11],
    ['One and Three' , 25],
    ['Two and Three' , 09],
    ['Zero'          , 24],
    ['One'           , 23],
    ['Two'           , 22],
    ['Three'         , 10],
];

//Sensor: functions to get data
config.sensors = [
    latitude,
    pressure,
];

//this one is for testing
function latitude(){
    return {latitude: 34.51246};
}
function pressure(){
    return {pressure: 101.5};
}

module.exports = config;