let sourceNode;

let startTime = 0;          // AudioContext time when playback started
let pauseOffset = 0;        // Seconds already played
let isPlaying = false;

let lastSentSecond = -1;

const fileInput = document.getElementById("fileInput");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const timecodeEl = document.getElementById("timecode");

audioContext = new AudioContext();

bufferLoaded = false

// // Open file audio and upload it to the buffer
// fileInput.addEventListener("change", async (event) => {
//     const file = event.target.files[0]
//     console.log(file);
//     if (!file) return;
    
//     audioContext = new AudioContext();
//     const arrayBuffer = await file.arrayBuffer();
//     audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//     playBtn.disabled = false;
//     pauseBtn.disabled = false;
//     pauseOffset = 0;
//     updateTimecode(0);
// });

let buffer = null;

const load = () => {
  const request = new XMLHttpRequest();
  request.open("GET", "guitar-interlude.wav");
  request.responseType = "arraybuffer";
  request.onload = function() {
    let undecodedAudio = request.response;
    audioContext.decodeAudioData(undecodedAudio, (data) => {
        buffer = data
        bufferLoaded = true;
    });
  };
  request.send();
}

// const source = audioCtx.createBufferSource();
//   source.buffer = buffer;
//   source.connect(audioCtx.destination);
//   source.start();

// PLAY BUTTON
playBtn.addEventListener("click", () => {
    if(!bufferLoaded) return
    
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.connect(audioContext.destination);
    
    startTime = audioContext.currentTime - pauseOffset;
    sourceNode.start(0, audioContext.currentTime);
    isPlaying = true;
    
    sourceNode.onended = () => {
        isPlaying = false;
        pauseOffset = 0;
    };
});

// PAUSE BUTTON
pauseBtn.addEventListener("click", () => {
    if (!isPlaying) return;
    
    sourceNode.stop();
    pauseOffset = audioContext.currentTime - startTime;
    isPlaying = false;
});


// UPDATE TIMECODE
function update() {
    if (isPlaying) {
        const currentTime = audioContext.currentTime + startTime;
        updateTimecode(currentTime);

        const currentSecond = Math.floor(currentTime);
        if (currentSecond !== lastSentSecond) {
            lastSentSecond = currentSecond;
            sendTimecode(currentTime);
        }
    }
    requestAnimationFrame(update);
}

// UPDATE TIMECODE ON SCREEN
function updateTimecode(seconds) {
    timecodeEl.textContent = seconds
}

// SEND TO THE SERVER
function sendTimecode(seconds) {
    fetch("http://localhost:3000/timecode", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ timecode: seconds })
    }).catch(err => console.error(err));
}

load()

update();