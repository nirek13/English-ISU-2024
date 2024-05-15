import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to a specific location in the database
const ref = database.ref('');

ref.onValue(snapshot => {
    const data = snapshot.val();
    console.log(data)
    // Process the retrieved data (e.g., console.log(data))
}, error => {
    console.error("Error retrieving data:", error);
});
