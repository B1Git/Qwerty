// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe dos encontros //
// Classe template para ser extendida depois.
// O Nome é obrigatório para funcionar.
import {system} from "./system.js";
import chalk from "chalk";
const print = console.log;
const clear = console.clear;
class DefaultEncounter {
  constructor(Name, props = {}) {
    this.Name = Name;
    Object.assign(this, props);
  };

  async executeEncounter(rules, money, cards) {
    throw new Error("applyEffect() precisa ser implementado pela subclasse.")
  };
};

// Classe do registro //
// Classe utilizada para registrar novos encontros.
class EncounterRegistry {
  constructor() {
    this.Registry = {};
  };

  _createEncounterInstance(name) {
    const encounterClass = this.Registry[name];
    if (!encounterClass) {throw new Error(`Encountro ${name} não foi registrada.`)}
    this.Registry[name] = new encounterClass();
  };

  createEncounter(props, execDef) {
    const {Name} = props;
    if (!Name) {throw new Error("Propriedade 'Name' é obrigatória para criar um encontro.")}

    const Encounter = class extends DefaultEncounter {
      constructor() {
        super(Name, props);
      };

      async executeEncounter(rules, money, cards) {
        await execDef(rules, money, cards);
      };
    };
    
    this.Registry[Name] = Encounter;
    this._createEncounterInstance(Name);
  };
};

const Encounters = new EncounterRegistry;

//--- Fazer encontros novos a partir daqui ---//

// Template

// Nome obrigatório.
// Interessante seria colocar uma Rarity tbm, mas não é obrigatório.
//
// Encounters.createEncounter(
//   {Name: "Shop", Rarity: 'Commom'},
//   async (rules, cards) => {
//  }
// )

const raritiesWeights = {
  Commom: 100,
  Uncommom: 50,
  Rare: 15,
  Legendary: 1,
};
const rarityTotalWeight = Object.values(raritiesWeights).reduce((sum, weight) => sum + weight, 0);

Encounters.createEncounter(
  {Name: "Shop", Rarity: 'Commom'},
  async (rules, cards) => {

    const raritiesPrices = {
      Commom: 6,
      Uncommom: 12,
      Rare: 24,
      Legendary: 48,
    };

    let slots = 3;
    if (system.randomInit(1, 100) === 1) {slots = 4};
    let keysForSale = [];

    for (let i = 0; i < slots; i++) {
      if (i === 4) {
        const chosenLegendary = cards.getRandomCardByRarity('Legendary');
        keysForSale.push(chosenLegendary);
      } else {
        const randomNumber = system.randomInit(1, rarityTotalWeight);
        let chosenRarity;
        let accmulated = 0;

        for (const [rarity, weight] of Object.entries(raritiesWeights)) {
          accmulated += weight;
          if (randomNumber <= accmulated) {
            chosenRarity = rarity;
            break;
          };
        };

        const chosenRandomCard = cards.getRandomCardByRarity(chosenRarity);
        keysForSale.push(chosenRandomCard);
      };
    };

    let shopping = true;
    while (shopping) {
      clear();
      print(chalk.yellow.bold('S-H-O-P\n'));
      print(`${chalk.cyan.italic.bold('KEYS')} for sale:\n`);

      print('|===---')
      keysForSale.forEach((card, index) => {
        const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
        const realRarity = card.Rarity ? card.Rarity : 'Commom';
        print(`|(${index + 1}) ${coloredCard}. [${chalk.yellow.bold(raritiesPrices[realRarity] + '$')}]`);
        print(`|${card.Desc ? card.Desc : 'No description available.'}`);
        if (index + 1 < keysForSale.length) {print('|')};
      });
      print('|===---\n')

      print(`M: ${chalk.yellow.bold(rules.gameMoney + "$")}`);
      print(`What do you wish to do?`);
      print(`(1) To ${chalk.yellow.bold('BUY')} Keys.`);
      print(`(2) To ${chalk.cyan.bold('MANAGE')} ${chalk.italic.bold('your')} Keys.`);
      print(`(0) To ${chalk.red.bold('EXIT')} the Shop.`);
      let response = await system.systemPrompt(':');
      switch (response) {
        case '1':
          print(`\nWrite down the (numbers) of the ${chalk.cyan.italic.bold('KEYS')} you want to ${chalk.yellow.italic.bold('BUY')}. (0 to Cancel)`);
          let buyResponse = await system.systemPrompt(':');
          if (!buyResponse || buyResponse === '0') {break};
          
          const buyArray = [...buyResponse];
          let indexes = buyArray.filter((item) => {
            return parseInt(item);
          });
          indexes = indexes.map(item => parseInt(item));

          // Verifica se números existem no array
          if (indexes.length < 1) {
            print(chalk.red.italic.bold('\nNext time, write down some (numbers)...'));
            await system.sleep(1000);
            break;
          };

          // Números para cartas
          let specificKeys = keysForSale.filter((current, index) => {
            return indexes.includes(index + 1);
          });

          // Verifica se existem cartas no array
          if (specificKeys.length < 1) {
            print(chalk.red.italic.bold('\nNext time, write down available (numbers)...'));
            await system.sleep(1000);
            break;
          };

          let totalPrices = 0;
          specificKeys.forEach((card) => {
            const realRarity = card.Rarity ? card.Rarity : 'Commom';
            const priceByRarity = raritiesPrices[realRarity];
            totalPrices += priceByRarity;
          });

          print(`\nYour total will be [${chalk.yellow.bold(totalPrices + '$')}].`);
          if (totalPrices > rules.gameMoney) {
            print(chalk.red.italic.bold(`You don't have enough money...\n`));
            await system.confirmationPrompt(false);
            break;
          };
          print(`You'll ${chalk.yellow.bold('BUY')}:\n`);
          specificKeys.forEach((card, index) => {
            const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
            const realRarity = card.Rarity ? card.Rarity : 'Commom';
            print(`(${index + 1}) ${coloredCard}. [${chalk.yellow.bold(raritiesPrices[realRarity] + '$')}]`);
          });
          print('');
          let finalConfirmation = await system.confirmationPrompt();
          if (finalConfirmation) {
            specificKeys.forEach((card) => {
              cards.addCard(card.Name);
            });
            rules.gameMoney -= totalPrices;
            break;
          };

        break;
        case '2':
          clear();
          await cards.switchCards();
        break;
        default:
          print(`\nAre you sure you want to ${chalk.red.italic.bold('EXIT')} the Shop?`);
          let exitConfirm = await system.confirmationPrompt();
          if (exitConfirm) {
            shopping = false;
          };
        break;
      };
      continue;
    };
  }
);

//-------------------------------------------------------------------------//

// Export dos teclados
const EncounterNames = Object.keys(Encounters.Registry);
export {Encounters, EncounterNames};
