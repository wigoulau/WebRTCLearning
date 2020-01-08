var localVideo = document.getElementById('localVideo');
var constraints = {video: true, audio: false};

// judge if support getUserMedia
function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function getUserMediaSuccess(stream) {
    //console.log('getUserMedia success', stream);
    localVideo.srcObject = stream;
}

function getUserMediaError(error) {
    console.log("getUserMedia error:", error);
}

if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
} else {
    alert('The browser does not support getUserMedia');
}