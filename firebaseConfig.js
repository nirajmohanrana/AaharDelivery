import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { GoogleAuthProvider } from "firebase/auth";

// AAHAR  API
const firebaseConfig = {
  apiKey: "",
  authDomain: "aahar-109e8.firebaseapp.com",
  projectId: "aahar-109e8",
  storageBucket: "aahar-109e8.appspot.com",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();

const provider = new GoogleAuthProvider();

export default app;
export { db, auth, storage, provider };
