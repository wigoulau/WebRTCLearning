## RTCPeerConnection
index.html代码：
```html
<!DOCTYPE html>
<head>
    <title>RTCPeerConnection Demo</title>
</head>
<body>
    <h1>Show localVideo and remoteVideo by RTCPeerConnection</h1>
    <video id='localVideo' autoplay>Local</video>
    <video id='remoteVideo' autoplay>Remote</video>
    <script src='client.js'></script>
</body>
```
client.js代码：
```js

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var localPeerConnection, remotePeerConnection;
function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
function hasRTCPeerConnection() {
    return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection || window.msRTCPeerConnection);
}
function getUserMediaSuccess(stream) {
    console.log('getUserMedia success:', stream);
    localVideo.srcObject = stream;
    if (hasRTCPeerConnection()) {
        startPeerConnection(stream);
    }
}
function getUserMediaError(error) {
    console.log("getUserMedia error:", error);
}
function createOfferSuccess(description) {
    console.log('[local] localPeerConnection createOffer description:', description);
    localPeerConnection.setLocalDescription(description);
    sendAndReceiveOffer(description);
}
function createOfferError(error) {
    console.log('createOffer error:', error);
}
function startPeerConnection(localstream) {
    console.log('start local RTCPeerConnection');
    localPeerConnection = new RTCPeerConnection(null);
    localPeerConnection.addStream(localstream);
    var offerOption = {
        offerToReceiveVideo: 1
    };
    localPeerConnection.createOffer(offerOption).then(createOfferSuccess).catch(createOfferError);
    localPeerConnection.onicecandidate = handleLocalConnection;
}
function createAnswerSuccess(description) {
    console.log('[local] localPeerConnection createAnswer description:', description);
    remotePeerConnection.setLocalDescription(description);
    sendAndReceiveAnswer(description);
}
function createAnswerError(error) {
    console.log('createAnswer error:', error);
}
// Handles remote MediaStream success by adding it as the remoteVideo src.
function gotRemoteMediaStream(event) {
    console.log('[remote] update remote stream');
    remoteVideo.srcObject = event.stream;
}
function sendAndReceiveOffer(offerDescription) {
    console.log('[remote] receive offer, create answer');
    remotePeerConnection = new RTCPeerConnection(null);
    remotePeerConnection.setRemoteDescription(offerDescription);
    remotePeerConnection.onicecandidate = handleRemoteConnection;
    //remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);
    remotePeerConnection.onaddstream = gotRemoteMediaStream;    
    remotePeerConnection.createAnswer().then(createAnswerSuccess).catch(createAnswerError);
}
function sendAndReceiveAnswer(answerDescription) {
    console.log('[local] receive answer:', answerDescription);
    localPeerConnection.setRemoteDescription(answerDescription);
}
function handleLocalConnection(event) {
    if (event.candidate) {
        newIceCandidate = new RTCIceCandidate(event.candidate);
        remotePeerConnection.addIceCandidate(newIceCandidate);
    }
}
function handleRemoteConnection(event) {
    if (event.candidate) {
        newIceCandidate = new RTCIceCandidate(event.candidate);
        localPeerConnection.addIceCandidate(newIceCandidate);
    }
}
function main() {
    let constraints = {
        video: true,
        audio: false
    };
    if (hasUserMedia()) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
    }
}
main();
```
* 测试运行
浏览器上运行index.html，就会显示2个视频
![image.png](./assets/Image.png)

代码的运行过程为：
```mermaid
graph TD
A0[main]-->A1(getUserMedia)
A1-->A2(localPeerConnection = new RTCPeerConnection)
A2-->A3(CreateOffer)
A3-->A4(SendAndReceiveOffer)
A4-->A5(remotePeerConnection = new RTCPeerConnection)
A5-->A6(CreateAnswer)
A6-->A7(SendAndReceiveAnswer)
A7-->A8(handleLocalConnection)
A7-->A9(handleRemoteConnection)
A9-->A10(onaddstream)
```
