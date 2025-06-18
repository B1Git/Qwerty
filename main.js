// Libraries
import chalk from "chalk";
import promptSync from "prompt-sync";
const prompt = promptSync();
const {default: Typo} = await import('typo-js');
const dictionary = new Typo("en_US");

// Modules requires
import {System} from "./scripts/default.js"
import {gameRules} from "./scripts/gameRules.js";
import {InGameCards, AllCards} from "./scripts/cards.js";
import {Keyboards, KeyboardNames} from "./scripts/keyboards.js";

// Globals
const sleep = System.sleep;
const print = console.log;
const clear = console.clear;

// Game constants
const Keyboard = new Keyboards;

// Game varibles
let Rules;
let Cards;

let MinRequiredPoints; //Typos
let Round;
let Money;

let PlaysQuantity; // Enters quantity
let HighestTotalPoints; // Highest Enter

// functions

// Game functions
async function selectKeyboard() {
  clear();
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
  await sleep(1000);
};

async function startGame() {
  Cards = new InGameCards;
  Round = 1;
  MinRequiredPoints = 300;
  Money = 0;
  HighestTotalPoints = 0;
  PlaysQuantity = 0;

  for (let i = 3; i > 0; i--) {
    clear();
    print(chalk.green.italic.bold(`Game starting in...${i}`));
    await sleep(1000);
  };
  
  while (true) {
    await newRound()
    if (Rules.gameTotalPoints < MinRequiredPoints || MinRequiredPoints === 0) {
      clear();
      print(`${chalk.red.italic.bold("Game over!")}`);
      print('Your highest played enter was: ');
      print(`${chalk.green.bold(HighestTotalPoints)} Total Points!`);
      print(`\nPress ${chalk.italic.bold('ENTER')} to proceed.`);
      prompt(':');
      break;
    };
  };
};

async function newRound() {
  if (!Cards) {throw new Error("Jogo começou sem as Cartas.")};
  // set new rules for the round
  Rules = new gameRules;
  Keyboard.changeRules(Rules);
  Rules.getKeys();

  // round loop
  let playing = true
  while (playing) {
    if (Rules.gameEnters < 1 || Rules.gameTotalPoints >= MinRequiredPoints) {playing = false; break};

    // board do jogo
    clear();
    print(`${Rules.gamePoints} x ${Rules.gameMultiplier}`);
    print(`Enters: ${Rules.gameEnters}`);
    print(`Deletes: ${Rules.gameDeletes}`);
    print(`Letters: ${Rules.gameKeys}`);
    print(`(1) to see your Keyboard; (2) to see your Cards;`)
    const word = prompt(`:`);
    
    // Opções de escolha
    const number = parseInt(word)
    if (!isNaN(number) && number) {
      playing = false;
      break;
    };
    
    // Confirmação da palavra
    print(`\nAre you sure you want to ${chalk.italic.bold('ENTER')} ${word}?`);
    if (!dictionary.check(word)) {print(chalk.red.bold(`${word} isn't a real word.`))};
    print(`(N/n to ${chalk.italic.bold('not ENTER')}.)`)
    const response = prompt(":");
    if (!response || response.toLowerCase() === "n") {continue};
    
    // Jogada da palavra
    Rules.gameWord = [word, dictionary.check(word)];
    Rules.playWord();
  };
};

// Entrance message
let firstTime = true;
clear();
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
  if (!firstTime) {
    clear();
    print(chalk.blue.italic.bold("\\QWERTY/"));
  };
  print(
  `\nWhat do you want to do:
  (1) Start the game.
  (2) Choose keyboard.
  (3) How to play.
  (0) Exit game.`);
  firstTime = false;
  let response = parseInt(prompt(":"));

  switch (response) {
    case 1:
      await startGame();
      break;
    case 2:
      await selectKeyboard();
      break;
    case 3:
      print("Playing");
      break;
    default:
      print("Are you sure you want to exit the game? (y/n)");
      let exit = prompt(":");
      if (exit === null) {running = false};
      if (exit.toLowerCase() === "y") {running = false};
      break;
  };
};
