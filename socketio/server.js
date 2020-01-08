var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

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