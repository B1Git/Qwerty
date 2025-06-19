import {system} from "./default.js";
import chalk from "chalk";
const alf = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const print = console.log;
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
    this.gameDeletes = 2;
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
    //if (!this.gameWord[1]) {return};
    const upperWord = this.gameWord[0].toUpperCase();
    let wordArray = [...upperWord];
    let keysToDelete = this.gameKeys.filter((item) => {
      return wordArray.includes(item);
    });
    let speedDivisor = 2;
    let word = this.gameWord[0];

    // Multiplicador por tamanho da palavra
    console.clear();
    print(chalk.bold.italic(`Word size verification...`));
    print(`${chalk.blue.bold(this.gamePoints)} x ${chalk.red.bold(this.gameMultiplier)}`);
    print(`\n${word}`);
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
      print(`${chalk.blue.bold(this.gamePoints)} x ${chalk.red.bold(this.gameMultiplier)}`);
      print(`\n${result}`);
      print(`+${chalk.red.bold(i+1)}`);

      this._acelerateGame();
      await system.sleep(this.gameSpeed);
    };
    await system.sleep(this.gameSpeed);

    // Pontos por letra existente   
    if (keysToDelete.length > 0) {
      let gameKeysString = `[${this.gameKeys.join(", ")}]`;
      console.clear();
      print(chalk.bold.italic(`Correct letters verification...`));
      print(`${chalk.blue.bold(this.gamePoints)} x ${chalk.red.bold(this.gameMultiplier)}`);
      print(`\n${gameKeysString}`);
      print(`\n${word}`);
      let pointCounter = 0;
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
          print(`${chalk.blue.bold(this.gamePoints)} x ${chalk.red.bold(this.gameMultiplier)}`);
          print(`\n${keyResult}`);
          print(`\n${result}`);
          print(`+${chalk.red.blue(pointCounter)}`);

          this._acelerateGame();
          await system.sleep(this.gameSpeed);
        };
      };
    } else {
      console.clear();
      print(chalk.red.bold.italic(`No correct letters this time...`));
    };

    this.deleteKeys(keysToDelete);
    await system.sleep(this.gameSpeed);
  };

  _acelerateGame(rate) {
    // função exponencial decrescente invertida
    // Y = A * (1 - e^-k / x)
    if (!rate) {rate = 10};
    const A = this.gameDefaultSpeed; // altura máxima que o Y chega;
    const B = 1; // deslocamento para evitar divisão por 0;
    const K = rate; // taxa de crescimento (quanto menor, maior rapido);
    const Y = A * (1 - Math.exp(-K / (this.gameSpeed + B)));
    this.gameSpeed -= Math.round(Y);
    if (this.gameSpeed <= 200) {this.gameSpeed = 200};
  };
};

export {gameRules};
