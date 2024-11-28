import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAnNeMRDM_WN7L3aV-Yn55ylQoFfpCyoa8",
  authDomain: "hotel-app-cee07.firebaseapp.com",
  projectId: "hotel-app-cee07",
  storageBucket: "hotel-app-cee07.appspot.com",
  messagingSenderId: "142763268665",
  appId: "1:142763268665:web:4dd5271318ed0ff048cbe8",
  measurementId: "G-HY03SXRZ0N",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);