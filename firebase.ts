import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { DEMO_MODE } from "./config";

// TODO: Replace with your actual Firebase project configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDummyKey-REPLACE_WITH_YOUR_OWN",
  authDomain: "muqs-squash-school.firebaseapp.com",
  projectId: "muqs-squash-school",
  storageBucket: "muqs-squash-school.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Only validate config if NOT in demo mode
const isValidConfig = (config: typeof firebaseConfig) => {
  if (DEMO_MODE) return false;
  return config.apiKey && 
         !config.apiKey.includes("REPLACE_WITH_YOUR_OWN") && 
         config.apiKey.length > 20;
};

export const isConfigured = isValidConfig(firebaseConfig);

let app;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (isConfigured && !DEMO_MODE) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
    auth = null as unknown as Auth;
    db = null as unknown as Firestore;
    storage = null as unknown as FirebaseStorage;
  }
} else {
  // Exports are null in Demo Mode to ensure no accidental usage
  auth = null as unknown as Auth;
  db = null as unknown as Firestore;
  storage = null as unknown as FirebaseStorage;
}

export { auth, db, storage };