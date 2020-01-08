var https = require("https");
var fs = require("fs");
var option = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};
server = https.createServer(option, function(request, response) {
    // head
    
    // content
    response.write("Hello nodejs");
    
    response.end();
});
server.listen(8081);
console.log("https server start: https://127.0.0.1:8081");