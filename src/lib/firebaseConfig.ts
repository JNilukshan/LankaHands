
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
  let serviceAccountUsedForAttempt: any; // To log what was actually used
  try {
    // For server-side Admin SDK, use non-public environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyInput = process.env.FIREBASE_PRIVATE_KEY; // Raw value from env

    let criticalEnvVarsMissing = false;
    if (!projectId) {
      console.warn("Firebase Admin SDK WARNING: Missing required environment variable FIREBASE_PROJECT_ID. Using fallback placeholder: 'your-project-id-placeholder'.");
      criticalEnvVarsMissing = true;
    }
    if (!clientEmail) {
      console.warn("Firebase Admin SDK WARNING: Missing required environment variable FIREBASE_CLIENT_EMAIL. Using fallback placeholder: 'your-client-email-placeholder@your-project-id.iam.gserviceaccount.com'.");
      criticalEnvVarsMissing = true;
    }
    if (!privateKeyInput) {
      // This specific warning for missing privateKeyInput directly
      console.warn("Firebase Admin SDK CRITICAL WARNING: Environment variable FIREBASE_PRIVATE_KEY is not set. Using fallback placeholder: 'YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID'. This is critical and will cause initialization failure.");
      criticalEnvVarsMissing = true;
    }

    console.log("Firebase Admin SDK: Attempting to initialize with the following (PARTIAL) credentials:");
    console.log("Project ID from env:", projectId || "MISSING/PLACEHOLDER");
    console.log("Client Email from env:", clientEmail || "MISSING/PLACEHOLDER");
    console.log("Private Key provided in env:", (privateKeyInput && privateKeyInput !== "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") ? "Yes (content will be processed)" : "No or Placeholder (if env var was empty/undefined)");

    // Process the private key: trim whitespace and replace escaped newlines.
    const privateKey = (privateKeyInput || "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID").trim().replace(/\\n/g, '\n');

    // Log a snippet of the processed private key for debugging PEM format issues
    // DO NOT log the full key.
    if (privateKey && privateKey !== "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") {
        const keySnippetStart = privateKey.substring(0, 30);
        const keySnippetEnd = privateKey.substring(privateKey.length - 30);
        console.log(`Firebase Admin SDK: Processed Private Key (Snippet for format check): Starts with [${keySnippetStart}...] and ends with [...${keySnippetEnd}]`);
        if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----") || !privateKey.endsWith("-----END PRIVATE KEY-----\n")) {
            console.warn("Firebase Admin SDK CRITICAL WARNING: Processed private key does NOT strictly start/end with expected PEM headers. This is very likely the cause of the parsing error. Expected format: '-----BEGIN PRIVATE KEY-----' followed by base64 characters and newlines, ending with '-----END PRIVATE KEY-----\\n'. Check your FIREBASE_PRIVATE_KEY environment variable content and ensure newline characters are correctly escaped as '\\\\n' if stored in a single line.");
        }
    } else if (privateKey === "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") {
        // This case means privateKeyInput was falsy (undefined, null, empty string) OR it was literally the placeholder string.
        console.warn("Firebase Admin SDK CRITICAL WARNING: Private key IS THE PLACEHOLDER ('YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID') AFTER processing. This means the FIREBASE_PRIVATE_KEY environment variable was likely missing, empty, or literally contained the placeholder text. Initialization will fail.");
        criticalEnvVarsMissing = true; // Treat as critical if placeholder is used
    }


    serviceAccountUsedForAttempt = {
      projectId: projectId || "your-project-id-placeholder",
      clientEmail: clientEmail || "your-client-email-placeholder@your-project-id.iam.gserviceaccount.com",
      privateKey: privateKey, // This will be the processed key (or placeholder)
    };


    if (criticalEnvVarsMissing || serviceAccountUsedForAttempt.projectId === "your-project-id-placeholder" || serviceAccountUsedForAttempt.privateKey === "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") {
        const missingVarsMessage =
            "Firebase Admin SDK PRE-INITIALIZATION CRITICAL WARNING: Attempting to initialize with placeholder or incomplete credentials because one or more environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing, empty, or using defaults. " +
            "Firebase functionality will FAIL. " +
            "Please ensure these environment variables are correctly set with your actual Firebase service account details. " +
            "The private key MUST be the full '-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----\\n' string. If stored in a single line env var, newlines MUST be escaped as '\\\\n'.";
        console.error(missingVarsMessage);
        // Do not throw here yet, let initializeApp attempt and provide a more specific Firebase error if possible.
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountUsedForAttempt),
      // databaseURL: `https://\${serviceAccountUsedForAttempt.projectId}.firebaseio.com` // If using Realtime Database
    });

    if (admin.apps.length > 0 && admin.apps[0]) {
        const appProjectId = admin.apps[0].options.projectId;
        if (appProjectId && appProjectId !== "your-project-id-placeholder") {
            console.log("Firebase Admin SDK initialized successfully. Project ID:", appProjectId);
        } else if (appProjectId === "your-project-id-placeholder") {
            console.error("Firebase Admin SDK: Initialized with PLACEHOLDER project ID. This indicates a problem with FIREBASE_PROJECT_ID environment variable.");
        } else {
            console.error("Firebase Admin SDK: initializedApp was called, app exists, but project ID is missing from options. This is unexpected.");
        }
    } else {
        // This case should ideally be caught by initializeApp throwing an error.
        console.error("Firebase Admin SDK: initializeApp was called but admin.apps is still empty after the call, and no error was thrown by initializeApp. This is highly unexpected.");
        throw new Error("Firebase Admin SDK failed to initialize an app, and initializeApp did not throw. Check console for earlier warnings.");
    }

  } catch (error: any) {
    console.error("Firebase Admin SDK Initialization CRITICAL Error: Exception during admin.initializeApp() or admin.credential.cert().");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code); // Firebase errors often have a code like 'app/invalid-credential'
    // console.error("Full error object:", error); // Log the full error for more details

    console.error("Service Account Object Used for attempt (Private Key REDACTED, check your env vars directly):", {
        projectId: serviceAccountUsedForAttempt?.projectId,
        clientEmail: serviceAccountUsedForAttempt?.clientEmail,
        privateKeyProcessedAndAttempted: (serviceAccountUsedForAttempt?.privateKey && serviceAccountUsedForAttempt.privateKey !== "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") ? "Yes (check format and validity based on snippets logged above)" : "No or Placeholder",
    });

    if (error.message && (error.message.toLowerCase().includes("failed to parse private key") || error.message.toLowerCase().includes("invalid pem formatted message"))) {
        console.error(" Firebase Admin SDK PEM Key Format Hint: The private key could not be parsed. " +
                      "This means the string provided in the FIREBASE_PRIVATE_KEY environment variable is not a valid PEM-formatted private key. " +
                      "Ensure it starts with '-----BEGIN PRIVATE KEY-----' and ends with '-----END PRIVATE KEY-----' AND that all newline characters between these headers are correctly represented. " +
                      "If your environment variable is single-line, newlines typically need to be escaped as '\\\\n'. The code attempts to convert these, " +
                      "but the original escaping must be correct. Also, ensure no extra characters (like quotes or spaces) are surrounding the key in the env variable. " +
                      "Review the 'Processed Private Key (Snippet for format check)' log above.");
    } else if (error.code === 'app/invalid-credential') {
        console.error("Firebase Admin SDK Credential Hint: The Firebase Admin SDK reported an 'invalid-credential' error. This could be due to an incorrect project ID, client email, or an issue with the private key (format, content, or if it's for the wrong project). Double-check all three environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
    }
    // Re-throw the original error or a new one to ensure the application knows initialization failed.
    throw new Error(`Firebase Admin SDK Initialization Failed: ${error.message}. Check server logs for details.`);
  }
}

// This check remains as a final guard, but ideally, errors are caught and thrown above.
if (!admin.apps.length || !admin.apps[0]) {
  // This error should ideally not be reached if the catch block above throws correctly.
  // It's a fallback.
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
