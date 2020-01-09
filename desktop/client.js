var localVideo = document.getElementById('localVideo');
var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
var constraints = {
    video: true,
    audio: false
};
var isExtensionInstalled = false;

window.addEventListener('message', function (event) {
    console.log('has message', event.data.type, event.data);
    if (event.origin != window.location.origin) {
        console.log('error');
        //return;
    }
    if (event.data.type) {
        if (event.data.type === 'SS_PING') {
            this.console.log('extension has been installed');
            this.isExtensionInstalled = true;
        } else if (event.data.type === 'SS_DIALOG_SUCCESS') {
            this.console.log('dialog success, show screen');
            startScreenStream(event.data.streamId);
        } else if (event.data.type === 'SS_DIALOG_CANCEL') {
            this.console.log('user cancel');
        }
    }
});


// judge if support getUserMedia
function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function getUserMediaSuccess(stream) {
    //console.log('getUserMedia success', stream);
    localVideo.srcObject = stream;
}

function getUserMediaError(error) {
    console.log("getUserMedia error:", error);
}

function startScreenStream(streamId) {
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
                maxWidth: window.screen.width,
                maxHeight: window.screen.height
            }
        }
    };

    if (hasUserMedia()) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
    } else {
        alert('The browser does not support getUserMedia');
    }
}

function main() {
    console.log('hello screen');
    if (!isExtensionInstalled) {
        console.log('extension has not been installed');
    }

    var audioConstraints = {
        audio: true,
        video: false
    };
    navigator.getUserMedia(audioConstraints, function (astream) {
        console.log('start');
        window.postMessage({
            type: 'SS_UI_REQUEST',
            text: 'start'
        }, '*');
    }, function (error) {
        console.error('failed to create audio stream ' + error);
        return;
    });
}

main();