/*
npm init -y
npm install express cors firebase-admin

Service account key
Firebase Console -> Project settings -> Service accounts -> Generate new private key
rename to serviceAccountKey.json and put it in this directory
*/


const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://audio-timecode-js-default-rtdb.europe-west1.firebasedatabase.app/"
});

const db = admin.database();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/timecode", async (req, res) => {
  const { timecode } = req.body;

  if (typeof timecode !== "number") {
    return res.status(400).send("Invalid timecode");
  }

  try {
    await db.ref("audioTimecode/current").set(timecode);
    res.send({ status: "ok" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Timecode server running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});