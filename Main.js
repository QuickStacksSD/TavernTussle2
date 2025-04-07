import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Variables to store slots and username
let slot0, slot1, slot2, username1;
let cardsM;

let UserDeckM; 

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Logout function
function logout() {
    localStorage.removeItem("userData");
     localStorage.clear();
    window.location.href = "/login.html";
}

// Initialize the logout event
document.getElementById('logoutBtn').addEventListener('click', logout);

// Load user data from localStorage
const userDataString = localStorage.getItem("userData");
if (userDataString) {
    const userData = JSON.parse(userDataString);
    username1 = userData.username;
    document.getElementById('profileUsername').textContent = `Welcome, ${userData.username}`;
    document.getElementById('profileGold').textContent = userData.gold;
    document.getElementById('profileXP').textContent = userData.xp;
    document.getElementById('profileWins').textContent = userData.wins;
    document.getElementById('profileRank').textContent = userData.rank;
} else {
    console.log("No user data found in localStorage.");
}

// Function for Tussle Button
export function Tussle() {
    if (UserDeckM == undefined || UserDeckM.slot0 == undefined || UserDeckM.slot1 == undefined || UserDeckM.slot2 == undefined) {
        alert("Please fill any empty slots in your deck first");
    } else {
        updateUserDeck(username1, UserDeckM);
        window.location.href = "Players.html";
    }
}

// Update the User Deck in Firebase
export function updateUserDeck(userId, UserDeck) {
    const db = getDatabase();
    const usersRef = ref(db, 'users/' + userId);
    update(usersRef, {
        slot1: UserDeck.slot0,
        slot2: UserDeck.slot1,
        slot3: UserDeck.slot2
    }).then(() => {
        console.log('User deck updated successfully!');
    }).catch((error) => {
        console.error('Error updating user deck:', error);
    });
}

// Event listener for Tussle button
document.getElementById("tussleBtn").addEventListener("click", Tussle);

// Function to load card data from file
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

// ✅ Function to upload owned cards to Firebase
const addCardsForUser = async (username, filename) => {
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
    const userCardsRef = ref(db, `users/${username}/Cards`);

    // Upload data to Firebase
    set(userCardsRef, ownedCards)
        .then(() => console.log(`✅ Cards uploaded successfully for ${username}`))
        .catch(error => console.error(`❌ Error uploading cards for ${username}:`, error));
};

// Function to fetch user cards from Firebase
const getUserCards = async (username) => {
    const userCardsRef = ref(db, `users/${username}/Cards`);
    try {
        const snapshot = await get(userCardsRef);
        if (snapshot.exists()) {
            const cards = snapshot.val();
            cardsM = cards;
            console.log("Fetched cards:", cards);  // Check if cards are being fetched correctly
            displayOwnedCards(cards);
        } else {
            console.log("No cards found for this user.");
        }
    } catch (error) {
        console.error("Error fetching user cards:", error);
    }
};

// Function to display owned cards
const displayOwnedCards = (cards) => {
    cardsM = cards;
    const cardsContainer = document.getElementById("userCards");
    cardsContainer.innerHTML = "";

    // Iterate over each card in the cards object
    for (const cardName in cards) {
        if (cards.hasOwnProperty(cardName)) {
            const card = cards[cardName];

            if (card.owned) {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card");

                let cardImage = getCardImage(card.name);  // Get card image dynamically

                cardDiv.innerHTML = `
                    <h3>${card.name}</h3>
                    <img src="${cardImage}" alt="${card.name}" class="card-image">
                    <p><strong>Health:</strong> ${card.health}</p>
                    <p><strong>Attack:</strong> ${card.attack}</p>
                    <p><strong>Defense:</strong> ${card.defense}</p>
                           <p><strong>Type:</strong> ${card.type}</p>

                `;

                // Add click event to store the card in the first available slot
                cardDiv.addEventListener("click", () => SelectCard(card.name));

                cardsContainer.appendChild(cardDiv);
            }
        }
    }
};

// Function to handle card selection
function SelectCard(cardName) {
    const card = getCardDetails(cardName);

    if (!card) {
        console.error("Card not found");
        return;
    }

    if (slot0 === cardName) {
        slot0 = null; 
        alert(`${cardName} removed from Slot 0`);
    } else if (slot1 === cardName) {
        slot1 = null; 
        alert(`${cardName} removed from Slot 1`);
    } else if (slot2 === cardName) {
        slot2 = null; 
        alert(`${cardName} removed from Slot 2`);
    } else {
        if (slot0 == null) {
            slot0 = cardName; 
            alert(`${cardName} added to Slot 0`);
        } else if (slot1 == null) {
            slot1 = cardName; 
            alert(`${cardName} added to Slot 1`);
        } else if (slot2 == null) {
            slot2 = cardName; 
            alert(`${cardName} added to Slot 2`);
        } else {
            alert("All slots are full. Please remove a card before adding a new one.");
        }
    }
    
    UserDeckM = { slot0, slot1, slot2 };
    displaySelectedCards(slot0, "selectedCard1");
    displaySelectedCards(slot1, "selectedCard2");
    displaySelectedCards(slot2, "selectedCard3");
    localStorage.setItem("userDeck", JSON.stringify(UserDeckM));
}

// Display selected cards immediately on page load
function displaySelectedCards(cardName, slotId) {
    const slotElement = document.getElementById(slotId);

    if (cardName !== null) {
        const card = getCardDetails(cardName);
        if (card) {
            const cardImage = getCardImage(card.name);

            slotElement.innerHTML = `
                <h2>${card.name}</h2>
                <img src="${cardImage}" alt="${card.name}" class="card-image">
                <p><strong>Health:</strong> ${card.health}</p>
                <p><strong>Attack:</strong> ${card.attack}</p>
                <p><strong>Defense:</strong> ${card.defense}</p>
            `;
        }
    } else {
        slotElement.innerHTML = "";
    }
}


displaySelectedCards(slot0, "selectedCard1");
function getCardDetails(cardName) {
   if (cardsM && cardsM.hasOwnProperty(cardName)) {
        return cardsM[cardName];
    } else {
        console.error("Card details not found for:", cardName);
        return null;  // Return null if card is not found
    }
}

// Dummy function to get card image
function getCardImage(cardName) {
  const formattedCardName = cardName.toLowerCase().replace(/\s+/g, '%20');
    return `Cards/${formattedCardName}.png`; 
}

getUserCards(username1);

