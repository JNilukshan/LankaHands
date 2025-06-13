
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

// Check if essential config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase Client Config Error: Missing NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID. " +
    "Please ensure these environment variables are set correctly in your .env.local file (or your deployment environment) " +
    "and that the Next.js development server has been restarted. Without these, Firebase client SDK cannot initialize correctly, " +
    "leading to errors like 'auth/configuration-not-found'."
  );
  // You could throw an error here to halt further execution if these are absolutely critical for app startup
  // throw new Error("Firebase client configuration is missing essential values. App cannot start.");
} else {
  // This log is mostly for debugging; you might remove it in production.
  console.log("Firebase Client Config: NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID appear to be present. Attempting Firebase initialization.");
}


// Initialize Firebase
let app: FirebaseApp;
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
