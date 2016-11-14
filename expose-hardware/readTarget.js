// Read the target voltage of a high voltage module
// Command line single use example
// sudo node -e 'console.log(require("./readTarget")(0x08,0))'

var readLong = require("./readLong");

module.exports = function (SLAVE_ADDR, channel) {
    var CHANNEL_ADDR;
    switch (channel) {
        case 0:
            CHANNEL_ADDR = 0x40;
            break;
        case 1:
            CHANNEL_ADDR = 0x44;
            break;
        case 2:
            CHANNEL_ADDR = 0x48;
            break;
        case 3:
            CHANNEL_ADDR = 0x4C;
            break;
        case 4:
            CHANNEL_ADDR = 0x50;
            break;
        case 5:
            CHANNEL_ADDR = 0x54;
            break;
        case 6:
            CHANNEL_ADDR = 0x58;
            break;
        case 7:
            CHANNEL_ADDR = 0x5C;
            break;
        default:
            throw "Only 8 channels exist on hardware, select number, 0-7"
    }

    return readLong(SLAVE_ADDR, CHANNEL_ADDR) / 1000000;
}