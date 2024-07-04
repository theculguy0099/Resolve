// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaHlmD3jsixV_WlbK1xGk6_FDHVzn3cSQ",
  authDomain: "resolve-12f6e.firebaseapp.com",
  projectId: "resolve-12f6e",
  storageBucket: "resolve-12f6e.appspot.com",
  messagingSenderId: "586594678961",
  appId: "1:586594678961:web:5209c8d69912b7e8338a90",
  measurementId: "G-DRBYTHB282"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);

export { auth, firestore, db};
