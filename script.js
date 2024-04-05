var chunks = [];
var mediaRecorder;
var startTime;
var angle;
var startButton;
var interval;

//onload
document.addEventListener('DOMContentLoaded', function () {
    startButton = document.getElementById('start');
    setupMediaRecorder();
    typePreviewText();
});

function startRecording() {
    chunks = [];
    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
}

function setupMediaRecorder() {
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.addEventListener('dataavailable', function (event) {
            chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', function () {
            var blob = new Blob(chunks, {
                type: 'audio/wav'
            });

            blob.arrayBuffer().then(function (buffer) {
                var context = new AudioContext();
                context.decodeAudioData(buffer, function (buffer) {
                    var source = context.createBufferSource();
                    Array.prototype.reverse.call(buffer.getChannelData(0));
                    source.buffer = buffer;
                    source.connect(context.destination);
                    source.start();

                });
            });
        });
    });
}

function toggleRecord() {
    if (mediaRecorder.state === 'recording') {
        stopRecording();
        rotateBack();
    } else {
        startRecording();
        startTurning();
    }
}

function typePreviewText() {
    var subtitle = document.getElementById('subtitle');
    subtitle.value = "";
    document.getElementById('eltitbus').value = "";
    var preview = "And I sound like this...";
    // slowly type out the preview text
    var i = 0;
    var interval = setInterval(function () {
        subtitle.value += preview.charAt(i);
        i++;
        if (i > preview.length) {
            subtitle.focus();
            clearInterval(interval);
        }
        reverse();
    }, 200);

}

function reverse() {
    var eltitbus = document.getElementById('eltitbus');
    var subtitle = document.getElementById('subtitle');
    eltitbus.value = subtitle.value.split('').reverse().join('');
}

function startTurning() {
    angle = 0;
    angle = (angle + 30) % 360;
    startButton.style.transform = 'rotate(' + angle + 'deg)';
    startTime = new Date().getTime();
    interval = setInterval(function () {
        angle = (angle + 30) % 360;
        startButton.style.transform = 'rotate(' + angle + 'deg)';
    }, 1000);
}

function rotateBack() {
    clearInterval(interval);
    var duration = new Date().getTime() - startTime;

    // rotate back to 0 deg in duration ms. use global angle variable
    startButton.style.transition = 'transform ' + duration + 'ms linear';
    startButton.style.transform = 'rotate(0deg)';

}
