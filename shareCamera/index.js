const fs = require('fs');
var nodeStatic = require('node-static')
var fileServer = new nodeStatic.Server();
 
// 一些配置信息
const cfg = {
    port: 8888,
    ssl_key: 'key.pem',
    ssl_cert: 'cert.pem'
};
 
const httpServ = require('https');
const WebSocketServer = require('ws').Server; // 引用Server类
 
// 创建request请求监听器
const processRequest = (req, res) => {
    fileServer.serve(req, res);
};
 
const app = httpServ.createServer({
    // 向server传递key和cert参数
    key: fs.readFileSync(cfg.ssl_key),
    cert: fs.readFileSync(cfg.ssl_cert)
}, processRequest).listen(cfg.port);
console.log('server: https://127.0.0.1:8888')
 
// 实例化WebSocket服务器
const wss = new WebSocketServer({
    server: app
});

var users = {};

function parseMessage(connection, message) {
    var data;
    try {
        data = JSON.parse(message);
    } catch (e) {
        console.log('Error parsing JSON');
        data = {};
    }

    switch (data.type) {
        case 'login':
            console.log("user logged in as ", data.name);
            if (users[data.name]) {
                sendTo(connection, {type:"login", success:false});
            } else {
                users[data.name] = connection;
                connection.name = data.name;
                sendTo(connection, {type:"login", success:true});
            }
            break;
        case 'offer':
            console.log("Sending offer to ", data.name);
            var conn = users[data.name];
            if (conn != null) {
                connection.otherName = data.name;
                sendTo(conn, {type:"offer", offer:data.offer, name:connection.name});
            }
            break;
        case 'answer':
            console.log("Sending answer to ", data.name);
            var conn = users[data.name];
            if (conn != null) {
                connection.otherName = data.name;
                sendTo(conn, {type:"answer", answer:data.answer});
            }
            break;
        case 'candidate':
            console.log("Sending candidate to ", data.name);
            var conn = users[data.name];
            if (conn != null) {
                sendTo(conn, {type:"candidate", candidate:data.candidate});
            }
            break;
        case 'leave':
            console.log("Disconnecting user from ", data.name);
            var conn = users[data.name];
            conn.otherName = null;
            if (conn != null) {
                sendTo(conn, {type:"leave"});
            }
            break;
        default:
            sendTo(connection, {type:"error", message:"Unrecognized command: " + data.type});
            break;
    }
}

function sendTo(conn, message) {
    conn.send(JSON.stringify(message));
}

wss.on("connection", function(connection) {
    console.log("User connected");

    connection.on("message", function(message) {
        console.log("Got message:", message);
        parseMessage(connection, message);
    });
    //connection.send("hello world!");

    connection.on('close', function() {
        if (connection.name) {
            console.log('delete:', connection.name);
            delete users[connection.name];
            if (connection.otherName) {
                console.log("Disconnecting user from", connection.otherName);
                var conn = users[connection.otherName];
                conn.otherName = null;
                if (conn != null) {
                    sendTo(conn, {type: "leave"});
                }
            }
        }
    });
});

wss.on('listening', function() {
});

