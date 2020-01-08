var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    // send data to 'news' room
    socket.emit('news', {hello: 'world'});
    // when receive message 'my other event', call this function
    socket.on('my other event', function(data) {
        console.log(data);
    });
});

console.log("server start: https://127.0.0.1:8080");