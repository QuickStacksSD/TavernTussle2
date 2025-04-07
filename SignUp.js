// Import Firebase SDK (ES module format)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCo0aO4ls4w3D1PFnhmdg2Rwjn0KMoDKk8",
    authDomain: "taventue.firebaseapp.com",
    databaseURL: "https://taventue-default-rtdb.firebaseio.com",
    projectId: "taventue",
    storageBucket: "taventue.firebasestorage.app",
    messagingSenderId: "61118342276",
    appId: "1:61118342276:web:d50a9cc8fd38931ff28ed1",
    measurementId: "G-EVJXLQ7WRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);




let username1;
let password1;


document.getElementById('SignUp').addEventListener('click', function () {
    // Get user input from the form
    const username = document.getElementById('usernameS').value;
    const password = document.getElementById('passwordS').value;

    username1 = username;
    password1 = password;

    // Function to authenticate user by searching the database
    CreateUser(username, password);
});





function CreateUser(username1, password1) {
    const usersRef = ref(database, 'users');  // Reference to the 'users' node in the database

    // Fetch the current users in the database
    get(usersRef).then((snapshot) => {
        const data = snapshot.val();
        let userFound = false;

        // Loop through all users to check if the username exists
        for (let userId in data) {
            if (userId === username1) {
                alert("Username '" + username1 + "' is already taken.");
                userFound = true;  // Set userFound to true if the username exists
                break;  // Exit the loop if username is found
            }
        }

        // If the username doesn't exist, create a new user
        if (!userFound) {
            // Create a new user in the 'users' node with the given username and password
            const newUserRef = ref(database, 'users/' + username1);  // Path for the new user
            set(newUserRef, {
                password: password1,   // Set password
                gold: 0,              // Initial value for gold (can be adjusted)
                xp: 0,
                wins: 0,
                rank: "Noob",// Initial value for XP (can be adjusted)
                slot1: null,          // Initial value for slot1 (can be adjusted)
                slot2: null,          // Initial value for slot2 (can be adjusted)
                slot3: null,
                // Initial value for slot3 (can be adjusted)
            }).then(() => {
                // Success: Inform the user and log them in
                    addCardsForUser(username1, "CardsData.json");
                alert("User created successfully! You can now log in.");
                
                // Redirect to the login page (or anywhere you want)
            }).catch((error) => {
                console.error("Error creating new user: ", error);
                alert("An error occurred while creating the user. Please try again later.");
            });
        }
    }).catch((error) => {
        console.error("Error reading from Firebase Database: ", error);
        alert("An error occurred while trying to create the user. Please try again later.");
    });
}






const loadCardsFromFile = async (filename) => {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return null;
    }
};
// ✅ Function to upload owned cards to Firebase use for buying
const addCardsForUser = async (username1, filename) => {
    const data = await loadCardsFromFile(filename);
    if (!data || !data.cards) {
        console.error("Invalid JSON data");
        return;
    }

    // Filter owned cards
    const ownedCards = data.cards.filter(card => card.owned).reduce((obj, card) => {
        obj[card.name] = card;
        return obj;
    }, {});

    // Reference the user's card path in Firebase
    const userCardsRef = ref(database, `users/${username1}/Cards`);

    // Upload data to Firebase
    set(userCardsRef, ownedCards)
        .then(() => console.log(`✅ Cards uploaded successfully for ${username1}`))
        .catch(error => alert(`❌ Error uploading cards for ${username1}:`, error));
};






// Thise is how to call: addCardsForUser("mastaG", "CardsData.json");
 