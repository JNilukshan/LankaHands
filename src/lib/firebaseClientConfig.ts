
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
// console.log("Firebase Client Config Values from process.env (Check BROWSER CONSOLE):");
// console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "SET" : "MISSING or undefined");
// console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "SET" : "MISSING or undefined");
// console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "SET" : "MISSING or undefined");
// console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "SET" : "MISSING or undefined");
// console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "SET" : "MISSING or undefined");
// console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "SET" : "MISSING or undefined");

// console.log("Firebase Client Config: Actual firebaseConfig object to be used:", firebaseConfig);


const essentialConfigKeys: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
  'storageBucket',
  'messagingSenderId',
];

const missingKeys = essentialConfigKeys.filter(key => !firebaseConfig[key]);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (missingKeys.length > 0) {
  console.error(
    "Firebase Client Config CRITICAL Error: One or more essential Firebase configuration values are missing or undefined from the `firebaseConfig` object. " +
    `Missing NEXT_PUBLIC_FIREBASE_... variables for these keys in firebaseConfig: ${missingKeys.join(', ')}. ` +
    "This will cause 'auth/configuration-not-found' or similar errors. " +
    "Please ensure all corresponding NEXT_PUBLIC_FIREBASE_... environment variables are correctly set in your .env.local file (or deployment environment) " +
    "and that the Next.js development server has been RESTARTED after changes. " +
    "Current firebaseConfig object (some values might be undefined):", firebaseConfig
  );
  // Note: Firebase SDK will likely throw its own error if initialized with incomplete config.
} else {
  // console.log("Firebase Client Config: All essential NEXT_PUBLIC_FIREBASE_... variables seem to be present in the firebaseConfig object. Attempting Firebase initialization.");
}


// Initialize Firebase
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    // console.log("Firebase Client Config: SUCCESSFULLY CALLED initializeApp. App options:", app.options);
  } catch (error: any) {
    console.error("Firebase Client Config: Error during initializeApp(firebaseConfig):", error);
    console.error("Firebase Client Config: Failing firebaseConfig object was:", firebaseConfig);
    // If initializeApp fails, app remains unassigned or error is thrown
  }
} else {
  app = getApp();
  // console.log("Firebase Client Config: Using existing Firebase app. App options:", app.options);
}

// @ts-ignore: Potentially unassigned if init fails and no re-throw
if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.error("Firebase Client Config: CRITICAL - Firebase app object ('app') is not initialized. Auth and Firestore will not work.");
  // Fallback to dummy objects or throw to prevent hard crashes on import if app is truly undefined
  // This path should ideally not be hit if config is correct.
  // @ts-ignore
  auth = {} as Auth; 
  // @ts-ignore
  db = {} as Firestore;
}

export { app, auth, db };
