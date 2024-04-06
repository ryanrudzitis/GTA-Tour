// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { apiKey } from "src/environments/environment";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "gta-tour-rankings.firebaseapp.com",
  projectId: "gta-tour-rankings",
  storageBucket: "gta-tour-rankings.appspot.com",
  messagingSenderId: "429267161229",
  appId: "1:429267161229:web:90db2dc2eef32d13a812c4"
} as const;

