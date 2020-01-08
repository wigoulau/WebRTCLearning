# 搭建HTTP服务器
* 相关模块：http

一般大型系统的HTTP服务器由Apache、Nginx、IIS类软件来搭建，但对于一些小型系统或做实验时，可以直接有nodejs或python(Flask)来搭建，nodejs提供了http模块，可以快速构建http服务器。
本地创建目录，如httpServer，然后创建新文件server.js，代码如下：
```js
var http = require('http');
server = http.createServer(function(request, response) {
    // http head
    response.writeHead(200, {
        "content-type":"text/plain"
    });
    // web content
    response.write("Hello nodejs");
    response.end();
});
server.listen(8080);

console.log("http server start: http://127.0.0.1:8080");
```
打开终端，进入httpServer目录，启动服务器：
```sh
node server.js
```
然后打开浏览器，输入地址：
http://127.0.0.1:8080，出现“Hello node.js”页面，说明http服务器已启动
到此http服务器的搭建就完成了。
但是这样的服务器根本没什么用，要添加前端显示内容时，不可能都在response.write中写，还是需要像Nginx等服务器一样，前端代码分离出来，服务器只做http交互的工作。
刚好nodejs提供了这样的一个模块node-static，前端代码就可单独放在index.html中。
在工作目录下，添加server.js、index.html文件
* server.js文件代码如下
``` js
var http = require('http');
var nodeStatic = require('node-static');
var fileServer = new (nodeStatic.Server)();
server = http.createServer(function(request, response) {
    fileServer.serve(request, response);
});
server.listen(8080);
console.log("http server start: http://127.0.0.1:8080");
```
* index.html文件代码如下
```html
<!DOCTYPE html>
<head>
    <title>http server Demo</title>
</head>
<body>
    <h1>Hello nodejs!!</h1>
</body>
```
服务器中使用了node-static模块，但nodejs默认没有支持，需要在工程中安装此模块
```sh
npm install node-static
```
然后启动服务器
```sh
node server.js
```
浏览器访问http://127.0.0.1:8080