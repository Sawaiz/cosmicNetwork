// Set the voltage of a specific channel
// sudo node -e 'console.log(require("./setTarget")(0x08,0, 55.25))'

var writeLong = require("./writeLong");

module.exports = function (SLAVE_ADDR, channel, voltage) {
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

    writeLong(SLAVE_ADDR, CHANNEL_ADDR, Math.round(voltage * 1000000));

    return 0;
}