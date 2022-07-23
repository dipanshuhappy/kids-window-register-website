import { getAuth } from "firebase/auth";
import { initializeApp} from "firebase/app";
import Constants from "./Constants";
import { getFirestore,collection,doc } from "firebase/firestore";
const config = {
  apiKey: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_SENDER_ID,
  appId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_APP_ID,
};
export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore();
export const adminDoc = doc(
  db,
  Constants.ADMIN_COLLECTION_PATH,
  Constants.TERM_INFO_DOCUMENT_NAME
);
export const classesCollection = collection(
  db,
  Constants.CLASSES_COLLECTION_PATH
);
export const getTermCollection=(term)=>collection(db,term)