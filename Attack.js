// Retrieve opponent and user deck from localStorage
const opponent = JSON.parse(localStorage.getItem("opponent")) || {};
let myDeck = JSON.parse(localStorage.getItem("userDeck")) || {};

console.log("Opponent Data:", opponent);
console.log("User Deck Data:", myDeck);
let output = document.getElementById("Display");

// Opponent slots
let opponentCards = [
    opponent?.["slot1"] || "",
    opponent?.["slot2"] || "",
    opponent?.["slot3"] || "",
];

// Card variables
let opponentCard1, opponentCard2, opponentCard3;
let mycard1, mycard2, mycard3;

// Load card data
async function loadCardsFromFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return null;
    }
}

// Generate image path for cards
function getCardImage(cardName) {
    return `/Cards/${cardName.toLowerCase().replace(/\s+/g, '%20')}.png`;
}
let theData;
// Process and assign cards
(async () => {
    const cardsData = await loadCardsFromFile("cardsData.json");
    theData = cardsData;
    if (!cardsData || !cardsData.cards) {
        console.error("Card data not found.");
        return;
    }

    console.log("Loaded cards:", cardsData.cards);

    // Assign opponent cards
    opponentCards.forEach((cardName, i) => {
        let matchedCard = cardsData.cards.find(card => card.name.trim().toLowerCase() === cardName.trim().toLowerCase());
        if (matchedCard) {
            let cardSlot = document.getElementById(`${i + 1}`);
            if (cardSlot) {
                cardSlot.innerHTML = `
                    <div class="cardO" onclick="selectCard('${i + 2}7', true)">
                        <h3>${matchedCard.name}</h3>
                        <img src="${getCardImage(matchedCard.name)}" alt="${matchedCard.name}" class="card-image">
                        <p><strong>Health:</strong> <span id="${i + 2}7">${matchedCard.health}</span></p>
                        <p><strong>Attack:</strong> ${matchedCard.attack}</p>
                        <p><strong>Defense:</strong> ${matchedCard.defense}</p>
                        <p><strong>Type:</strong> ${matchedCard.type}</p>
                    </div>
                `;
            }
            if (i === 0) opponentCard1 = matchedCard;
            if (i === 1) opponentCard2 = matchedCard;
            if (i === 2) opponentCard3 = matchedCard;
        }
    });

    Object.keys(myDeck).forEach((slot, i) => {
    let cardName = myDeck[slot]?.trim();
    let matchedCard = cardsData.cards.find(card => card.name.trim().toLowerCase() === cardName.toLowerCase());

    if (matchedCard) {
        // Clone the card to prevent shared reference
        let clonedCard = structuredClone ? structuredClone(matchedCard) : JSON.parse(JSON.stringify(matchedCard));

        let cardSlot = document.getElementById(`${i + 4}`);
        if (cardSlot) {
            cardSlot.innerHTML = `
              <div class="cardMy" onclick="selectCard('${i + 5}7', false)">
                    <h3>${clonedCard.name}</h3>
                    <img src="${getCardImage(clonedCard.name)}" alt="${clonedCard.name}" class="card-image">
                    <p><strong>Health:</strong> <span id="${i + 5}7">${clonedCard.health}</span></p>
                    <p><strong>Attack:</strong> ${clonedCard.attack}</p>
                    <p><strong>Defense:</strong> ${clonedCard.defense}</p>
                    <p><strong>Type:</strong> ${clonedCard.type}</p>
                </div>
            `;
        }

        if (i === 0) mycard1 = clonedCard;
        if (i === 1) mycard2 = clonedCard;
        if (i === 2) mycard3 = clonedCard;
    }
});


    console.log("User Card 1:", mycard1?.name);
})();
let userSelectedCard = null;
let isUserTurn = true;
function selectCard(index, isOpponent) {
    let ind;
    switch (index) {
        case "27": ind = 0; break;
        case "37": ind = 1; break;
        case "47": ind = 2; break;
        case "57": ind = 0; break;
        case "67": ind = 1; break;
        case "77": ind = 2; break;
        default:
            console.error("Invalid index:", index);
            return;
    }

    let selectedCard = isOpponent
        ? [opponentCard1, opponentCard2, opponentCard3][ind]
        : [mycard1, mycard2, mycard3][ind];

    if (!selectedCard || selectedCard.health <= 0) {
        console.warn("Invalid card selected.");
        return;
    }

    // Add selected card effect
    let cardSlot = document.getElementById(`${index}`);
    if (cardSlot) {
        cardSlot.classList.add('.attack-animation');
    }

    // Player's turn
    if (isUserTurn) {
        if (!isOpponent) {
            userSelectedCard = selectedCard;
            output.innerHTML = `Selected ${selectedCard.name} to attack with.`;
        } else if (userSelectedCard) {
            // Execute attack
            let targetCard = selectedCard;
            let damage = Math.max(0, userSelectedCard.attack - targetCard.defense);
            targetCard.health -= damage;
            output.innerHTML = `${userSelectedCard.name} attacked ${targetCard.name} for ${damage} damage!`;

            // Animate selected card for attack
            cardSlot.classList.add('attack-animation');
            cardSlot.classList.add('attack-bg'); // Change background color to indicate attack

            setTimeout(() => {
                // Revert card background color after the attack
                cardSlot.classList.remove('selected-card');
                cardSlot.classList.remove('attack-animation');
                cardSlot.classList.remove('attack-bg'); // Reset background color

                // AI's turn after a delay
                isUserTurn = false;
                TESTING();
                setTimeout(aiTurn, 3000); // AI attacks after 3 seconds
            }, 500); // Duration of attack animation
        }
    }

    TESTING();
}


function aiTurn() {
    let aiAttackers = [opponentCard1, opponentCard2, opponentCard3].filter(c => c.health > 0);
    let playerTargets = [mycard1, mycard2, mycard3].filter(c => c.health > 0);

    output.innerHTML = "Opponent choosing attack...";

    // Wait for 1 second before the AI attacks
    if (aiAttackers.length === 0 || playerTargets.length === 0) {
        output.innerHTML = "Game Over.";
        return;
    }

    let aiCard = aiAttackers[Math.floor(Math.random() * aiAttackers.length)];
    let target = playerTargets[Math.floor(Math.random() * playerTargets.length)];

    let damage = Math.max(0, aiCard.attack - target.defense);
    target.health -= damage;

    // Animate AI attack
    let aiCardSlot = document.getElementById(`${aiCard.name}`);
    if (aiCardSlot) {
        aiCardSlot.classList.add('attack-animation');
    }

    setTimeout(() => {
        // Revert AI card color after attack animation
        if (aiCardSlot) {
            aiCardSlot.classList.remove('attack-animation');
        }

        output.innerHTML = `${aiCard.name} attacked ${target.name} for ${damage} damage!`;
        userSelectedCard = null;
        isUserTurn = true;
        TESTING();
    }, 500); // Animation duration
}
