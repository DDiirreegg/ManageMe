import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC8_aDkO6JzL8j0XcYEhlHEi2DHRFMfUD0",
  authDomain: "manageme-425800.firebaseapp.com",
  projectId: "manageme-425800",
  storageBucket: "manageme-425800.appspot.com",
  messagingSenderId: "146612636621",
  appId: "1:146612636621:web:0d0abeba85446d89b31284",
  measurementId: "G-RM3VVBRR3V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
