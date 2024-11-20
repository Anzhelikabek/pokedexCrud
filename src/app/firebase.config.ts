import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: "AIzaSyA8wAjY0i1gc7QuNB7h1OpEhTxfEHNLUNs",
  authDomain: "pokedex-3f092.firebaseapp.com",
  projectId: "pokedex-3f092",
  storageBucket: "pokedex-3f092.firebasestorage.app",
  messagingSenderId: "957055105460",
  appId: "1:957055105460:web:42e19b37caba96cad11ae1"
};

export const firebaseApp = initializeApp(firebaseConfig);
