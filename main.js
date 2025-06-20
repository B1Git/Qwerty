// Libraries
import chalk from "chalk";
import promptSync from "prompt-sync";
const prompt = promptSync();
const {default: Typo} = await import('typo-js');
const dictionary = new Typo("en_US");

// Modules requires
import {system} from "./scripts/default.js"
import {gameRules} from "./scripts/gameRules.js";
import {InGameCards, AllCards} from "./scripts/cards.js";
import {Keyboards, KeyboardNames} from "./scripts/keyboards.js";

// Globals
const sleep = system.sleep;
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
async function startGame() {
  Cards = new InGameCards;
  Round = 1;
  MinRequiredPoints = 2000000;
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
    if (Rules.gameScore < MinRequiredPoints || MinRequiredPoints === 0) {
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
    if (Rules.gameEnters < 1 || Rules.gameScore >= MinRequiredPoints) {playing = false; break};

    // board do jogo
    clear();
    print(`${chalk.underline.bold("Typos:")} ${MinRequiredPoints}`);
    print(`\n${chalk.magenta.bold(Rules.gameScore)}`);
    print(`${chalk.blue.bold(Rules.gamePoints)} x ${chalk.red.bold(Rules.gameMultiplier)}`);
    print(`\n${chalk.green.bold('ENTER:')} ${Rules.gameEnters}`);
    print(`${chalk.red.bold("DELETE:")} ${Rules.gameDeletes}`);
    print(`${chalk.yellow.bold('LETTERS')}: [${Rules.gameKeys}]`)

    print(`\nYou can write a word, or type:`);
    print(`(1) To ${chalk.red.bold('DELETE')} specified Letters.`);
    print(`(2) To ${chalk.cyan.bold('ALT + TAB')} your Keys.`);
    print(`(3) To ${chalk.yellow.bold('CTRL + F')} your Keyboards.`);
    print(`(0) To ${chalk.magenta.bold('ESC')} the Game.`);
    const word = prompt(`:`);
    
    // Opções de escolha
    const number = parseInt(word)
    if (!isNaN(number) && number || word === '0') {
      playing = false;
      break;
    };
    
    // Confirmação da palavra
    const upperWord = word.toUpperCase();
    let wordArray = [...upperWord];
    let includeKeys = this.gameKeys.filter((item) => {
      return wordArray.includes(item);
    });

    print(`\nAre you sure you want to ${chalk.green.italic.bold('ENTER')} ${word}?\n`);
    if (includeKeys.length > 0) {print(`You'll ${chalk.red.italic.bold('DELETE')} the [${includeKeys}] letters.`)};
    if (!dictionary.check(word)) {print(chalk.red.bold(`${word} isn't a real word.`))};
    print(`\n${chalk.green.italic.bold("ENTER")} to confirm.`)
    const response = prompt(":");
    if (response !== "") {continue};
    
    // Jogada da palavra
    Rules.gameWord = [word, dictionary.check(word)];
    await Rules.playWord();
    Rules.gameSpeed = 1000;

    // Score calculation
    Rules.gameScore = Rules.gamePoints * Rules.gameMultiplier;
    clear();
  };
};

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
  print(`\nWhat do you wish to do:`);
  print(`(1) To ${chalk.green.bold("ENTER")} the Game.`);
  print(`(2) To ${chalk.blue.bold("SELECT")} a Keyboard.`);
  print(`(3) To ${chalk.yellow.bold("LEARN")} the Game.`);
  print(`(0) To ${chalk.red.bold("ESC")} the Game.`);
  firstTime = false;
  let response = prompt(":");

  switch (response) {
    case '1':
      await startGame();
      break;
    case '2':
      await selectKeyboard();
      break;
    case '3':
      print("Playing");
      break;
    case '00':
      running = false;
      break;
    default:
      print(chalk.red.bold('Are you sure you want to exit the game? (Y/N)'));
      let exit = prompt(":");
      if (exit === null) {running = false};
      if (exit.toLowerCase() === "y") {running = false};
      break;
  };
};
