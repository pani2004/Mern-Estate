import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e0f2a.firebaseapp.com",
  projectId: "mern-estate-e0f2a",
  storageBucket: "mern-estate-e0f2a.appspot.com",
  messagingSenderId: "658881703498",
  appId: "1:658881703498:web:3d4e2ce089696a1abec0b3"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);