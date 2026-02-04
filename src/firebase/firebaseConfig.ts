// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAb1xBEUZgNvHReb0VBwIbIZPrVcx6gm34',
  authDomain: 'ski-day-plan.firebaseapp.com',
  projectId: 'ski-day-plan',
  storageBucket: 'ski-day-plan.firebasestorage.app',
  messagingSenderId: '874812104737',
  appId: '1:874812104737:web:82c46c25be9aedf70e0360',
  measurementId: 'G-6PTG8L7R6Y',
  databaseURL: 'https://ski-day-plan-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
