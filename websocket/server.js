var WebSocket = require('ws');
var wss = new WebSocket.Server({port: 8081});
wss.on("connection", function(ws) {
    console.log("[server] client connect");
    ws.send("server: hi, client");
    ws.onmessage = function(message) {
        console.log("[server] receive message:", message.data);
    }
    ws.onclose = function(event) {
        console.log("[server] close socket");
    }
});