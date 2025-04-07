
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const database = getDatabase(app);
let CardToBuy;

let StoreCards;
let username;
let gold = 0;
const userDataString = localStorage.getItem("userData");
if (userDataString) {
    const userData = JSON.parse(userDataString);
    username = userData.username;
    gold = userData.gold;
    console.log(gold);
} else {
    console.log("No user data found in localStorage.");
}

const addCardForUser = async (username1, cardObj) => {
    try {
        const userCardsRef = ref(database, `users/${username1}/Cards`);

        // Fetch existing user cards from Firebase first
        const snapshot = await get(userCardsRef);
        let userCards = snapshot.exists() ? snapshot.val() : {};  // Initialize with existing cards or empty object

        // Add the new card to the user's collection
        userCards[cardObj.name] = cardObj;

        // Update Firebase with the new card
        await set(userCardsRef, userCards);

        console.log(`✅ Card '${cardObj.name}' added successfully for ${username1}`);
    } catch (error) {
        console.error("❌ Error adding card to user:", error);
        alert(`❌ Error uploading card for ${username1}: ${error.message}`);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const btnBuy = document.getElementById("btnBuy");

    btnBuy.addEventListener("click", () => {
        BuyTheCard();  // When user clicks to buy card
    });
});

let goldLabel = document.getElementById("Gold");
goldLabel.innerHTML = gold;  // Update gold display

function BuyTheCard() {
    console.log(CardToBuy);
    console.log(gold);
    let Gold = gold;
    if (Gold < CardToBuy.cost) {
        alert("You Don't have enough Dineros Stoopid");
    } else {
        // Update the card to show it's owned
        CardToBuy.owned = true;
       let newgold = Gold - CardToBuy.cost;
        // Call function to add the card to the user's collection in Firebase
        addCardForUser(username, CardToBuy);
        updateUserGold(username, newgold);
        Gold = newgold
        gold = newgold
        localStorage.setItem("userData", JSON.stringify({ username, gold: newgold }));
        let goldLabel = document.getElementById("Gold");
goldLabel.innerHTML = gold;  // Update gold display
        alert("Success! Card added.");
        displayCards();
    }

   let b = document.getElementById("buyCard");
    b.innerHTML = "<h1>No Card Selected</h1>";


}

const updateUserGold = async (username1, newGoldAmount) => {
    try {
        // Reference the user's gold path in Firebase
        const userGoldRef = ref(database, `users/${username1}`);

        // Update the gold value in Firebase
        await update(userGoldRef, {
            gold: newGoldAmount
        });

        console.log(`✅ Gold updated successfully for ${username1}`);
    } catch (error) {
        console.error("❌ Error updating gold for user:", error);
        alert(`❌ Error updating gold for ${username1}: ${error.message}`);
    }
};
















const displayCards = async () => {
    console.log("StoreCards:", StoreCards);

    // Load cards data from JSON file
    const filename = "CardsData.json"; // Replace with your actual JSON file path
    const data = await loadCardsFromFile(filename);
    
    if (data && data.cards) {
        // Fetch the user's owned cards from Firebase
        const userCardsRef = ref(database, `users/${username}/Cards`);
        const snapshot = await get(userCardsRef);
        const userCards = snapshot.exists() ? snapshot.val() : {};

        // Filter out cards that the user already owns
        const unownedCards = data.cards.filter(card => !userCards[card.name]);

        // Store unowned cards for further use
        StoreCards = unownedCards;

        // Get the cards container element
        const cardsContainer = document.getElementById("storeCards");

        // Clear the existing cards in the container
        cardsContainer.innerHTML = ""; // Clear current store cards
        
        if (unownedCards.length === 0) {
            cardsContainer.innerHTML = "<p>No new cards available.</p>"; // Optional message if no unowned cards are available
        }

        // Iterate over unowned cards and display them
        unownedCards.forEach(card => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");

            // Get the card image dynamically based on card name
            let cardImage = getCardImage(card.name);

            // Set up the inner HTML for each card display
            cardDiv.innerHTML = `
                <h3>${card.name}</h3>
                <img src="${cardImage}" alt="${card.name}" class="card-image">
                <p><strong>Health:</strong> ${card.health}</p>
                <p><strong>Attack:</strong> ${card.attack}</p>
                <p><strong>Defense:</strong> ${card.defense}</p>
                <p><strong>Cost:</strong> ${card.cost}</p>
                <p><strong>Speed:</strong> ${card.speed}</p>
                <p><strong>Luck:</strong> ${card.luck}</p>
            `;

            // Add click event to view card details
            cardDiv.addEventListener("click", () => ViewCard(card.name));

            // Append the card div to the container
            cardsContainer.appendChild(cardDiv);
        });
    } else {
        console.log("Failed to load cards.");
    }
};


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
function getCardImage(cardName) {
  const formattedCardName = cardName.toLowerCase().replace(/\s+/g, '%20');
    return `Cards/${formattedCardName}.png`;  // Correct the path if needed
}



function ViewCard(cardName) {
    // Ensure StoreCards is an object before proceeding
    if (typeof StoreCards !== 'object' || StoreCards === null) {
        console.error("StoreCards is not an object:", StoreCards);
        return;
    }

    // Normalize the input cardName and the names in StoreCards to lowercase and trim extra spaces
    const normalizedCardName = cardName.trim().toLowerCase();

    // Iterate through the StoreCards object to find the card
    const card = Object.values(StoreCards).find(c => c.name.trim().toLowerCase() === normalizedCardName);

    if (!card) {
        console.error("Card not found in StoreCards:", cardName);
        return;
    }
  
    
    const buyCardArea = document.getElementById("buyCard");

    // Clear previous selection
    buyCardArea.innerHTML = "";

    // Get the card image dynamically
    const cardImage = getCardImage(card.name);
    if (!cardImage) {
        console.error("Card image is invalid:", cardImage);
        return;
    }

    // Display the selected card's details
    const selectedCardDiv = document.createElement("div");
    selectedCardDiv.classList.add("selected-card");

    selectedCardDiv.innerHTML = `
        <h3>${card.name}</h3>
        <img src="${cardImage}" alt="${card.name}" class="card-image">
        <p><strong>Health:</strong> ${card.health}</p>
        <p><strong>Attack:</strong> ${card.attack}</p>
        <p><strong>Defense:</strong> ${card.defense}</p>
        <p><strong>Cost:</strong> ${card.cost}</p>
        <p><strong>Speed:</strong> ${card.speed}</p>
        <p><strong>Luck:</strong> ${card.luck}</p>
    `;

    // Append the selected card to the buyCard area
    buyCardArea.appendChild(selectedCardDiv);
    CardToBuy = card;
    console.log(CardToBuy);
}















displayCards();