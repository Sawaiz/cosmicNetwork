var WebSocketServer = require('ws').Server;

//**END CONFIGURATION**//
console.log("Server started");

var wss = new WebSocketServer({ port: config.dbPort });
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message);
        switch (message.subject) {
            case "newDetector":
                console.log("newDetector");
                break;
            case "detectorList":
                console.log("detectorList");
                break;
            case "ping":
                break;
            default:
                console.log(message.subject);
        }
    });
});

function addDetector(payload, websocket) {
    detectors.create(payload);
}

function sendData(websocket, device) {
    event.findAll({
        attributes: ["coincidence", "createdAt"],
        where: { deviceId: device }
    }).then(function (events) {
        websocket.send(JSON.stringify({
            subject: "data",
            payload: events
        }));
    })
}

function sendDetectorList(websocket) {
    detectors.findAll({
        attributes: ["name", "alias", "description", "location", "createdAt"],
    }).then(function (detectors) {
        websocket.send(JSON.stringify({
            subject: "detectorList",
            payload: detectors
        }
        ));
    })
}

//   var sqlData = {};
//   for (var key in queryData) {
//     sqlData[key] = queryData[key];
//   }
//   event.create(sqlData);