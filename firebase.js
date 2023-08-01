import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQCMdnO4k37spHrM1p5S3T5WTllu98KmE",
  authDomain: "fir-3c5fd.firebaseapp.com",
  projectId: "fir-3c5fd",
  storageBucket: "fir-3c5fd.appspot.com",
  messagingSenderId: "155454181521",
  appId: "1:155454181521:web:d6752285251e8c62eb2f30",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
