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
let systemRunning = true;
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
let HighestScore; // Highest Enter

// functions

// Game functions
async function startGame() {
  Cards = new InGameCards;
  Round = 1;
  MinRequiredPoints = 2000000;
  Money = 0;
  HighestScore = 0;
  PlaysQuantity = 0;

  clear();
  print(chalk.green.italic.bold('The game is starting...'));
  await system.sleep(500);
  const color = Keyboard.returnPropertyValue(Keyboard.Selected, "Color");
  print(`Your selected Keyboard: ${color ? chalk[color].bold(Keyboard.Selected) : Keyboard.Selected}`);
  await system.sleep(1500);
  clear();
  print(chalk.green.italic.bold('Let the game begin!'));
  await system.sleep(1000);

  while (true) {
    const fastExit = await newRound()
    if (fastExit) {break};
    if (Rules.gameScore < MinRequiredPoints || MinRequiredPoints === 0) {
      clear();
      print(`${chalk.red.bold("Game over!")}`);
      print(`\nYour highest ${chalk.green.italic.bold('ENTER')} in this game was:`);
      print(`${chalk.magenta.bold(HighestScore.toLocaleString('en-US'))} Total points!`);
      print(`\nPress ${chalk.green.bold('ENTER')} to proceed.`);
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
    print(`${chalk.underline.bold("Typos:")} ${MinRequiredPoints.toLocaleString('en-US')}`);
    print(`\n${chalk.magenta.bold(Rules.gameScore.toLocaleString('en-US'))}`);
    print(`${chalk.blue.bold(Rules.gamePoints.toLocaleString('en-US'))} x ${chalk.red.bold(Rules.gameMultiplier.toLocaleString('en-US'))}`);
    print(`\n${chalk.green.bold('ENTER:')} ${Rules.gameEnters}`);
    print(`${chalk.red.bold("DELETE:")} ${Rules.gameDeletes}`);
    print(`${chalk.yellow.bold('LETTERS')}: [${Rules.gameKeys}]`)

    print(`\nYou can write a word, or type:`);
    print(`(1) To ${chalk.red.bold('DELETE')} specified Letters.`);
    print(`(2) To ${chalk.cyan.bold('ALT + TAB')} your Keys.`);
    print(`(3) To ${chalk.yellow.bold('CTRL + F')} your Keyboards.`);
    print(`(0) To ${chalk.magenta.bold('EXIT')} the Game.`);
    const word = prompt(`:`);
    
    // Opções de escolha
    if (word === "00") {return true};
    if (word === "000") {systemRunning = false; return true};
    const number = parseInt(word)
    if (!isNaN(number) && number || word === '0') {
      playing = false;
      break;
    };
    
    // Confirmação da palavra
    const upperWord = word.toUpperCase();
    let wordArray = [...upperWord];
    let includeKeys = Rules.gameKeys.filter((item) => {
      return wordArray.includes(item);
    });

    print(`\nAre you sure you want to ${chalk.green.italic.bold('ENTER')} ${word}?\n`);
    if (includeKeys.length > 0) {print(`You'll ${chalk.red.italic.bold('DELETE')} the [${includeKeys}] letters.`)};
    if (!dictionary.check(word)) {print(chalk.red.bold(`${word} isn't a real word.`))};
    print(`\nPress ${chalk.green.bold("ENTER")} to confirm.`)
    const response = prompt(":");
    if (response !== "") {continue};
    
    // Jogada da palavra
    Rules.gameWord = [word, dictionary.check(word)];
    await Rules.playWord();
    await system.sleep(1000);

    // Cards game
    Cards.addCard("Repeat");
    Cards.addCard("Repeat");
    if (Cards.List.length > 0) {
      Rules.gameSpeed = 1000;

      let cardListString = '';
      for (let i = 0; i < Cards.List.length; i++) {
        const [card, count] = Cards.List[i];
        const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
        cardListString += i === (Cards.List.length - 1) ? `${coloredCard} x${count}` : `${coloredCard} x${count}, `;
      };

      for (let i = 5; i > 0; i--) {
        clear();
        print(`Your ${chalk.cyan.bold("KEYS")} will be pressed in...${i}`);
        print(`\nYour ${chalk.cyan.bold('KEYS')} are:`);
        print(`[${cardListString}]`);
        print(`\nYour ${chalk.cyan.bold('KEYS')} will be pressed in order.`)
        await system.sleep(1000);
      };
      
      await Cards.playCards(Rules);
      await system.sleep(1000);
    };

    // Score calculation
    Rules.gameSpeed = 1000;
    Rules.deleteKeys(includeKeys);

    const realPoints = Rules.gamePoints > 0 ? Rules.gamePoints : 1;
    const realMultiplier = Rules.gameMultiplier > 0 ? Rules.gameMultiplier : 1;
    let oldScore = Rules.gameScore;
    Rules.gameScore = Rules.gameScore + (realPoints * realMultiplier);

    clear();
    print(chalk.italic.bold('Scoring...'));
    print(`\n${chalk.magenta.bold(oldScore.toLocaleString('en-US'))}`);
    print('+');
    print(`${chalk.blue.bold(Rules.gamePoints.toLocaleString('en-US'))} x ${chalk.red.bold(Rules.gameMultiplier.toLocaleString('en-US'))}`);

    let localeScore = Rules.gameScore.toLocaleString('en-US');
    let result = '';
    await system.sleep(Rules.gameSpeed);
    for (let i = 0; i < localeScore.length; i++) {
      result += localeScore[i];
      clear();
      print(chalk.italic.bold('Scoring...'));
      print(`\n${chalk.magenta.bold(oldScore.toLocaleString('en-US'))}`);
      print('+');
      print(`${chalk.blue.bold(Rules.gamePoints.toLocaleString('en-US'))} x ${chalk.red.bold(Rules.gameMultiplier.toLocaleString('en-US'))}`);
      print(`\n${chalk.magenta.bold(result)}`);
      await system.sleep(Rules.gameSpeed);
      Rules._acelerateGame(50);
    };
    Rules.gameSpeed = 1000;
    print(`\n${chalk.italic.bold('Done!')}`);
    Rules.gamePoints = 0;
    Rules.gameMultiplier = 0;
    Rules.gameEnters -= 1;
    await system.sleep(Rules.gameSpeed);
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
  await system.sleep(1000);
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
while (systemRunning) {
  if (!firstTime) {
    clear();
    print(chalk.blue.italic.bold("\\QWERTY/"));
  };
  print(`\nWhat do you wish to do:`);
  print(`(1) To ${chalk.green.bold("ENTER")} the Game.`);
  print(`(2) To ${chalk.blue.bold("SELECT")} a Keyboard.`);
  print(`(3) To ${chalk.yellow.bold("LEARN")} the Game.`);
  print(`(0) To ${chalk.red.bold("EXIT")} the Game.`);
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
      if (exit === null) {systemRunning = false};
      if (exit.toLowerCase() === "y") {running = false};
      break;
  };
};
