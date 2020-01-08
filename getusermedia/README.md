# 采集、播放本地音视频：getUserMedia
浏览器提供getUserMedia的JS API可以方便的获取本地音视频流。不同浏览器的API会有所差异，在使用时，需判断浏览器是否支持，以及浏览器的兼容。
本地创建文件index.html和js/client.js
index.html内容：
```html
<!DOCTYPE html>
<head>
    <title>getUserMedia Demo</title>
</head>
<body>
    <h1>Show local camera video</h1>
    <video id='localVideo' autoplay></video>
    <script src='./js/client.js'></script>
</body>
```
client.js内容：
```js
var localVideo = document.getElementById('localVideo');
var constraints = {video: true, audio: false};
// judge if support getUserMedia
function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
function getUserMediaSuccess(stream) {
    //console.log('getUserMedia success', stream);
    localVideo.srcObject = stream;
}
function getUserMediaError(error) {
    console.log("getUserMedia error:", error);
}
if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
} else {
    alert('The browser does not support getUserMedia');
}
```
在浏览器中打开index.html文件，就可以显示camera的画面了。在Chrome、Firefox、Edge中显示正常。另外当有多个camera连接时（可安装虚拟摄像头软件来模拟），Firefox可以选择。其他浏览器默认显示其中的一个。
上面演示了本地打开摄像头的例子，如果要把代码放到http服务器中的话要怎样做呢？这个很简单，只要把这些文件添加到http server中。但是由于安全的原因，浏览器访问服务器来显示摄像头时，需要https服务器才可以。
可以直接在工作目录中添加server.js、key.pem、cert.pem，这部分就是与前面讲过的搭建https服务器一样：
```js
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
```
启动server:
```sh
npm install node-static
node server.js
```
浏览器访问https://127.0.0.1:8081，就会显示摄像头内容了

扩展：
* getUserMedia返回的stream中视频流什么格式的？yuv or h264 or vp9?
* 多个camera连接时，如何选择其中的某一个