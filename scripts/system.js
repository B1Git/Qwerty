import readline from 'readline';
import { Writable } from 'stream';
import chalk from 'chalk';

process.stdin.setRawMode(true);

const filteredOutput = new Writable({
  write(chunk, encoding, callback) {
    callback();
  }
})

class SystemDefault {
  constructor() {
  };

  // Sistemas
  systemPrompt(question) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: filteredOutput,
        terminal: true
      })

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
        process.stdin.resume();
      }

      process.stdout.write(question);

      rl.question('', (response) => {
        rl.close();
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
          process.stdin.pause();
        };
        resolve(response);
      })
    });
  };

  async sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  // Agilidade
  async arrayPrint(array) {
    if (typeof array !== 'object') {return};
    if (array.length < 1) {return};
    for (const message of array) {
      if (typeof message === 'number') {
        await this.sleep(message);
      } else {
        switch (message) {
          case '/enter':
            return await this.confirmationPrompt();
          case '/trueEnter':
            return await this.confirmationPrompt(false);
          case '/c':
            console.clear();
            break;
          default:
            console.log(message);
            break;
        };
      };
    };
  };

  async confirmationPrompt(cancel = true) {
    if (cancel === false) {
      console.log(`Press ${chalk.green.bold('[ENTER]')} to continue.`);
      await this.systemPrompt(':');
      return true;
    } else {
      console.log(`Press ${chalk.green.bold('[ENTER]')} to confirm. (0 to Cancel)`);
      let response = await this.systemPrompt(':');
      return response === '0' ? false : true;
    };
  };

  // Formulas
  locatedNumber(number, language) {
    if (!number) {return 0};
    if (!language) {language = 'en-US'};
    return number.toLocaleString(language);
  };

  roundLargeNumber(number) {
    const rounded = Math.round(number);
    const rest = rounded % 100;
    return rest < 50 ? rounded - rest : rounded + (100 - rest);
  };

  exponencialGrowth(ante = 1, base = 300, growthNumber = 1.4) {
    const result = Math.floor(base * Math.pow(growthNumber, ante - 1));
    return result;
  };

  slowInverselyProportional(maxY = 1000, rate = 10, variableX = 1000) {
    const result = maxY * (1 - Math.exp(-rate / variableX));
    return result;
  };
};

const system = new SystemDefault;
export {system};
