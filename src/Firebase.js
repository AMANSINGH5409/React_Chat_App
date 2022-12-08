import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhK2npMAuBqlpek2fpkrxHeK9wP5D5rNg",
  authDomain: "reactchatapp-c12b6.firebaseapp.com",
  projectId: "reactchatapp-c12b6",
  storageBucket: "reactchatapp-c12b6.appspot.com",
  messagingSenderId: "118943260263",
  appId: "1:118943260263:web:0e6cec0c03caa43065bec2",
  measurementId: "G-BLQZE29CZE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

