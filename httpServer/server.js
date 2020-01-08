var http = require('http');
var nodeStatic = require('node-static');

var fileServer = new (nodeStatic.Server)();

server = http.createServer(function(request, response) {
    fileServer.serve(request, response);
});

server.listen(8080);
console.log("http server start: http://127.0.0.1:8080");