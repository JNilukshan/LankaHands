
// IMPORTANT: This file contains placeholder credentials.
// You MUST replace them with your actual Firebase project's service account key.
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Generate a new private key and download the JSON file.
// 3. Store this JSON file securely (e.g., outside your repo, use environment variables).
// 4. For local development, you can point to the file path or set environment variables.
//    DO NOT commit the service account key directly into your repository.

import admin from 'firebase-admin';

// --- OPTION 1: Using environment variables (Recommended for production) ---
// Set these environment variables in your deployment environment (e.g., Vercel, Firebase Functions, Google Cloud Run)
// or in a .env.local file for local development (ensure .env.local is in .gitignore).
/*
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
      }),
      // databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com` // If using Realtime Database
    });
    console.log("Firebase Admin SDK initialized via environment variables.");
  } catch (error) {
    console.error("Firebase Admin SDK initialization error (env vars):", error);
  }
}
*/

// --- OPTION 2: Using a service account JSON file (Common for local development) ---
// Make sure the path to your service account key JSON file is correct.
// And ensure this file is NOT committed to your repository.
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './path/to/your/serviceAccountKey.json'; // Replace with actual path or env var

if (!admin.apps.length) {
  try {
    // This is a placeholder. Replace with your actual service account key or use environment variables.
    // For this prototype, we'll use a simplified initialization that expects environment variables to be set
    // or it will likely fail if you haven't configured them.
    // A real setup would securely load credentials.
    const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id", // Fallback, replace
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "your-client-email@your-project-id.iam.gserviceaccount.com", // Fallback, replace
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "your-private-key").replace(/\\n/g, '\n'), // Fallback, replace
    };

    if (serviceAccount.projectId === "your-project-id") {
        console.warn(
            "Firebase Admin SDK is using placeholder credentials. " +
            "Functionality requiring Firebase will not work correctly. " +
            "Please configure your service account key in environment variables or directly in firebaseConfig.ts (for local dev only, and ensure it's gitignored)."
        );
    }


    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // databaseURL: `https://${serviceAccount.projectId}.firebaseio.com` // If using Realtime Database
    });
    console.log("Firebase Admin SDK initialized (using potentially placeholder config).");
  } catch (error) {
    console.error(
        "Firebase Admin SDK initialization error. " +
        "Ensure your service account credentials are set up correctly, " +
        "either via environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) " +
        "or by providing a valid serviceAccountKey.json path if using GOOGLE_APPLICATION_CREDENTIALS.",
        error
    );
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };
