// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAd58trYVMZxjANwpOY5NnfP_GD7gl9bDc",
    authDomain: "kontakty-77e3e.firebaseapp.com",
    projectId: "kontakty-77e3e",
    storageBucket: "kontakty-77e3e.firebasestorage.app",
    messagingSenderId: "647003072905",
    appId: "1:647003072905:web:016df3aa077c4c0f33d958",
    measurementId: "G-XP4PCEQ6K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };