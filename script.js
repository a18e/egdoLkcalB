var mediaRecorder;
var startTime;
var angle;
var startButton;
var interval;
var reverseBlob;

//onload
document.addEventListener('DOMContentLoaded', function () {
    startButton = document.getElementById('start');
    setupMediaRecorder();
    typePreviewText();
});

function play() {
    document.getElementById('audio').play();
}

function startRecording() {
    mediaRecorder.start();
    console.log('recording');
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('stopped recording');
}

 function setupMediaRecorder() {
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        console.log('media recorder created');
        var chunks = [];

        mediaRecorder.addEventListener('dataavailable', function (event) {
            chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', function () {
            console.log('media recorder event stop');
            var blob = new Blob(chunks, {
                type: 'audio/wav'
            });
            chunks = [];

            blob.arrayBuffer().then(function (buffer) {
                var context = new AudioContext();
                context.decodeAudioData(buffer, function (buffer) {
                    var source = context.createBufferSource();
                    Array.prototype.reverse.call(buffer.getChannelData(0));
                    source.buffer = buffer;
                    source.connect(context.destination);
                    var dest = context.createMediaStreamDestination();
                    source.connect(dest);

                    source.start();
                    var reverseRecorder = new MediaRecorder(dest.stream);
                    reverseRecorder.start();
                    var reversechunks = [];

                    reverseRecorder.ondataavailable = function (e) {
                        reversechunks.push(e.data);
                    };

                    reverseRecorder.onstop = function (e) {
                        reverseBlob = new Blob(reversechunks, {
                            type: 'audio/wav'
                        });
                        var url = URL.createObjectURL(reverseBlob);
                        var downloadButton = document.getElementById('download');
                        downloadButton.style.marginTop = '1vh';
                        downloadButton.href = url;
                        var filename = document.getElementById('subtitle').value.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.wav';
                        downloadButton.download = filename;
                        document.getElementById('audio').src = url;
                    };

                    setTimeout(function () {
                        console.log('stopping reverserecorder');
                        reverseRecorder.stop();
                    }, buffer.length / 44100 * 1000);

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
    }, 50);

}

function reverse() {
    var eltitbus = document.getElementById('eltitbus');
    var subtitle = document.getElementById('subtitle');
    eltitbus.value = subtitle.value.split('').reverse().join('');
    if (subtitle.value.length === 0) {
        // subtitle.style.borderRight = '10px solid white';
    } else {
        subtitle.style.border = 'none';
    }
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

    // expand buttons
    downloadButtons = document.getElementById('buttons');
    downloadButtons.style.width = '100px';
    downloadButtons.style.marginTop = '-55px';
}

function rotateBack() {
    clearInterval(interval);
    var duration = new Date().getTime() - startTime;

    // rotate back to 0 deg in duration ms. use global angle variable
    startButton.style.transition = 'transform ' + duration + 'ms linear';
    startButton.style.transform = 'rotate(0deg)';

    // collapse buttons
    downloadButton = document.getElementById('download');
    downloadButtons = document.getElementById('buttons');
    downloadButtons.style.width = '100%';
    downloadButtons.style.marginTop = '0';
}
