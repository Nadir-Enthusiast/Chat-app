import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBrt-sS727LMoLjFsvIMZ4OBnj4k5ZUmc0",
  authDomain: "group-chat-simple.firebaseapp.com",
  projectId: "group-chat-simple",
  storageBucket: "group-chat-simple.appspot.com",
  messagingSenderId: "1017128033807",
  appId: "1:1017128033807:web:7287e6ed04a82ac2204d7a",
  measurementId: "G-Y9FPQSQ57W"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const db = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, firestore, db };
