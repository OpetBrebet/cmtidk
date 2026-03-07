import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB0okWr2uffx2Tv3lAzJ3AnAiUZXEJRS9A",
    authDomain: "chord-making-thing-idk.firebaseapp.com",
    projectId: "chord-making-thing-idk",
    storageBucket: "chord-making-thing-idk.firebasestorage.app",
    messagingSenderId: "571369352976",
    appId: "1:571369352976:web:57c940f09dfebd620e7f95",
    measurementId: "G-PGKD0KTPM2"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

