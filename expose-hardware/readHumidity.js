// Read Humidity from SHT31-D sensor on I2C Line
// sudo node -e 'console.log(require("./setTarget")(0x08,0, 55.25))'

//Imports
var I2C = require('raspi-i2c').I2C;

class SHT31D {
    
}

// The default address is 0x44, ADR pin pulldown, 0x45 with pullup.
var SHT31_D_ADDR = 0x44;