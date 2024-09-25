
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase (reemplaza con tu propia configuración)
const firebaseConfig = {
    apiKey: "AIzaSyD0xXKVlpHaAKMDdbGV8s_LyKBh7Lsf_bQ",
    authDomain: "app-herramientas-ea65f.firebaseapp.com",
    projectId: "app-herramientas-ea65f",
    storageBucket: "app-herramientas-ea65f.appspot.com",
    messagingSenderId: "563144353866",
    appId: "1:563144353866:web:3def40a12657fe19481eb3",
    measurementId: "G-6KC8PCS1CT"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén instancias de Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db,};
