// Libraries
import chalk from "chalk";
import promptSync from "prompt-sync";
const prompt = promptSync();
const {default: Typo} = await import('typo-js');
const dictionary = new Typo("en_US");

// Modules requires
import {gameRules} from "./scripts/gameRules.js";
import {InGameCards, AllCards} from "./scripts/cards.js";
import {Keyboards, KeyboardNames} from "./scripts/keyboards.js";

// Globals
global.print = console.log;
global.write = process.stdout.write;

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
  print(`\n` + chalk.blue.bold('Teste de cor legal'));
  KeyboardNames.forEach((board, index) => {
    print(`(${index}) ${board}`);
  });
  const response = parseInt(prompt(":"));
  if (isNaN(response) || response === null) {print(`Default keyboard selected. (Qwerty)`); return};
  Keyboard.Selected = KeyboardNames[response];
  print(`Keyboard ${Keyboard.Selected} was selected!`);
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

print(dictionary.check("color"));

// Game loop
let gaming = true
while (gaming) {
  print(
  `\nWhat do you want to do:
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
      selectKeyboard();
      break;
    case 3:
      print("Records");
      break;
    default:
      print("Are you sure you want to exit the game? (y/n)");
      let exit = prompt(":");
      if (exit === null) {gaming = false};
      if (exit.toLowerCase() === "y") {gaming = false};
      break;
  };
};
