// Libraries
import chalk from "chalk";
const {default: Typo} = await import('typo-js');
const dictionary = new Typo("en_US");

// Modules requires
import {system} from "./scripts/system.js"
import {gameRules} from "./scripts/gameRules.js";
import {InGameCards, AllCards} from "./scripts/cards.js";
import {Keyboards, KeyboardNames} from "./scripts/keyboards.js";
import {Encounters, EncounterNames} from './scripts/encounters.js';

// Constants
let systemRunning = true;
const prompt = system.systemPrompt;
const nToS = system.locatedNumber; // numberToString;
const print = console.log;
const clear = console.clear;
const Keyboard = new Keyboards;

// Game varibles
let Rules;
let Cards;
let Globals = {
  // Typos variables
  MinRequiredPoints: 0,
  PointsGrowthVariable: 0,
  // Game variables
  Round: 0,
  Money: 0,
  // End variables
  HighestScore: 0,
};

//--- Game functions ---//
async function startGame() {
  // Inicializando as cartas
  Cards = new InGameCards;
  // Inicializando o Typos
  Globals.PointsGrowthVariable = 1;
  Globals.MinRequiredPoints = system.roundLargeNumber(system.exponencialGrowth(Globals.PointsGrowthVariable));
  // Inicializando coisas do jogo
  Globals.HighestScore = 0;
  Globals.Money = 0;
  Globals.Round = 1;

  // Game starting mensagem
  const color = Keyboard.returnPropertyValue(Keyboard.Selected, "Color");
  const startMessage = [
    '/c',
    chalk.green.italic.bold('The game is starting...'),
    500,
    `Your selected Keyboard: ${color ? chalk[color].bold(Keyboard.Selected) : Keyboard.Selected}`,
    1500,
    '/c',
    chalk.green.italic.bold('Let the game begin!'),
    1000,
  ];
  await system.arrayPrint(startMessage);

  // Loop do jogo
  while (true) {
    const fastExit = await newRound()
    if (fastExit) {break};
    Rules.gameSpeed = Rules.gameDefaultSpeed;

    //Mensagem de score
    const scoreMessage = [
      '/c',
      `${chalk.italic.underline.bold('TYPOS')}: ${chalk.underline.bold(nToS(Globals.MinRequiredPoints))}`,
      Rules.gameSpeed,
      'x',
      Rules.gameSpeed,
      `${chalk.blue.bold('YOU')}: ${chalk.magenta.bold(nToS(Rules.gameScore))}`,
      Rules.gameSpeed * 2,
    ];
    await system.arrayPrint(scoreMessage);

    if(Rules.gameScore < Globals.MinRequiredPoints || Globals.MinRequiredPoints === 0) {
      const gameOverMessage = [
        '/c',
        chalk.red.bold("Game over!"),
        '',
        `You lasted ${Globals.Round} rounds!`,
        `Your Game Score was ${chalk.magenta.bold(nToS(Rules.gameScore))} points!`,
        `The ${chalk.italic.underline.bold("TYPOS")} had ${chalk.yellow.bold(nToS(Globals.MinRequiredPoints))} points!`,
        `You needed ${chalk.blue.bold(nToS(Globals.MinRequiredPoints - Rules.gameScore))} more to beat the ${chalk.italic.underline.bold('TYPOS')}!`,
        `Your highest ${chalk.green.italic.bold('ENTER')} this game was ${chalk.magenta.bold(nToS(Globals.HighestScore))}!`,
        '',
      ];
      await system.arrayPrint(gameOverMessage);
      await system.confirmationPrompt(false);
      break;
    };

    Globals.PointsGrowthVariable += 1;
    const oldTypo = Globals.MinRequiredPoints;
    Globals.MinRequiredPoints = system.roundLargeNumber(system.exponencialGrowth(Globals.PointsGrowthVariable));

    // Mensagem de vitória
    const oldMoney = Globals.Money;
    const moneyPerEnter = Rules.gameEnters;
    const moneyPerDelete = Rules.gameDeletes;

    Globals.Money += (moneyPerEnter + moneyPerDelete);
    const moneyBeforeInterest = Globals.Money;

    const interest = system.interestCalc(Globals.Money);
    Globals.Money += interest;

    clear();
    print(chalk.green.italic.bold('You beat TYPOS!\n'));
    if (moneyPerEnter > 0) {print(`You earned +${chalk.yellow.bold(moneyPerEnter + '$')} for having ${moneyPerEnter} ${chalk.green.italic.bold('ENTER')}.`)};
    if (moneyPerDelete > 0) {print(`You earned +${chalk.yellow.bold(moneyPerDelete + '$')} for having ${moneyPerDelete} ${chalk.red.italic.bold('DELETE')}.`)};
    if (interest > 0) {print(`You earned +${chalk.yellow.bold(interest + '$')} because of ${moneyBeforeInterest+'$'} ${chalk.yellow.italic.bold('INTEREST')}.`)};
    print(`Your money went from ${oldMoney}$ to ${chalk.yellow.bold(Globals.Money + '$')}!\n`);
    print(`${chalk.italic.underline.bold('TYPOS')} power went from ${oldTypo} to ${chalk.red.bold(Globals.MinRequiredPoints)}!\n`);
    await system.confirmationPrompt(false);

    clear();
    print(chalk.green.italic.bold('Let the game begin!'));
    await system.sleep(Rules.gameSpeed);
  };
};

