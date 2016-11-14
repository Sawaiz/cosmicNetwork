var config = {};

config.apiPort = 8000;
config.logDir = "./logs"

//its an array of arrays
config.pins = [
    ['One and Two'   , 22],
    ['One and Three' , 27],
    ['One and Four'  , 17],
    ['Two and Three' , 06],
    ['Two and Four'  , 26],
    ['Three and Four', 05],
];

module.exports = config;