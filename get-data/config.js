var config = {};

config.apiPort = 8000;
config.logDir = "./logs"

//its an array of arrays
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

module.exports = config;