async function roundChoice(number) {
  switch (number) {
    case 1:
      await Rules.deleteOption();
    break;
    case 2:
      await Cards.switchCards();
    break;
    case 3:
      await Rules.availableKeysInKeyboard();
    break;
    default:
      print(`\nAre you sure you want to ${chalk.red.bold('EXIT')} the game?`);
      let confirmation = await system.confirmationPrompt();
      if (confirmation) {
        return true;
      };
    break;
  };
};

async function newRound() {
  if (!Cards) {throw new Error("Jogo começou sem as Cartas.")};
  // set new rules for the round
  Rules = new gameRules;
  Keyboard.changeRules(Rules);
  Rules.getKeys();
  Rules.gameMoney = Globals.Money;

  // round loop
  let playing = true
  while (playing) {
    if (Rules.gameEnters < 1 || Rules.gameScore >= Globals.MinRequiredPoints) {playing = false; break};

    // board do jogo
    const keyboardColor = Keyboard.returnPropertyValue(Keyboard.Selected, 'Color');
    const consoleMessage = [
      '/c',
      `${chalk.italic.underline.bold("Typos")}: ${nToS(Globals.MinRequiredPoints)}`,
      '',
      `${chalk.magenta.bold(nToS(Rules.gameScore))}`,
      `${chalk.blue.bold(nToS(Rules.gamePoints))} x ${chalk.red.bold(nToS(Rules.gameMultiplier))}`,
      '',
      `${chalk.green.bold('ENTER:')} ${nToS(Rules.gameEnters)}`,
      `${chalk.red.bold("DELETE:")} ${nToS(Rules.gameDeletes)}`,
      `${chalk.yellow.bold('LETTERS')}: [${Rules.gameKeys}]`,
      '',
      '',
      `${chalk.yellow.bold('Money')}: ${Globals.Money}$`,
      `${chalk.cyan.bold('Round')}: ${Globals.Round}`,
      `Keyboard: ${keyboardColor ? chalk[keyboardColor].bold(Keyboard.Selected) : Keyboard.Selected}`,
      '',      
      `You can write a word, or type:`,
      `(1) To ${chalk.red.bold('DELETE')} specified Letters.`,
      `(2) To ${chalk.cyan.bold('ALT + TAB')} your Keys.`,
      `(3) To ${chalk.yellow.bold('CTRL + F')} your keyboard Letters.`,
      `(0) To ${chalk.magenta.bold('EXIT')} the Game.`, 
    ];
    await system.arrayPrint(consoleMessage);
    const word = await prompt(`:`);
    
    // Opções da escolha
    switch (word) {
      // Volta pro menu com confirm prompt
      case '0':
        const exitGame = await roundChoice(0);
        if (exitGame) {
          return true;
        } else {
          continue;
        };
      // Volta pro menu
      case '00':
      return true;
      // Fecha o jogo
      case '000':
        systemRunning = false;
      return true;
      // Continua o script
      default:
      break;
    };
    const choiceNumber = parseInt(word)
    if (choiceNumber && !isNaN(choiceNumber)) {
      await roundChoice(choiceNumber);
      continue;
    };
    
    // Confirmação da palavra
    const upperWord = word.toUpperCase();
    let wordArray = [...upperWord];
    let includeKeys = Rules.gameKeys.filter((item) => {
      return wordArray.includes(item);
    });

    print(`\nAre you sure you want to ${chalk.green.italic.bold('ENTER')} ${word}?\n`);
    if (!dictionary.check(word)) {print(chalk.red.bold(`${word} isn't a real word.`))};
    if (includeKeys.length > 0) {print(`You'll ${chalk.red.italic.bold('DELETE')} the [${includeKeys}] letter(s).`)};
    print(`You'll lose 1 ${chalk.green.bold('ENTER')}.\n`);
    let confirmation = await system.confirmationPrompt();
    if (!confirmation) {continue};

    // Verificação da palavra;
    Rules.gameWord = [word, dictionary.check(word)];
    await Rules.playWord();

    // Execução das abilidades das cartas
    if (Cards.List.length > 0) {
      await system.sleep(Rules.gameSpeed);
      Rules.gameSpeed = Rules.gameDefaultSpeed;

      let cardListString = '';
      for (let i = 0; i < Cards.List.length; i++) {
        const [card, count] = Cards.List[i];
        const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
        cardListString += i === (Cards.List.length - 1) ? `${coloredCard} x${count}` : `${coloredCard} x${count}, `;
      };

      for (let i = 5; i > 0; i--) {
        clear();
        print(chalk.green.italic.bold(`Your KEYS will be pressed in...${i}`));
        print(`\nYour ${chalk.cyan.bold('KEYS')} are:`);
        print(`[${cardListString}]`);
        print(`\n${chalk.italic.bold('The pressing will occur')} ${chalk.italic.underline.bold('IN ORDER')}.`);
        await system.sleep(Rules.gameSpeed);
      };
      
      await Cards.playCards(Rules);
      await system.sleep(Rules.gameSpeed);
    };

    // Score calculation
    Rules.gameSpeed = Rules.gameDefaultSpeed;
    Rules.deleteKeys(includeKeys);

    const realPoints = Rules.gamePoints > 0 ? Rules.gamePoints : 1;
    const realMultiplier = Rules.gameMultiplier > 0 ? Rules.gameMultiplier : 1;
    const multiplication = realPoints * realMultiplier;
    let oldScore = Rules.gameScore;
    Rules.gameScore = Rules.gameScore + multiplication;
    Globals.HighestScore = Globals.HighestScore < multiplication ? multiplication : Globals.HighestScore;

    clear();
    print(chalk.italic.bold('Scoring...'));
    print(`\n${chalk.magenta.bold(nToS(oldScore))}`);
    print('+');
    print(`${chalk.blue.bold(nToS(Rules.gamePoints))} x ${chalk.red.bold(nToS(Rules.gameMultiplier))}`);

    let localeScore = nToS(Rules.gameScore);
    let result = '';
    await system.sleep(Rules.gameSpeed);
    for (let i = 0; i < localeScore.length; i++) {
      result += localeScore[i];
      clear();
      print(chalk.italic.bold('Scoring...'));
      print(`\n${chalk.magenta.bold(nToS(oldScore))}`);
      print('+');
      print(`${chalk.blue.bold(nToS(Rules.gamePoints))} x ${chalk.red.bold(nToS(Rules.gameMultiplier))}`);
      print(`\n${chalk.magenta.bold(result)}`);
      await system.sleep(Rules.gameSpeed);
      Rules._acelerateGame(50);
    };
    Rules.gameSpeed = Rules.gameDefaultSpeed;
    print(`\n${chalk.italic.bold('Done!')}`);
    Rules.gamePoints = 0;
    Rules.gameMultiplier = 0;
    Rules.gameEnters -= 1;
    Globals.Round += 1;
    Globals.Money = Rules.gameMoney;
    await system.sleep(Rules.gameSpeed);
  };
};

async function selectKeyboard() {
  clear();
  print(`What keyboard do you wish to use?`);
  KeyboardNames.forEach((board, index) => {
    const color = Keyboard.returnPropertyValue(board, "Color");
    const desc = Keyboard.returnPropertyValue(board, 'Desc');
    print(`(${index + 1}) ${color ? chalk[color].bold(board) : board}`);
    print(desc ? desc : 'No description available.');
    print('');
  });
  const response = parseInt(await prompt(":"));
  if (isNaN(response) || response === null) {
    print(`Default keyboard selected. (${chalk.green.bold('Membrane')})`);
    await system.sleep(1000);
    return;
  };
  Keyboard.Selected = KeyboardNames[response - 1];
  const color = Keyboard.returnPropertyValue(Keyboard.Selected, "Color");
  print(`\n${color ? chalk[color].bold(Keyboard.Selected) : Keyboard.Selected} keyboard was selected!`);
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
  let response = await prompt(":");

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
      systemRunning = false;
      break;
    default:
      print(chalk.red.bold('\nAre you sure you want to exit the game?'));
      let confirmation = await system.confirmationPrompt();
      if (confirmation) {
        systemRunning = false;
      };
      break;
  };
};
