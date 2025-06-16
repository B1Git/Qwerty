// Libraries
const prompt = require("prompt-sync")();
const Typo = require("typo-js");
const dictionary = new Typo("en_US");

// Modules requires
const {gameRules} = require("./scripts/gameRules.js");
const {InGameCards, AllCards} = require("./scripts/cards.js");
const {Keyboards, KeyboardNames} = require("./scripts/keyboards.js")

// Globals
global.print = console.log;
global.write = process.stdout.write

// Game constants
const Keyboard = new Keyboards;

// Game varibles
let Rules = new gameRules;
let Cards = new InGameCards;
let Money = 0;
let Round = 0;
let Blind = 300;

// Game functions
function selectKeyboard() {

};

function resetGame() {
  Rules = new gameRules;
  Cards = new InGameCards;
  Money = 0;
  Round = 0;
  Blind = 300;
};

function newRound() {
  
};

Keyboard.selectKeyboard
Keyboard.changeRules("Qwerty");

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
