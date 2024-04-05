function toggleRecord() {
    // record user audio and save it to the #audio element
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        var audio = document.createElement('audio');

        var chunks = [];

        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', function (event) {
            chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', function () {
            // reverse audio playback in chunks before playing
            glboalChunks = chunks;
            var blob = new Blob(chunks, {
                type: 'audio/wav'
            });

            var buffer = blob.arrayBuffer().then(function (buffer) {
                var context = new AudioContext();
                context.decodeAudioData(buffer, function (buffer) {
                    var source = context.createBufferSource();
                    Array.prototype.reverse.call(buffer.getChannelData(0));
                    source.buffer = buffer;
                    source.connect(context.destination);
                    source.start();
                });
            });


            // var audioURL = URL.createObjectURL(blob);
            // audio.src = audioURL;
            // audio.play();


        });

        document.getElementById('start').addEventListener('click', function () {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                this.textContent = '||2';
            } else {
                mediaRecorder.start();
                this.textContent = 'Stop';
            }
        });
    })
}
