# websocket通信
* 相关模块：ws

websocket与socket的使用差不多，需要加载ws模块，采用tcp通信，server端先创建Server，然后监听"connection"消息，当有client连接时，就会调用"connection"的回调函数，然后处理相关的消息和关闭事件，多个client连接时，每个连接会单独产生回调，每个连接创建一个WebSocket对象。
* server代码(server.js)
```js
var WebSocket = require('ws');
var wss = new WebSocket.Server({port: 8081});
wss.on("connection", function(ws) {
    console.log("[server] client connect");
    ws.send("server: hi, client");
    ws.onmessage = function(message) {
        console.log("[server] receive message:", message.data);
    }
    ws.onclose = function(event) {
        console.log("[server] close socket");
    }
});
```
* client代码(client.js)
```js
var WebSocket = require("ws");
let ws = new WebSocket("ws://localhost:8081");
ws.onopen = function() {
    console.log("[client] open connect");
    ws.send("client: hello, server");
};
ws.onmessage = function(event) {
    console.log("[client] receive message from server: " + event.data);
    setTimeout(() => {
        ws.close();
    }, 5000);
};
ws.onclose = function(params) {
    console.log("[client] close connect");
};
```

打开终端，启动服务器：
```sh
node server.js
```
运行客户端（可以多个）：
```sh
node client.js
```

