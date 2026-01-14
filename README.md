# Project Title

Web Audio Synchronization

## Abstract

Audio synchronisation between web applications both remotely (via Firebase real-time database) and locally. 

## Instruction

## Instructions for running the software

### Server

1. Initialize the server application and install the requirements:

```bash
npm init -y
npm install express cors firebase-admin
```

2.	Create a Firebase project.
3.	Create a Service Account key:  
*Firebase Console* > *Project settings* > *Service accounts* > **Generate new private key**
4. Rename the file to serviceAccountKey.json and place it in the
 [server](https://github.com/alessandrofiordelmondo/webaudio-synch/tree/main/software/server)￼ directory.
5. Run the server:

```bush
node server.js
```

### Main

Run the application locally or via npx from the [main](https://github.com/alessandrofiordelmondo/webaudio-synch/tree/main/software/main) directory:

 ```bash
 npx server
 ```

 ### Listner

1. In your Firebase project, copy the Firebase configuration:

```bash
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```
You can find it in:  
*Project settings* > *General* > **Add web app** (if it does not already exist).
2. .Create a file named **firebaseConfig.js** in the
[listner](https://github.com/alessandrofiordelmondo/webaudio-synch/tree/main/software/listner) directory.
3. Paste the Firebase configuration into **firebaseConfig.js** as follows and save the file:

```bash
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

4. Run the application via npx from the [listner](https://github.com/alessandrofiordelmondo/webaudio-synch/tree/main/software/listner) directory:

```bash
npx server
```