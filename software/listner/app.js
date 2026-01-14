/*
Project settings -> General -> your apps -> add web app -> copy firebaseConfig here
*/
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "./firbaseConfig.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const syncBtn = document.getElementById("syncBtn");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getDatabase(app);

const timecodeEl = document.getElementById("timecode");
// const timecodeRef = ref(db, "audioTimecode/current");

let audioContext = new AudioContext();
let sourceNode;
let buffer = null;
let bufferLoaded = false

// onValue(timecodeRef, (snapshot) => {
//     const seconds = snapshot.val();
//     if (typeof seconds === "number") {
//     timecodeEl.textContent = formatTimecode(seconds);
//     }
// });

function formatTimecode(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return (
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0") + "." +
    String(ms).padStart(3, "0")
    );
}

// Audio

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

const dbRef = ref(getDatabase(app));

syncBtn.addEventListener("click", () => {
    get(child(dbRef, "audioTimecode/current")).then((snapshot) => {
        if (snapshot.exists()) {
            const seconds = snapshot.val();
            if (typeof seconds === "number") {
                sourceNode = audioContext.createBufferSource();
                sourceNode.buffer = buffer;
                sourceNode.connect(audioContext.destination);

                sourceNode.start(0, audioContext.currentTime + seconds);
                isPlaying = true;
            
                sourceNode.onended = () => {
                    isPlaying = false;
                    pauseOffset = 0;
                };
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    // get(timecodeRef, (snapshot) => {
    //     console.log(snapshot)
    //     const seconds = snapshot.val();
   
    //     }})
})

load()