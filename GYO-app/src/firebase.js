import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// 1. AJOUT DE L'IMPORT POUR L'AUTHENTIFICATION
import { getAuth } from "firebase/auth"; 

// Ta configuration officielle
const firebaseConfig = {
  apiKey: "AIzaSyDa84AM1bqweyjuMHHBIKcJpDVyVOmr6BE",
  authDomain: "gyo-app-685a1.firebaseapp.com",
  projectId: "gyo-app-685a1",
  storageBucket: "gyo-app-685a1.firebasestorage.app",
  messagingSenderId: "340302590174",
  appId: "1:340302590174:web:d1b635ec2678d96727124f",
  measurementId: "G-XFD1H7SJJL"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// 2. INITIALISATION ET EXPORT DES SERVICES
export const auth = getAuth(app); // C'est cette ligne qui manquait !
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;