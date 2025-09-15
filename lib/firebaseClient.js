// lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbzYGmSL5xXOP-Z2b6srVaex_6OriK_v4",
  authDomain: "glise-58e2b.firebaseapp.com",
  projectId: "glise-58e2b",
  storageBucket: "glise-58e2b.appspot.com",
  messagingSenderId: "757302135036",
  appId: "1:757302135036:web:a076805710b05022a12f79",
  measurementId: "G-1WLC6FVWBY"
};

// Inicializa Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };