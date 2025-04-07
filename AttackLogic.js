let turn = false;


console.log("my turn =" + false);


function TESTING() {



    console.log("opponentCard1:", opponentCard1);
console.log("opponentCard2:", opponentCard2);
console.log("opponentCard3:", opponentCard3);
console.log("mycard1:", mycard1);
console.log("mycard2:", mycard2);
console.log("mycard3:", mycard3);

    console.log("Updating UI with new health values...");

    let elements = [27, 37, 47, 57, 67, 77].map(id => document.getElementById(id));
    let cards = [opponentCard1, opponentCard2, opponentCard3, mycard1, mycard2, mycard3];

    elements.forEach((el, i) => {
        if (el && cards[i]) {
            el.innerHTML = cards[i].health;
            console.log(`Updated ID ${el.id}: ${cards[i].health}`);
        } else {
            console.warn(`Element or card missing for index ${i}`);
        }
    });
}
