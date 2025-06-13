
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
console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "SET" : "MISSING or undefined");
console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "SET" : "MISSING or undefined");
console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "SET" : "MISSING or undefined");

const essentialConfigKeys: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
  // storageBucket and messagingSenderId are often essential too, but some minimal auth flows might work without them initially.
  // Let's include them for thoroughness as Firebase expects them if provided in the config object.
  'storageBucket',
  'messagingSenderId',
];

const missingKeys = essentialConfigKeys.filter(key => !firebaseConfig[key]);

let app: FirebaseApp;

if (missingKeys.length > 0) {
  console.error(
    "Firebase Client Config CRITICAL Error: One or more essential Firebase configuration values are missing or undefined from the `firebaseConfig` object. " +
    `Missing NEXT_PUBLIC_FIREBASE_... variables for: ${missingKeys.join(', ')}. ` +
    "This will cause 'auth/configuration-not-found' or similar errors. " +
    "Please ensure all corresponding NEXT_PUBLIC_FIREBASE_... environment variables are correctly set in your .env.local file (or deployment environment) " +
    "and that the Next.js development server has been RESTARTED after changes. " +
    "Current firebaseConfig object being evaluated (some values might be undefined):", firebaseConfig
  );
  // To prevent app from crashing hard here during dev, we could try to initialize with a dummy
  // but it's better to fail loudly so the config issue is addressed.
  // Firebase will throw an error if initialized with incomplete config.
  // For now, we'll let it proceed and Firebase SDK will throw the actual "configuration-not-found" error.
  // If you are in a scenario where you want the app to "attempt" to run further for UI dev even with bad config,
  // you might need to conditionally initialize Firebase or use a placeholder app, but that's not recommended for auth.
} else {
  console.log("Firebase Client Config: All essential NEXT_PUBLIC_FIREBASE_... variables seem to be present in the firebaseConfig object. Attempting Firebase initialization.");
}


// Initialize Firebase
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase Client Config: Error during initializeApp(firebaseConfig):", error);
    // This catch might not always trigger for config issues before Firebase SDK internal checks,
    // but it's good to have. The primary "configuration-not-found" usually comes from SDK calls like createUserWithEmailAndPassword.
    throw error; // Re-throw to ensure the problem is visible
  }
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
