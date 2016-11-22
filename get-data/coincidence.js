// Library takes a array of pins and names, and attaches interupts
// 
// config.pins = [
//     ['Zero and One'  , 17],
//     ['Zero and Two'  , 18],
//     ['Zero and Three', 27],
//     ['One and Two'   , 11],
//     ['One and Three' , 25],
//     ['Two and Three' , 09],
//     ['Zero'          , 24],
//     ['One'           , 23],
//     ['Two'           , 22],
//     ['Three'         , 10],
// ];
//
// //Use Example
// var logToDB = require("./logToDB");
// var db = new logToDB(config.databaseLocation, config.detector);
// db.log({"Zero":5}); 
// 

// Imports
var GPIO = require('onoff').Gpio; // Constructor function for Gpio objects.

module.exports = class coincidence {
    constructor(pins) {
        // pins is an array of interupt GPIO to use
        this.pins = pins;
        // Start Logging
        this.start();
    }

    start() {
        if (this.logging) {
            return ({ status: "Currently Logging" });
        } else {
            this._setPinInterupts();
            this.logging = true;
            return ({ status: "Logging Started" })
        }
    }

    stop() {
        if (this.logging) {
            this._disablePinInterupts();
            this.logging = false;
            return ({ status: "Logging stopped"});
        } else {
            return ({ status: "Not Currently Logging" });
        }
    }

    log() {
        if (this.logging) {
            // Go through the interupt counts, add them to data, reset value to 0
            var data = {};
            for (pin in this.pins) {
                data[this.pins[pin][0]] = this.pins[pin][2].count;
                this.pins[pin][2].count = 0;
            }
            return data;
        } else {
            return {};
        }

    }

    _setPinInterupts() {
        for (var pin in this.pins) {
            this.pins[pin].push(new coincidence(this.pins[pin][1]));
            //Callback requires a scoped pin number
            setWatch(this.pins, pin);
        }

        function setWatch(pins, pin) {
            pins[pin][2].number.watch(function (err, value) {
                pins[pin][2].count++;
            });
        }

        function coincidence(number) {
            this.number = new GPIO(number, 'in', 'falling');
            this.count = 0;
        }
    }

    _disablePinInterupts() {
        for (pin in this.pins) {
            this.pins[pin][2].number.unwatchAll();
        }
    }


} 