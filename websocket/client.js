var WebSocket = require("ws");
let ws = new WebSocket("ws://localhost:8081");
ws.onopen = function() {
    console.log("[client] open connect");
    ws.send("client: hello, server");
};
ws.onmessage = function(event) {
    console.log("[client] receive message from server: " + event.data);
    setTimeout(() => {
        ws.close();
    }, 5000);
};
ws.onclose = function(params) {
    console.log("[client] close connect");
};