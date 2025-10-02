// Firebase Configuration
// This file should be kept secure and not committed to version control
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBzyKtEKbUMt66t9Sfk_onbOcJNic_t5oc",
    authDomain: "unitrade-d74e9.firebaseapp.com",
    projectId: "unitrade-d74e9",
    storageBucket: "unitrade-d74e9.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);









