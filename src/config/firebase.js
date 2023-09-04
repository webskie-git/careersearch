import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDMIlrvSNgN_a_F518mNbRNFrUrtpgLs2k",
  authDomain: "careersearch-2023.firebaseapp.com",
  projectId: "careersearch-2023",
  storageBucket: "careersearch-2023.appspot.com",
  messagingSenderId: "515757520482",
  appId: "1:515757520482:web:e4c01cad7f3eb01c84033b",
  measurementId: "G-1QR0P6XM5K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

