
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAeayWl-pYwiiJt_QZmRgUJwwxjmAFCUCE",
    authDomain: "tarefas-plus-9b209.firebaseapp.com",
    projectId: "tarefas-plus-9b209",
    storageBucket: "tarefas-plus-9b209.firebasestorage.app",
    messagingSenderId: "221181756572",
    appId: "1:221181756572:web:129ecd59318381a060d959"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export { db }