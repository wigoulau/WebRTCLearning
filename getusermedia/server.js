var https = require("https");
var fs = require("fs");
var nodeStatic = require('node-static')
var fileServer = new nodeStatic.Server();
var option = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

server = https.createServer(option, function(request, response) {
    fileServer.serve(request, response);
});

server.listen(8081);
console.log("https server start: https://127.0.0.1:8081");