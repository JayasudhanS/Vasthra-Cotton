import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration strictly via Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase App with singleton pattern (prevents duplicate app initialization during Vite HMR / fast refresh)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Database Collection References (as specified in Phase 1 Architecture)
export const COLLECTIONS = {
  USERS: 'users',
  SHOPS: 'shops',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  WISHLIST: 'wishlist',
  CATEGORIES: 'categories',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications'
};

// Typed helper to get collection reference easily
export const getDbCollection = (collectionName) => collection(db, collectionName);

export default app;
