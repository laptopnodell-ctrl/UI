import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

/**
 * Shared Firebase configuration — loaded from environment variables (.env).
 * The customer app and the delivery app both connect to the SAME Firebase
 * project ("vino-app-18f96") and its Realtime Database, so data written by
 * one app is instantly visible to the other via realtime listeners.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Fail fast if .env is missing or incomplete
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(
      `Firebase config is incomplete: "${key}" is missing. Check your .env file (see .env.example).`,
    );
  }
}

// Initialize Firebase (guard against re-initialization during HMR/SSR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseApp = app;

// Realtime Database — shared between the customer app and the delivery app
export const db = getDatabase(app);

export default app;
