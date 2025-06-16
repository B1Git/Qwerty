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
global.clear = console.clear;

// Game constants
const Keyboard = new Keyboards;

// Game varibles
let Rules;
let Cards;
let Money;
let Round;
let Typos;
let HighestEnter;

// Functions 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Game functions
function selectKeyboard() {
  print(`\nWhat keyboard do you wish to use?`);
  KeyboardNames.forEach((board, index) => {
    const color = Keyboard.returnPropertyValue(board, "Color");
    print(`(${index}) ${color ? chalk[color].bold(board) : board}`)
  });
  const response = parseInt(prompt(":"));
  if (isNaN(response) || response === null) {print(`Default keyboard selected. (${chalk.green.bold('Qwerty')})`); return};
  Keyboard.Selected = KeyboardNames[response];
  const color = Keyboard.returnPropertyValue(Keyboard.Selected, "Color");
  print(`Keyboard ${color ? chalk[color].bold(Keyboard.Selected) : Keyboard.Selected} was selected!`);
};

async function startGame() {
  Cards = new InGameCards;
  Money = 0;
  Round = 0;
  Typos = 0;
  HighestEnter = 0;
  print(`\n${chalk.green.italic.bold("Let the game begin!")}`);
  await sleep(1500);

  while (true) {
    newRound()
    if (Rules.gameTotalPoints >= Typos) {continue};
    print(`\n${chalk.red.italic.bold("Game over!")}`);
    print('Your highest played enter was: ');
    print(`${chalk.green.bold(HighestEnter)} Total Points!`);
    break;
  };
};

function newRound() {
  if (!Cards) {throw new Error("Jogo começou sem as Cartas.")};
  Rules = new gameRules;
  Keyboard.changeRules(Rules);
  Rules.getKeys();

  let playing = true
  while (playing) {
    if (Rules.gameEnters < 1 || Rules.gameTotalPoints >= Typos) {playing = false; break};
    clear();
    print(``)
    print(`${Rules.gamePoints} x ${Rules.gameMultiplier}`);
    print(`Enters: ${Rules.gameEnters}`);
    print(`Deletes: ${Rules.gameDeletes}`);
    print(`Letters: ${Rules.gameKeys}`);
    const response = prompt(`:`);
  };
};

// Entrance message
print(`

 $$$$$$\\  $$\\      $$\\ $$$$$$$$\\ $$$$$$$\\ $$$$$$$$\\ $$\\     $$\\ 
$$  __$$\\ $$ | $\\  $$ |$$  _____|$$  __$$\\__$$  __|\\$$\\   $$  |
$$ /  $$ |$$ |$$$\\ $$ |$$ |      $$ |  $$ |  $$ |    \\$$\\ $$  / 
$$ |  $$ |$$ $$ $$\\$$ |$$$$$\\    $$$$$$$  |  $$ |     \\$$$$  /  
$$ |  $$ |$$$$  _$$$$ |$$  __|   $$  __$$<   $$ |      \\$$  /   
$$ $$\\$$ |$$$  / \\$$$ |$$ |      $$ |  $$ |  $$ |       $$ |    
\\$$$$$$ / $$  /   \\$$ |$$$$$$$$\\ $$ |  $$ |  $$ |       $$ |    
 \\___$$$\\ \\__/     \\__|\\________|\\__|  \\__|  \\__|       \\__|    
     \\___|                                                      
                                                                
                                                                

`);
print(`\n${chalk.blue.italic.bold('Welcome to QWERTY!')}`);

// Game loop
let running = true
while (running) {
  print(
  `\nWhat do you want to do:
  (1) Start the game.
  (2) Choose keyboard.
  (3) Game records.
  (0) Exit game.`);
  let response = parseInt(prompt(":"));

  switch (response) {
    case 1:
      startGame();
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
      if (exit === null) {running = false};
      if (exit.toLowerCase() === "y") {running = false};
      break;
  };
};
