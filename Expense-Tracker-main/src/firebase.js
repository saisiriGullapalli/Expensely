// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUJ62KfCFVoG-9g0lKuuuFtI8Y30Jw-5A",
  authDomain: "expencely.firebaseapp.com",
  projectId: "expencely",
  storageBucket: "expencely.appspot.com",
  messagingSenderId: "715174385787",
  appId: "1:715174385787:web:bbe34fa3be57e9209f2ade",
  measurementId: "G-6LSGDKC97D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };