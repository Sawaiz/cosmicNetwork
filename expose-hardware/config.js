var config = {};

// This is a array of i2c adresses of mppcInterface devices
config.mppcInterface = [0x08];
config.apiKey = "5309583059353902309";

//Route location is coming form load balancer
config.routeLocation = "/api/hardware";
config.port = 8000; // set our port

module.exports = config;