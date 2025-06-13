
// src/lib/firebaseClientConfig.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // If you need client-side storage
// import { getAnalytics, type Analytics } from "firebase/analytics"; // If you need analytics

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// --- CRITICAL CHECK ---
// Log these values to the BROWSER console to help debug.
console.log("Firebase Client Config Values (Check BROWSER CONSOLE):");
console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "SET" : "MISSING or undefined");
console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "SET" : "MISSING or undefined");
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "SET" : "MISSING or undefined");
// Add more logs for other variables if needed for debugging

let app: FirebaseApp;

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  console.error(
    "Firebase Client Config CRITICAL Error: One or more essential Firebase configuration values are missing or undefined. " +
    "This will cause 'auth/configuration-not-found' or similar errors. " +
    "Please ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set in your .env.local file (or deployment environment) " +
    "and that the Next.js development server has been RESTARTED after changes. " +
    "Values received:", firebaseConfig
  );
  // To prevent the app from crashing entirely here, we might initialize with placeholder if absolutely necessary,
  // but it's better to highlight the error. For now, we'll let it proceed and Firebase will throw the error.
  // Or, throw an error here to stop further execution:
  // throw new Error("Firebase client configuration is critically missing values. App cannot initialize Firebase correctly.");
} else {
  console.log("Firebase Client Config: All essential NEXT_PUBLIC_FIREBASE_... variables seem to be present. Attempting Firebase initialization.");
}


// Initialize Firebase
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
// const storage: FirebaseStorage = getStorage(app); // If needed
// let analytics: Analytics | undefined; // If needed
// if (typeof window !== 'undefined') { // Ensure Analytics is initialized only on client
//   analytics = getAnalytics(app);
// }

export { app, auth, db /*, storage, analytics */ };
