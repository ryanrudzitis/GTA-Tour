/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import functions = require("firebase-functions");
import admin = require("firebase-admin");
admin.initializeApp();

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

exports.verifyAccessCode = functions.https.onCall(async (data, context) => {
  const inputCode = data.code;
  const db = admin.firestore();
  const codeDoc = await db.collection("accessCodes").doc("validCodes").get();

  if (!codeDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      "Access code document not found"
    );
  }

  const validCode = codeDoc.data()?.code;

  if (inputCode === validCode) {
    return {success: true};
  } else {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Invalid access code"
    );
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
