// Import Firebase SDK (ES module format)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

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

// Event listener for login button
document.getElementById('loginButton').addEventListener('click', function() {
    // Get user input from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Function to authenticate user by searching the database
    authenticateUser(username, password);
});









// Function to authenticate user
function authenticateUser(username, password) {
    const usersRef = ref(database, 'users');  // Reference to the 'users' node in the database
    get(usersRef).then((snapshot) => {
        const data = snapshot.val();
        let userFound = false;

        // Loop through all users in the database to find a match
        for (let userId in data) {
            const user = data[userId];

            // Check if username and password match
            if (userId === username && user.password === password) {
                // User found, save user data
                const userData = {
                    username: userId,
                    gold: user.gold,
                    xp: user.xp,
                    rank: user.rank,
                    wins: user.wins,
                    slots: [user.slot1, user.slot2, user.slot3],
                };
                console.log(user.rank);
                console.log("User data: ", userData); // Log the user data to the console

                // Success alert
                alert("Login successful! Welcome, " + userId);

                // Save the user data in localStorage
                localStorage.setItem("userData", JSON.stringify(userData));

                // Redirect to Main.html
                window.location.href = "Main.html"; // Replace with your desired page
                userFound = true;
                break;
            }
        }

        // If no user was found, show a failure alert
        if (!userFound) {
            alert("Incorrect username or password. Please try again.");
        }
    }).catch((error) => {
        console.error("Error reading from Firebase Database: ", error);
        alert("An error occurred while trying to log in. Please try again later.");
    });
}



