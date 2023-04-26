import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACEksh0hlO9FQUAy3IjQkCwe7Cof5Il1U",
  authDomain: "aahar-109e8.firebaseapp.com",
  projectId: "aahar-109e8",
  storageBucket: "aahar-109e8.appspot.com",
  messagingSenderId: "889513020046",
  appId: "1:889513020046:web:444d7956731ad698f597df",
  measurementId: "G-1X3J5XKQFN",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();

const provider = new GoogleAuthProvider();

export default app;
export { db, auth, storage, provider };
