// Dump all data for specific mppcInterface slave
// Example single line command line call
//
// sudo node -e 'require("./voltageDump")(0x08)'
//
// Yeilds Markdown Compatible output, example
//
// |Board   0x08|  Channel 0 |  Channel 1 |  Channel 2 |  Channel 3 |  Channel 4 |  Channel 5 |  Channel 6 |  Channel 7 |
// |------------|------------|------------|------------|------------|------------|------------|------------|------------|
// |Target   (V)|  55.000000 |   0.000000 |   0.000000 |   0.000000 |   0.000000 |   0.000000 |   0.000000 |   0.000000 |
// |Voltage  (V)|  54.981052 |   4.478388 |   4.515167 |   4.510402 |   0.000000 |   0.000000 |   0.000000 |   0.000000 |
// |Temp     (C)| 191.728096 |  89.277376 |  89.540376 |  89.507904 |   0.000000 |   0.000000 |   0.000000 |   0.000000 |


var readVoltage = require('./readVoltage');
var readTemp = require('./readTemp');
var readTarget = require('./readTarget');

module.exports = function (SLAVE_ADDR) {

    console.log("|Board   0x" + ("0" + SLAVE_ADDR.toString(16)).slice(-2) + "| " +
        " Channel 0 | " +
        " Channel 1 | " +
        " Channel 2 | " +
        " Channel 3 | " +
        " Channel 4 | " +
        " Channel 5 | " +
        " Channel 6 | " +
        " Channel 7 | "
    );

    console.log(
        "|------------" +
        "|------------" +
        "|------------" +
        "|------------" +
        "|------------" +
        "|------------" +
        "|------------" +
        "|------------" +
        "|------------" +
        "|"
    );


    console.log("|Target   (V)| " +
        ("  " + readTarget(SLAVE_ADDR, 0).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 1).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 2).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 3).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 4).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 5).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 6).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTarget(SLAVE_ADDR, 7).toFixed(6).toString()).slice(-10) + " | "
    );

    console.log("|Voltage  (V)| " +
        ("  " + readVoltage(SLAVE_ADDR, 0).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 1).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 2).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 3).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 4).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 5).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 6).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readVoltage(SLAVE_ADDR, 7).toFixed(6).toString()).slice(-10) + " | "
    );

    console.log("|Temp     (C)| " +
        ("  " + readTemp(SLAVE_ADDR, 0).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 1).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 2).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 3).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 4).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 5).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 6).toFixed(6).toString()).slice(-10) + " | " +
        ("  " + readTemp(SLAVE_ADDR, 7).toFixed(6).toString()).slice(-10) + " | "
    );
}