//Read the temprature of a high voltage module
// Command line single use example
// sudo node -e 'console.log(require("./readTemp")(0x08,0))'

var readLong = require("./readLong");

module.exports = function (SLAVE_ADDR, channel) {
    var CHANNEL_ADDR;
    switch (channel) {
        case 0:
            CHANNEL_ADDR = 0x20;
            break;
        case 1:
            CHANNEL_ADDR = 0x24;
            break;
        case 2:
            CHANNEL_ADDR = 0x28;
            break;
        case 3:
            CHANNEL_ADDR = 0x2C;
            break;
        case 4:
            CHANNEL_ADDR = 0x30;
            break;
        case 5:
            CHANNEL_ADDR = 0x34;
            break;
        case 6:
            CHANNEL_ADDR = 0x38;
            break;
        case 7:
            CHANNEL_ADDR = 0x3C;
            break;
        default:
            throw "Only 8 channels exist on hardware, select number, 0-7"
    }

    return readLong(SLAVE_ADDR, CHANNEL_ADDR) / 1000000;
}