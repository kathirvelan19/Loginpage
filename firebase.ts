// This file configures and initializes Firebase for your application.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration.
// It is recommended to use environment variables for these values in a production environment.
const firebaseConfig = {
  apiKey: "AIzaSyCqQzoizI88bEeQJx18MJxJzw7Ilqy9xs8",
  authDomain: "moneymatex-kathir.firebaseapp.com",
  projectId: "moneymatex-kathir",
  storageBucket: "moneymatex-kathir.firebasestorage.app",
  messagingSenderId: "163215880560",
  appId: "1:163215880560:web:9bbb4cefe359b92d1a1fb5",
  measurementId: "G-Z0FSQME4ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication instance
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Note: For a real application, ensure these environment variables are properly
// configured in your build environment (e.g., in a .env file for Vite/Create React App).
// Example .env.local for development:
// REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
// REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
// REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
// REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
// REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"