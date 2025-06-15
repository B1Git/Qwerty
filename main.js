// Libraries
const prompt = require("prompt-sync")();
const Typo = require("typo-js");
const dictionary = new Typo("en_US");

// Modules requires
const {gameRules} = require("./scripts/gameRules.js");
const {inGameCards} = require("./scripts/cards.js");

// Globals
global.print = console.log;

// Game variables
let Rules = new gameRules;
let Cards = new inGameCards;
let Money = 0;
let Round = 0;
let Blind = 300;

let allCards = Object.getOwnPropertyNames(Cards).filter((item) => {
  return typeof Cards[item] === "function";
});

// Game functions
function resetGame() {
  Rules = new gameRules;
  Cards = new inGameCards;
  Money = 0;
  Round = 0;
  Blind = 300;
};

function newRound() {
  
};

for (let i = 0; i < 10; i++) {
  Cards.addCard("Enter");
};
Cards.addCard("Backspace");
Cards.addCard("AzertyCard");
print(Cards.cardList);
Cards.playCards(Rules);
print(Rules.gameMultiplier);
print(Rules.gamePoints);

// Game loop
let gaming = true
while (gaming) {
  print(
  `What do you want to do:
  (1) Start the game.
  (2) Choose keyboard.
  (3) Game records.
  (0) Exit game.`);
  let response = parseInt(prompt(":"));

  switch (response) {
    case 1:
      print("Gaming")
      break;
    case 2:
      print("Keyboard");
      break;
    case 3:
      print("Records");
      break;
    default:
      print("Are you sure you want to exit the game? (y/n)");
      let exit = prompt(":");
      if (exit.toLowerCase() === "y") {gaming = false};
      break;
  };
};
