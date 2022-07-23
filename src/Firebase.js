import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
const config = {
    apiKey: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_SENDER_ID,
    appId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_APP_ID,
  };
export const app= initializeApp(config);
export const auth = getAuth(app);