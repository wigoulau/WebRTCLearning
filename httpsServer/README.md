# 搭建HTTPS服务器
* 相关模块：https、fs

HTTPS服务器与HTTP服务器相比，需要增加安全认证，服务器端需要增加密钥。其他部分的代码基本一致
* 申请密钥
先确保电脑上安装了openssl，然后运行命令，后面一路回车，使用默认信息
```sh
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 99999 -nodes
```
这样就在本地生成2个文件：key.pem和cert.pem，然后把这2个文件复制到工作目录。后面创建服务器时需指定文件路径。
如果是商业项目的话，需要找专门的机构申请，如赛门铁克。

* 本地创建目录httpsServer，添加server.js文件
```js
var https = require("https");
var fs = require("fs");
var option = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};
server = https.createServer(option, function(request, response) {
    // head

    // content
    response.write("Hello nodejs");
    
    response.end();
});
server.listen(8081);
console.log("https server start: https://127.0.0.1:8081");
```
打开终端，进入httpServer目录，启动服务器：
```sh
node server.js
```
然后打开浏览器，输入地址：
https://127.0.0.1:8081，需注意地址为https，然后浏览器会提示安全问题，点击“高级”--“继续前往”，出现“Hello node.js”页面，说明https服务器已启动
所以https与http的差别，就只是在createServer时，将密钥传进去就可以了，其他的代码都一样。
当然这个是在本地环境下的实验。如果是放到公网服务器上的话，需要到认证机构申请证书。目前腾讯云和阿里云对于小站提供免费的证书，可以直接到控制台申请，下载证书后，替换*.pem就可以了。
