var name,
    connectedUser;

var loginPage = document.querySelector('#login-page');
var callPage = document.querySelector('#call-page');
var usernameInput = document.querySelector('#username');
var loginButton = document.querySelector('#login');
var theirUsernameInput = document.querySelector('#theirusername');
var callButton = document.querySelector('#call');
var hangUpButton = document.querySelector('#hang-up');

callPage.style.display = "none";
loginButton.addEventListener('click', function(event) {
    name = usernameInput.value;
    if (name.length > 0) {
        send({type:"login", name:name});
    }
});

callButton.addEventListener('click', function(event) {    
    theirUsername = theirUsernameInput.value;
    console.log("their username is ", theirUsername)
    if (theirUsername.length > 0) {
        startPeerConnection(theirUsername);
    }
    
    //startPeerConnection(theirUsername);
});


var yourVideo = document.querySelector('#yours');
var theirVideo = document.querySelector('#theirs');
var yourConnection, stream;
var constraints = {video:true, audio:false};

//onLogin(true);

var connection = new WebSocket('wss://192.168.188.163:8888');
//var connection = new WebSocket('wss://127.0.0.1:8888');

connection.onopen = function() {
    console.log('connected');
}

connection.onmessage = function(message) {
    console.log("Got message", message.data);

    var data = JSON.parse(message.data);
    switch (data.type) {
        case "login":
            onLogin(data.success);
            break;
        case "offer":
            onOffer(data.offer, data.name);
            break;
        case "answer":
            onAnswer(data.answer);
            break;
        case "candidate":
            onCandidate(data.candidate);
            break;
        case "leave":
            onLeave();
            break;
        default:
            break;
    }
}

connection.onerror = function(error) {
    console.log("Got error", error);
}

function send(message) {
    if (connectedUser) {
        message.name = connectedUser;
    }
    connection.send(JSON.stringify(message));
}

function onLogin(success) {
    if (success === false) {
        alert("Login fail, please try a different name");
    } else {
        loginPage.style.display = "none";
        callPage.style.display = "block";
        startConnection();
    }
}

function onOffer(offer, name) {
    console.log("onOffer:", name, " want to connect you");
    connectedUser = name;
    yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

    yourConnection.createAnswer(cbCreateAnswerSuccess, cbCreateAnswerError);
}

function onAnswer(answer) {
    console.log("onAnswer:");
    yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function onCandidate(candidate) {
    console.log("onCandidate");
    yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function onLeave() {

}



function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function hasRTCPeerConnection() {
    return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection
        || window.mozRTCPeerConnection || window.msRTCPeerConnection);
}

function cbUserMediaSuccess(stream) {
    yourVideo.srcObject = stream;
    if (hasRTCPeerConnection()) {
        setupPeerConnection(stream);
    } else {
        alert("your browser does not support WebRTC: RTCPeerConnection");
    }
}

function cbuserMediaError(error) {
    console.log("getUserMedia error:", error);
}

function startConnection() {
    if (hasUserMedia()) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia(constraints, cbUserMediaSuccess, cbuserMediaError);
    } else {
        alert("your browser does not support WebRTC: getUserMedia");
    }
}

function setupPeerConnection(stream) {
    console.log("setupPeerConnection");
    var configuration = {
        "iceServers": [{"urls":"stun:stun.l.google.com:19032"}]
    };
    configuration = null;
    yourConnection = new RTCPeerConnection(configuration);

    // 设置流监听
    yourConnection.addStream(stream);
    yourConnection.onaddstream = function(event) {
        console.log("their video add stream");
        theirVideo.srcObject = event.stream;
    };

    // 设置ice处理事件
    yourConnection.onicecandidate = function(event) {
        console.log("onicecandidate:", event.candidate);
        if (event.candidate) {
            send({type:"candidate", candidate:event.candidate});
        }
    };
}

function cbCreateOfferSuccess(offer) {
    send({type:"offer", offer:offer});
    yourConnection.setLocalDescription(offer);
}

function cbCreateOfferError(error) {
    alert("createOffer fail:"+error);
}

function cbCreateAnswerSuccess(answer) {
    yourConnection.setLocalDescription(answer);
    send({type:"answer", answer:answer});
}

function cbCreateAnswerError(error) {
    alert("createAnswer fail:" + error);
}

function startPeerConnection(user) {
    console.log("connect user:", user);
    connectedUser = user;

    // create offer
    yourConnection.createOffer(cbCreateOfferSuccess, cbCreateOfferError);
}