import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  inMemoryPersistence,
  GoogleAuthProvider
} from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYz_HmPacrfny5HMCCbp_54dJexqY5qD4",
  authDomain: "money-tracker-f8886.firebaseapp.com",
  projectId: "money-tracker-f8886",
  storageBucket: "money-tracker-f8886.firebasestorage.app",
  messagingSenderId: "951180184572",
  appId: "1:951180184572:web:bfc5763e491c36ed354079",
  measurementId: "G-GDY62WBDZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = initializeAuth(app, {
  popupRedirectResolver: browserPopupRedirectResolver,
  // Safari ổn định hơn với localStorage trước IndexedDB cho auth token
  persistence: [
    browserLocalPersistence,
    browserSessionPersistence,
    indexedDBLocalPersistence,
    inMemoryPersistence
  ]
});
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});

export default app;
