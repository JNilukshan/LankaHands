
// IMPORTANT: This file contains placeholder credentials.
// You MUST replace them with your actual Firebase project's service account key.
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Generate a new private key and download the JSON file.
// 3. Store this JSON file securely (e.g., outside your repo, use environment variables).
// 4. For local development, you can point to the file path or set environment variables.
//    DO NOT commit the service account key directly into your repository.

import admin from 'firebase-admin';

// Attempt to initialize Firebase Admin SDK
if (!admin.apps.length) {
  let serviceAccountUsedForAttempt; // To log what was actually used
  try {
    // For server-side Admin SDK, use non-public environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyInput = process.env.FIREBASE_PRIVATE_KEY;

    let criticalEnvVarsMissing = false;
    if (!projectId) {
      console.warn("Firebase Admin SDK WARNING: Missing required environment variable FIREBASE_PROJECT_ID. Will use fallback placeholder.");
      criticalEnvVarsMissing = true;
    }
    if (!clientEmail) {
      console.warn("Firebase Admin SDK WARNING: Missing required environment variable FIREBASE_CLIENT_EMAIL. Will use fallback placeholder.");
      criticalEnvVarsMissing = true;
    }
    if (!privateKeyInput) {
      console.warn("Firebase Admin SDK WARNING: Missing required environment variable FIREBASE_PRIVATE_KEY. Will use fallback placeholder. This is critical for initialization and will likely fail.");
      criticalEnvVarsMissing = true;
    }

    // Format the private key correctly, replacing escaped newlines.
    const privateKey = (privateKeyInput || "your-private-key-placeholder").replace(/\\n/g, '\n');

    serviceAccountUsedForAttempt = {
      projectId: projectId || "your-project-id-placeholder",
      clientEmail: clientEmail || "your-client-email-placeholder@your-project-id.iam.gserviceaccount.com",
      privateKey: privateKey, // This will be the processed key (or placeholder)
    };

    if (criticalEnvVarsMissing || serviceAccountUsedForAttempt.projectId === "your-project-id-placeholder") {
        console.error(
            "Firebase Admin SDK CRITICAL WARNING: Attempting to initialize with placeholder or incomplete credentials because one or more environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing or using defaults. " +
            "Firebase functionality will FAIL. " +
            "Please ensure these environment variables are correctly set with your actual Firebase service account details. " +
            "The private key MUST be the full '-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----\\n' string. If stored in a single line env var, newlines MUST be escaped as '\\n'."
        );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountUsedForAttempt),
      // databaseURL: `https://\${serviceAccountUsedForAttempt.projectId}.firebaseio.com` // If using Realtime Database
    });
    // Check if the app was actually initialized and get its project ID
    if (admin.apps.length > 0 && admin.apps[0]) {
        console.log("Firebase Admin SDK initialized successfully. Project ID:", admin.apps[0].options.projectId);
    } else {
        // This case should be rare if initializeApp doesn't throw but also doesn't populate admin.apps
        console.error("Firebase Admin SDK: initializeApp was called but admin.apps is still empty. This is unexpected.");
    }

  } catch (error: any) {
    console.error("Firebase Admin SDK Initialization Error: Exception during admin.initializeApp() or admin.credential.cert().", error.message);
    console.error("This usually means the service account credentials provided are invalid, malformed, or incomplete.");
    console.error("Service Account Object Used (Private Key REDACTED for safety in logs, check your env vars directly):", {
        projectId: serviceAccountUsedForAttempt?.projectId,
        clientEmail: serviceAccountUsedForAttempt?.clientEmail,
        privateKeyProvided: serviceAccountUsedForAttempt?.privateKey && serviceAccountUsedForAttempt.privateKey !== "your-private-key-placeholder" ? "Yes (check format and validity)" : "No or Placeholder",
    });
    if (error.code === 'app/invalid-credential' || (error.message && (error.message.toLowerCase().includes("private key") || error.message.toLowerCase().includes("json")))) {
        console.error("Error Details: The Firebase Admin SDK could not parse the credentials. Ensure FIREBASE_PRIVATE_KEY is the complete PEM key string (starts with '-----BEGIN PRIVATE KEY-----' and ends with '-----END PRIVATE KEY-----'). If newlines were escaped as '\\n' for a single-line environment variable, verify they are correctly formatted.");
    } else {
        console.error("Full error object:", error);
    }
  }
}

// Final check if Firebase Admin App was successfully initialized
if (!admin.apps.length || !admin.apps[0]) {
  throw new Error(
    "Firebase Admin SDK default app has not been initialized successfully. " +
    "This is critical for backend functionality. " +
    "Please check your server logs for previous Firebase Admin SDK initialization errors (especially messages above this one) and ensure your " +
    "environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) " +
    "are correctly set with valid service account credentials. " +
    "The most common cause is missing or malformed credentials, particularly the private key format or content."
  );
}

// If initialization was successful, export the services.
const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };

    