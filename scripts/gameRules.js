import {system} from "./system.js";
import chalk from "chalk";
const alf = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const print = console.log;
const nToS = system.locatedNumber; // numberToString;
class gameRules {
  constructor() {
    this.gameWord = [];
    this.gameKeys = [];
    this.gameKeyboard = [...alf, ...alf];
    this.gameGraveyard = [];
    this.gameKeysQuantity = 5;

    this.gamePoints = 0;
    this.gameMultiplier = 0;
    this.gameScore = 0;

    this.gameEnters = 4;
    this.gameDeletes = 4;
    this.gameDefaultSpeed = 1000;
    this.gameSpeed = 1000;
  };

  randomInit(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  };

  getKeys() {
    let loopSize = this.gameKeysQuantity - this.gameKeys.length;
    if (this.gameKeyboard.length < loopSize) {loopSize = this.gameKeyboard.length};
    if (loopSize <= 0) {return};

    for (let i = 0; i < loopSize; i++) {
      let randomKey = this.gameKeyboard[this.randomInit(0, this.gameKeyboard.length)];
      this.gameKeys.push(randomKey);
    const index = this.gameKeyboard.indexOf(randomKey);
      this.gameKeyboard.splice(index, 1);
    };
  };

  deleteKeys(keysToDelete) {
    let tempArr = this.gameKeys.filter((item) => {
      return !keysToDelete.includes(item);
    });
    this.gameKeys.forEach((item) => {
      let removingKey = keysToDelete.find((key) => {
        return item == key;
      });
      if (removingKey) {
        this.gameGraveyard.push(item);
      };
    });
    this.gameKeys = tempArr;
    this.getKeys();
  };

  async playWord() {
    if (!this.gameWord[1]) {return};
    const upperWord = this.gameWord[0].toUpperCase();
    let wordArray = [...upperWord];
    let keysToDelete = this.gameKeys.filter((item) => {
      return wordArray.includes(item);
    });
    let word = this.gameWord[0];

    // Multiplicador por tamanho da palavra
    console.clear();
    print(chalk.bold.italic(`Word size verification...`));
    print(`${chalk.blue.bold(nToS(this.gamePoints))} x ${chalk.red.bold(this.gameMultiplier)}`);
    print(`\n${word}`);
    const oldMultiplier = this.gameMultiplier
    await system.sleep(this.gameSpeed);
    for (let i = 0; i < word.length; i++) {
      let result = '';

      for (let j = 0; j < word.length; j++) {
        if (j === i) {
          result += chalk.bgRed.white.bold(word[j]);
        } else {
          result += word[j];
        };
      };

      this.gameMultiplier += 1;
      console.clear();
      print(chalk.bold.italic(`Word size verification...`));
      print(`${chalk.blue.bold(nToS(this.gamePoints))} x ${chalk.red.bold(nToS(this.gameMultiplier))}`);
      print(`\n${result}`);
      print(`+${chalk.red.bold(nToS(this.gameMultiplier - oldMultiplier))}`);

      this._acelerateGame();
      await system.sleep(this.gameSpeed);
    };

    print(`\n${chalk.italic.bold('Done!')}`);
    await system.sleep(this.gameSpeed);

    // Pontos por letra existente   
    if (keysToDelete.length > 0) {
      let gameKeysString = `[${this.gameKeys.join(", ")}]`;
      console.clear();
      print(chalk.bold.italic(`Correct letters verification...`));
      print(`${chalk.blue.bold(nToS(this.gamePoints))} x ${chalk.red.bold(nToS(this.gameMultiplier))}`);
      print(`\n${gameKeysString}`);
      print(`\n${word}`);
      let pointCounter = 0;
      await system.sleep(this.gameSpeed);
      for (let key = 0; key < gameKeysString.length; key++) {
        if (!this.gameKeys.includes(gameKeysString[key])) {continue};
        let keyResult = '';

        // Resto da string da key
        for (let j = 0; j < gameKeysString.length; j++) {
          if (j === key) {
            keyResult += chalk.bgBlue.white.bold(gameKeysString[j]);
          } else {
            keyResult += gameKeysString[j];
          };
        };

        // Loop pela palavra
        for (let i = 0; i < word.length; i++) {
          if (word[i].toUpperCase() !== gameKeysString[key]) {continue};
          let result = '';

          for (let j = 0; j < word.length; j++) {
            if (j === i) {
              result += chalk.bgBlue.white.bold(word[j]);
            } else {
              result += word[j]
            };
          };

          this.gamePoints += 10;
          pointCounter += 10;
          console.clear();
          print(chalk.bold.italic(`Correct letters verification...`));
          print(`${chalk.blue.bold(nToS(this.gamePoints))} x ${chalk.red.bold(nToS(this.gameMultiplier))}`);
          print(`\n${keyResult}`);
          print(`\n${result}`);
          print(`+${chalk.red.blue(nToS(pointCounter))}`);

          this._acelerateGame();
          await system.sleep(this.gameSpeed);
        };
      };
      print(`\n${chalk.italic.bold('Done!')}`);
    } else {
      console.clear();
      print(chalk.red.bold.italic(`No correct letters this time...`));
    };

    await system.sleep(this.gameSpeed);
  };

  _acelerateGame(rate) {
    const result = system.slowInverselyProportional(this.gameDefaultSpeed, 10, this.gameSpeed);
    this.gameSpeed -= Math.round(result);
    if (this.gameSpeed <= 50) {this.gameSpeed = 50};
  };
};

export {gameRules};
