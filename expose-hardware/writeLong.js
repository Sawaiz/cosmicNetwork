//Writes four bytes out

var I2C = require('raspi-i2c').I2C;

var mppcInterfaceBuffer = new ArrayBuffer(4);
var dataview = new DataView(mppcInterfaceBuffer);

module.exports = function (SLAVE_ADDR, ADDR, long) {
    var i2c = new I2C();
    dataview.setInt32(0, long);
    for (var byte = 0; byte < mppcInterfaceBuffer.byteLength; byte++) {
        i2c.writeByteSync(SLAVE_ADDR, ADDR + byte, dataview.getUint8(mppcInterfaceBuffer.byteLength - byte - 1));
    }
}