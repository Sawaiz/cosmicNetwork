//Reads four bytes from i2c, and returns them as a long.

//Imports
var I2C = require('raspi-i2c').I2C;

var mppcInterfaceBuffer = new ArrayBuffer(4);
var dataview = new DataView(mppcInterfaceBuffer);

module.exports = function readLong(SLAVE_ADDR, ADDR) {
    var i2c = new I2C();
    var tries = 0;
    var maxTries = 3;
    while (true) {
        try {
            i2c.writeByteSync(SLAVE_ADDR, ADDR);
            break;
        } catch (EIO) {
            tries++;
            if (maxTries <= tries) {
                throw "Can not write byte";
            }
        }
    }
    for (var byte = mppcInterfaceBuffer.byteLength - 1; byte >= 0; byte--) {
        dataview.setUint8(byte, i2c.readByteSync(SLAVE_ADDR));
    }
    return dataview.getInt32(0);
}
