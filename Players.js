// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
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
let opponent;
const USER = JSON.parse(localStorage.getItem("userData")); // Parse the stored user data

if (USER) {
    let username = USER.username;
    console.log("User's username is: " + username);  // Log the username to the console
} else {
    console.log("No user data found in localStorage.");
}
console.log(USER);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the 'users' node in the database
const usersRef = ref(database, 'users');
//button

document.getElementById('1').addEventListener('click', () => {
    if (opponent) {
        // If opponent is not null, open a new form (or navigate to another page)
        
        // For example, if you're switching to another form, you can show the new form
        // or change the window location (assuming this is a SPA in a web app)

        // Example of opening a new form (e.g., BattleForm) 
        window.location.href = "Attack.html"; // Replace with your desired form URL

        // OR if you're showing a modal, just toggle its visibility:
        // document.getElementById('battleForm').style.display = 'block';  // Assuming this is your modal or hidden form
    } else {
        alert("No opponent selected!");
    }
});
// Get the user data from Firebase and populate the table
onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    const tableBody = document.getElementById('playerTableBody');
    tableBody.innerHTML = ''; // Clear the table before populating it

    if (users) {
        // Loop through each user and add a row to the table
        for (const userId in users) {
            const user = users[userId];

            // Skip the current user if their username matches
            if (userId === USER.username) {
                continue;
            }

            // Check if at least one slot is undefined or empty
            if (user.slot1 != undefined || user.slot2 != undefined || user.slot3 != undefined) {
                const row = document.createElement('tr');

                // Add the user name
                const playerNameCell = document.createElement('td');
                playerNameCell.textContent = userId || 'Unknown Player';  // Use the userId as the player name

                // Add the slots
                const slot1Cell = document.createElement('td');
                const slot1Character = user.slot1 && user.slot1 !== 0 ? `${user.slot1}` : 'Empty Slot';
                slot1Cell.textContent = slot1Character;

                const slot2Cell = document.createElement('td');
                const slot2Character = user.slot2 && user.slot2 !== 0 ? `${user.slot2}` : 'Empty Slot';
                slot2Cell.textContent = slot2Character;

                const slot3Cell = document.createElement('td');
                const slot3Character = user.slot3 && user.slot3 !== 0 ? `${user.slot3}` : 'Empty Slot';
                slot3Cell.textContent = slot3Character;

                const rankCell = document.createElement('td');
                const userRank = user.rank || 'Unranked';  // Default to 'Unranked' if no rank is found
                rankCell.textContent = userRank;

                // Append the cells to the row
                row.appendChild(playerNameCell);
             
                row.appendChild(slot1Cell);
                row.appendChild(slot2Cell);
                row.appendChild(slot3Cell);
                row.appendChild(rankCell);

                // Add click event listener to the row
                row.addEventListener('click', () => {
                    // When a row is clicked, you can access the player data
                    alert(`Selected Player: ${userId}\nSlot 1: ${slot1Character}\nSlot 2: ${slot2Character}\nSlot 3: ${slot3Character}`);

                    opponent = {User: userId, slot1: slot1Character, slot2: slot2Character, slot3: slot3Character}
                    localStorage.setItem("opponent", JSON.stringify(opponent));

                    console.log(opponent);
                    // Highlight the selected row
                    row.style.backgroundColor = '#d4af37';

                    // Optionally, you can clear the highlight from previously selected rows
                    Array.from(tableBody.getElementsByTagName('tr')).forEach(r => {
                        if (r !== row) r.style.backgroundColor = '';  // Reset color for non-selected rows
                    });
                });

                // Append the row to the table body
                tableBody.appendChild(row);
            }
        }
    } else {
        console.log('No users found in database');
    }
});

document.getElementById('2').addEventListener('click', function() {
    // Redirect to main.html
    window.location.href = 'main.html';
});





let storedDeck = JSON.parse(localStorage.getItem("userDeck"));

// Check if the deck exists in localStorage
if (storedDeck) {
    console.log("User deck:", storedDeck);
} else {
    console.log("No user deck found in localStorage.");
}