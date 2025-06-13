
// IMPORTANT: This file contains placeholder credentials.
// You MUST replace them with your actual Firebase project's service account key
// by setting the following environment variables in your hosting environment
// (e.g., Vercel, Firebase App Hosting, local .env.local file):
// 1. FIREBASE_PROJECT_ID: Your Firebase project ID.
// 2. FIREBASE_CLIENT_EMAIL: The client email from your service account JSON file.
// 3. FIREBASE_PRIVATE_KEY: The private key from your service account JSON file.
//    - If storing as a single-line environment variable, ensure all newline characters
//      (\n) from the original key are escaped as the two characters: backslash and n (i.e., \\n).
//    - The key must start with '-----BEGIN PRIVATE KEY-----' and end with '-----END PRIVATE KEY-----\n'.

import admin from 'firebase-admin';

// Attempt to initialize Firebase Admin SDK
if (!admin.apps.length) {
  console.log("Firebase Admin SDK: Starting initialization attempt...");
  console.log("----------------------------------------------------------------------------------");
  console.log("INFO: This application requires the following Firebase service account environment variables to be set:");
  console.log("  - FIREBASE_PROJECT_ID: Your Firebase Project ID.");
  console.log("  - FIREBASE_CLIENT_EMAIL: The client_email from your Firebase service account JSON.");
  console.log("  - FIREBASE_PRIVATE_KEY: The private_key from your Firebase service account JSON. Ensure newlines are escaped as '\\\\n' if stored as a single line, including the final newline of the key.");
  console.log("----------------------------------------------------------------------------------");

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyInput = process.env.FIREBASE_PRIVATE_KEY;

  // --- Step 1: Pre-flight checks for critical environment variables ---
  if (!projectId || !clientEmail || !privateKeyInput) {
    const missingVars = [];
    if (!projectId) {
      console.error("Firebase Admin SDK PRE-FLIGHT CHECK FAILED: Environment variable 'FIREBASE_PROJECT_ID' is not set or is empty. This is required. Please set it in your server environment.");
      missingVars.push("FIREBASE_PROJECT_ID");
    }
    if (!clientEmail) {
      console.error("Firebase Admin SDK PRE-FLIGHT CHECK FAILED: Environment variable 'FIREBASE_CLIENT_EMAIL' is not set or is empty. This is required. Please set it in your server environment.");
      missingVars.push("FIREBASE_CLIENT_EMAIL");
    }
    if (!privateKeyInput) {
      console.error("Firebase Admin SDK PRE-FLIGHT CHECK FAILED: Environment variable 'FIREBASE_PRIVATE_KEY' is not set or is empty. This is required. Please set it in your server environment.");
      missingVars.push("FIREBASE_PRIVATE_KEY");
    }

    throw new Error(
      "Firebase Admin SDK Initialization Aborted: One or more critical environment variables are missing or empty: " +
      missingVars.join(', ') + ". " +
      "Please set these environment variables to your actual Firebase service account details. " +
      "Cannot proceed with Firebase Admin SDK initialization."
    );
  }

  // Process the private key: trim whitespace and replace escaped newlines.
  const privateKeyProcessed = privateKeyInput
    .trim()
    .replace(/\\r\\n/g, '\n') // Handle \r\n first
    .replace(/\\n/g, '\n');   // Then handle \n

  if (privateKeyProcessed === "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID" || privateKeyProcessed === "") {
    console.error("Firebase Admin SDK PRE-FLIGHT CHECK FAILED: The 'FIREBASE_PRIVATE_KEY' environment variable, after processing, is empty or still resolves to the placeholder string 'YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID'.");
    throw new Error(
        "Firebase Admin SDK Initialization Aborted: FIREBASE_PRIVATE_KEY is missing or using a placeholder value. " +
        "Please set this environment variable to your actual Firebase service account private key. " +
        "Cannot proceed."
    );
  }

  console.log(`Firebase Admin SDK: Using Project ID: ${projectId}`);
  console.log(`Firebase Admin SDK: Using Client Email: ${clientEmail}`);
  console.log(`Firebase Admin SDK: Private Key Provided: Yes (format check will follow)`);
  
  if (privateKeyInput && privateKeyInput !== "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") {
      if (privateKeyInput.includes('\\r\\n')) {
        console.log("Firebase Admin SDK: Raw FIREBASE_PRIVATE_KEY input CONTAINS '\\\\r\\\\n' (escaped carriage return + newline).");
      } else if (privateKeyInput.includes('\\n') && !privateKeyInput.includes('\n')) { // Check for escaped \n but not actual \n
        console.log("Firebase Admin SDK: Raw FIREBASE_PRIVATE_KEY input CONTAINS '\\\\n' (escaped newlines). This is expected for single-line env vars.");
      } else if (privateKeyInput.includes('\n')) {
        console.log("Firebase Admin SDK: Raw FIREBASE_PRIVATE_KEY input CONTAINS actual newlines ('\\n'). This might be okay if your env system supports multi-line vars directly, BUT ensure it's not a mix-up with escaped newlines if it should be single-line.");
      } else {
        console.warn("Firebase Admin SDK: Raw FIREBASE_PRIVATE_KEY input does NOT appear to contain common newline representations. If it's a multi-line key, this could be an issue or indicate the key is not fully set.");
      }
  }

  const serviceAccountUsedForAttempt = {
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: privateKeyProcessed,
  };
  
  // --- Step 2: Attempt to initialize Firebase with processed credentials ---
  try {
    const keySnippetStart = serviceAccountUsedForAttempt.privateKey.substring(0, 30);
    const keySnippetEnd = serviceAccountUsedForAttempt.privateKey.substring(serviceAccountUsedForAttempt.privateKey.length - 30);
    console.log(`Firebase Admin SDK: Attempting to use Processed Private Key (Snippet for format check): Starts with [${keySnippetStart}...] and ends with [...${keySnippetEnd}]`);
    
    const expectedHeader = "-----BEGIN PRIVATE KEY-----";
    const expectedFooterEndsWith = "-----END PRIVATE KEY-----\n"; 
    const expectedFooterWithoutNewline = "-----END PRIVATE KEY-----";


    if (!serviceAccountUsedForAttempt.privateKey.startsWith(expectedHeader) || 
        !(serviceAccountUsedForAttempt.privateKey.includes(expectedFooterWithoutNewline)) ) { 
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.error("Firebase Admin SDK CRITICAL PEM FORMAT WARNING (Headers/Footers):");
        console.error(`The PROCESSED private key does NOT start with '${expectedHeader}' OR does not contain '${expectedFooterWithoutNewline}'.`);
        console.error("This is VERY LIKELY THE CAUSE of an 'Invalid PEM formatted message' error if one occurs.");
        console.error("Expected format: '-----BEGIN PRIVATE KEY-----<BASE64_CONTENT_WITH_ACTUAL_NEWLINES>-----END PRIVATE KEY-----\\n'.");
        console.error("Verify your FIREBASE_PRIVATE_KEY environment variable value. If it's a single line, ensure all original newlines from the JSON key file are escaped as '\\\\n'.");
        console.error("Ensure no extra characters (quotes, spaces) are at the beginning or end of the environment variable value.");
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    } else if (!serviceAccountUsedForAttempt.privateKey.endsWith(expectedFooterEndsWith)) {
         console.warn("Firebase Admin SDK PEM FORMAT WARNING (Footer Newline): The processed private key includes the correct header and footer tags, but does not strictly end with '-----END PRIVATE KEY-----\\n' (i.e., missing the final newline after the footer). This might cause issues with some parsers, though Firebase SDK might be tolerant. Ensure your original key from JSON ends with a newline, and if escaping, that newline is also escaped (e.g., final `\\n`).");
    } else {
        console.log("Firebase Admin SDK: Processed private key appears to have correct PEM headers and ends with the expected newline, based on preliminary checks.");
    }
    
    console.info("Firebase Admin SDK: About to call admin.initializeApp(). Ensure the private key format logged above is correct, especially headers and newline handling.");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountUsedForAttempt),
    });

    if (admin.apps.length > 0 && admin.apps[0]) {
        const appProjectId = admin.apps[0].options.projectId;
        console.log("Firebase Admin SDK initialized successfully. Project ID from initialized app:", appProjectId);
    } else {
        console.error("Firebase Admin SDK: initializeApp was called but admin.apps is still empty, and no error was thrown by initializeApp. This is highly unexpected. Forcing an error to indicate failure.");
        throw new Error("Firebase Admin SDK failed to initialize an app, and initializeApp did not throw. Check console for earlier warnings.");
    }

  } catch (error: any) {
    console.error("Firebase Admin SDK Initialization CRITICAL Error during admin.initializeApp() or admin.credential.cert().");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);

    console.error("Service Account Object Used for attempt (Private key content not logged for security):", {
        projectId: serviceAccountUsedForAttempt?.projectId,
        clientEmail: serviceAccountUsedForAttempt?.clientEmail,
        privateKeyProcessedAndAttempted: (serviceAccountUsedForAttempt?.privateKey && serviceAccountUsedForAttempt.privateKey !== "YOUR_PRIVATE_KEY_PLACEHOLDER_INVALID") ? "Yes (see format check snippets and warnings above)" : "No or Placeholder",
    });
    
    if (error.message && (error.message.toLowerCase().includes("failed to parse private key") || error.message.toLowerCase().includes("invalid pem formatted message"))) {
        console.error("*********************************************************************************************************");
        console.error("SPECIFIC ERROR: 'Invalid PEM formatted message'. This means the FIREBASE_PRIVATE_KEY is malformed.");
        console.error("ACTION: Please meticulously check the value of your FIREBASE_PRIVATE_KEY environment variable.");
        console.error("   - Ensure it's the COMPLETE key from your Firebase service account JSON.");
        console.error("   - It MUST start with '-----BEGIN PRIVATE KEY-----'.");
        console.error("   - It MUST end with '-----END PRIVATE KEY-----\\n' (including the final newline).");
        console.error("   - If stored as a single line, all internal newlines MUST be escaped as '\\\\n'.");
        console.error("   - No extra characters (spaces, quotes) should surround the key in the env variable.");
        console.error("   - REFER TO THE 'Processed Private Key (Snippet for format check)' and 'Raw FIREBASE_PRIVATE_KEY input' LOGS ABOVE to see what the code is attempting to use.");
        console.error("*********************************************************************************************************");
    } else if (error.code === 'app/invalid-credential') {
        console.error("Firebase Admin SDK Credential Hint: The Firebase Admin SDK reported an 'invalid-credential' error. This could be due to an incorrect project ID, client email, or an issue with the private key (format, content, or if it's for the wrong project). Double-check all three environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
    }
    throw new Error(`Firebase Admin SDK Initialization Failed: ${error.message}. Check server logs for details.`);
  }
}

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

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };
