// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe da carta //
// É uma class utilizada como "template", mais tarde vai ser utilizada com um extend
// É obrigatório o Name na classe
// O applyEffect é a função que solta o efeito da carta. Ela precisa das gameRules para funcionar.
// Caso o applyEffect não mude na criação de uma carta nova, ele manda um erro se for chamado.
import {system} from "./system.js";
import chalk from "chalk";
const clear = console.clear;
const nToS = system.locatedNumber; // numberToString;
const print = console.log;
class DefaultCard {
  constructor(Name, props = {}) {
    this.Name = Name;
    Object.assign(this, props);
  };

  async applyEffect(rules) {
    throw new Error("applyEffect() precisa ser implementado pela subclasse.")
  };
};

// Classe do registro //
// Uma classe que é utilizada para registrar cartas novas
// o "createCard" é utilizada para criar uma carta nova.
// ele faz isso extendendo a classe DefaultCard e modificando ela de acordo com as propriedades
// passadas no método.
// Depois de modificar a classe DefaultCard, ele registra ela no Registry pelo nome
//
// o "_createCardInstace" é uma função utilizada pela class InGameCards para "equipar" uma carta.
// Como o que foi guardado no "createCard" foi uma classe extendida, não uma "new Class", ele precisa
// criar ela para funcionar, essa função "_createCardInstance" faz isso.
class CardRegistry {
  constructor() {
    this.Registry = {};
  };

  _createCardInstance(name) {
    const cardClass = this.Registry[name];
    if (!cardClass) {throw new Error(`Carta ${name} não foi registrada.`)}
    return cardClass;
  };

  async createCard(props, effectDef) {
    const {Name} = props;
    if (!Name) {throw new Error("Propriedade 'Name' é obrigatória para criar uma carta.")}

    const Card = class extends DefaultCard {
      constructor() {
        super(Name, props);
      };

      async applyEffect(rules) {
        await effectDef(rules);
      };
    };
    
    this.Registry[Name] = new Card;
  };
};

// Classe que vai ser puxada //
// Meio auto-explicativo, é a classe que será exportada.
// o List é um array de cartas equipadas, muda a cada jogo novo.
// o addCard só adiciona uma carta na lista, utilizando o "_createCardInstance", mencionado acima.
// o playCards joga todas as cartas da List baseado na ordem delas.
function ExecutionOrderPrintOut(List) {
  print(`\nA list of all your ${chalk.cyan.italic.bold('KEYS')}, in order of execution:`);
  print(`[${List.length}/5]\n`);
  for (let i = 0; i < List.length; i++) {
    const [card, count] = List[i];
    const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
    print(`(${i+1})${count > 1 ? ' ['+count+'x]' : ' '}${coloredCard}:`);
    print(`${card.Desc ? card.Desc : 'No availible description.'}\n`);
  };
};
class InGameCards {
  constructor() {
    this.List = [];
    this.HiddenList = [];
  };

  addCard(name) {
    let existingCard = this.List.find(([card]) => card.Name === name);
    if (existingCard) {
      existingCard[1] += 1;
    } else {
      const cardInstance = GlobalCards._createCardInstance(name);
      this.List.push([cardInstance, 1]);
    };
  };

  async playCards(rules) {
    for (const [card, count] of this.List) {
      const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
      console.clear();
      console.log(`Pressing ${coloredCard}...`);
      console.log(`It will be pressed ${chalk.yellow.bold(count)} time(s).`);
      await system.sleep(rules.gameSpeed * 2);
      for (let i = 0; i < count; i++) {
await GlobalCards.createCard(
  {Name: "F15", Type: "Boost", Rarity: "Legendary", Desc: `Gives +${chalk.red.bold('5')}.`},
  async (rules) => {
    rules.gameMultiplier += 5;
  }
);
await GlobalCards.createCard(
  {Name: "F18", Type: "Boost", Rarity: "Legendary", Desc: `Gives +${chalk.red.bold('5')}.`},
  async (rules) => {
    rules.gameMultiplier += 5;
  }
);
        await card.applyEffect(rules);
        await system.sleep(rules.gameSpeed);
        rules._acelerateGame(5);
      };
    };
  };

  getRandomCardByRarity(rarity) {
    const registry = GlobalCards.Registry
    const filteredCardNames = [];

    for (const cardName in registry) {
      const card = registry[cardName];
      if (!card.Rarity) {continue};
      if (card.Rarity.toLowerCase() === rarity.toLowerCase()) {
        filteredCardNames.push(cardName);
      };
    };

    if (filteredCardNames.length === 0) {
      throw new Error(`Nenhuma carta de raridade ${rarity} encontrada.`);
    };

    const randomIndex = system.randomInit(1, filteredCardNames.length);
    const chosenCardName = filteredCardNames[randomIndex - 1];

    return registry[chosenCardName];
  };

  async switchCards() {
    if (this.List.length > 0) {
      ExecutionOrderPrintOut(this.List);
      // Opções
      const optionsMessage = [
        'What do you wish to do?',
        `(1) To ${chalk.blue.bold('SWITCH')} the positions of specific Keys.`,
        `(2) To ${chalk.red.bold('DELETE')} specific Keys.`,
        `(0) To ${chalk.magenta.bold('GO BACK')} to the Game.`,
      ];
      await system.arrayPrint(optionsMessage);
      let response = await system.systemPrompt(':');
      switch (response) {
        case '1':
          if (this.List.length < 2) {
            print(chalk.red.italic.bold('\nYou need at least 2 KEYS...'));
            await system.sleep(1000);
            break;
          };
          // Trocar as posições das cartas
          console.clear();
          ExecutionOrderPrintOut(this.List);
          
          print(`Write down the (numbers) of ${chalk.underline.bold('2')} ${chalk.cyan.italic.bold('KEYS')} you want to ${chalk.blue.italic.bold('SWITCH UP')}. (0 to Cancel)`);
          let switchResponse = await system.systemPrompt(':');
          if (!switchResponse || switchResponse === '0') {break};
          
          // Resposta para números
          const responseArray = [...switchResponse];
          let specificIndexes = responseArray.filter((item) => {
            return parseInt(item);
          });
          specificIndexes = specificIndexes.map(item => parseInt(item));

          // Verificação de números
          if (specificIndexes.length < 1) {
            print(chalk.red.italic.bold('\nNext time, write down some (numbers)...'));
            await system.sleep(1000);
            break;
          };

          // Definição de indexes e cartas
          const firstCardIndex = specificIndexes[0] - 1;
          const secondCardIndex = specificIndexes[1] - 1;
          
          const [firstCard, c1] = this.List[firstCardIndex];
          const coloredFirstCardName = firstCard.Color ? chalk[firstCard.Color].bold(firstCard.Name) : firstCard.Name;

          const [secondCard, c2] = this.List[secondCardIndex];
          const coloredSecondCardName = secondCard.Color ? chalk[secondCard.Color].bold(secondCard.Name) : secondCard.Name;
          
          // Confirmação
          print(`\nThe following ${chalk.cyan.italic.bold('KEYS')} will ${chalk.blue.italic.bold('SWITCH UP')}:\n`);
          print(`${coloredFirstCardName} (${specificIndexes[0]}) => (${specificIndexes[1]})`);
          print(`${coloredSecondCardName} (${specificIndexes[1]}) => (${specificIndexes[0]})\n`);
          let confirmation = await system.confirmationPrompt();
          if (confirmation) {
          [this.List[firstCardIndex], this.List[secondCardIndex]] = [this.List[secondCardIndex], this.List[firstCardIndex]];
            print(chalk.green.italic.bold('\nSwitched successfully.'));
            await system.sleep(1000);
            break;
          };
          
        break;
        case '2':
          // Deletar cartas
          console.clear();
          ExecutionOrderPrintOut(this.List);

          print(`Write down the (number) of the ${chalk.cyan.italic.bold('KEYS')} you want to ${chalk.red.italic.bold('DELETE')}. (0 to Cancel)`);
          let numberResponse = await system.systemPrompt(':');
          if (!numberResponse || numberResponse === '0') {break};

          // Resposta para números
          const deleteArray = [...numberResponse];
          let indexes = deleteArray.filter((item) => {
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
          let specificKeys = this.List.filter((current, index) => {
            return indexes.includes(index + 1);
          });

          // Verifica se existem cartas no array
          if (specificKeys.length < 1) {
            print(chalk.red.italic.bold('\nNext time, write down available (numbers)...'));
            await system.sleep(1000);
            break;
          };

          // Confirmação
          print(`\nYou'll ${chalk.red.italic.bold('DELETE')} the following ${chalk.cyan.italic.bold('KEYS')}:\n`);
          for (let i = 0; i < specificKeys.length; i++) {
            const [card, count] = specificKeys[i];
            const coloredCard = card.Color ? chalk[card.Color].bold(card.Name) : card.Name;
            print(`(${i+1}) ${coloredCard}.`);
          };
          print('');
          let deleteConfirmation = await system.confirmationPrompt();
          if (deleteConfirmation) {
            let filteredArray = this.List.filter((item) => {
              return !specificKeys.includes(item);
            });
            this.List = filteredArray;
            print(chalk.green.italic.bold('\nKeys have been successfully deleted.'));
            await system.sleep(1000);
            break;
          };

        break;
        default:
        break;
      };
    } else {
      print(chalk.red.italic.bold('\nYou have no KEYS...'));
      await system.sleep(1000);
    };

  };
};

// Global para definir o registro de cartas
global.GlobalCards = new CardRegistry;

//--- Fazer cartas novas a partir daqui ---//

// Template

// ({object}, (function))
// o objeto pode ter qualquer coisa na real, só precisa obrigatóriamente ter um "Name".
// de resto, é escolha
//
// a função precisa das rules como argumento. e qualquer coisa que envolva as regras pode ser feita na função.

//GlobalCards.createCard(
//  {Name: "(Nome aqui)", Type: "(Tipo aqui)", Rarity: "(Raridade aqui)"},
//  (rules) => {
//    console.log("Gozadas")
//  }
//);

// Commom
await GlobalCards.createCard(
  {Name: "Enter", Type: "Boost", Rarity: "Commom", Color: 'blue', Desc: `Gives +${chalk.red.bold('5')}.`},
  async (rules) => {
    clear();
    print(chalk.italic.bold('Pressing Enter...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}`);
    await system.sleep(rules.gameSpeed);
    rules.gameMultiplier += 5;
    clear();
    print(chalk.italic.bold('Pressing Enter...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}\n`);
    print(`+${chalk.red.bold('5')}`);
    await system.sleep(rules.gameSpeed);
  }
);
await GlobalCards.createCard(
  {Name: "Backspace", Type: "Boost", Rarity: "Commom", Color: 'blue', Desc: `Gives +${chalk.blue.bold('50')}.`},
  async (rules) => {
    clear();
    print(chalk.italic.bold('Pressing Backspace...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}`);
    await system.sleep(rules.gameSpeed);
    rules.gamePoints += 50;
    clear();
    print(chalk.italic.bold('Pressing Backspace...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}\n`);
    print(`+${chalk.blue.bold('50')}`);
    await system.sleep(rules.gameSpeed);
  }
);

// Uncommom
await GlobalCards.createCard(
  {Name: 'Repeat', Type: 'Effect', Rarity: 'Uncommom', Color: 'green', Desc: `If real word, ${chalk.green.bold('REPEAT')} word scoring.`},
  async (rules) => {
    await rules.playWord();
  }
)

// Rare
await GlobalCards.createCard(
  {Name: "F1", Type: "Boost", Rarity: "Rare", Color: 'red', Desc: `Gives +${chalk.red.bold('25')}.`},
  async (rules) => {
    clear();
    print(chalk.italic.bold('Pressing F1...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}`);
    await system.sleep(rules.gameSpeed);
    rules.gameMultiplier += 25;
    clear();
    print(chalk.italic.bold('Pressing F1...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}\n`);
    print(`+${chalk.red.bold('25')}`);
    await system.sleep(rules.gameSpeed);
  }
);
await GlobalCards.createCard(
  {Name: "F2", Type: "Boost", Rarity: "Rare", Color: 'red', Desc: `Gives +${chalk.blue.bold('500')}.`},
  async (rules) => {
    clear();
    print(chalk.italic.bold('Pressing F2...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}`);
    await system.sleep(rules.gameSpeed);
    rules.gamePoints += 500;
    clear();
    print(chalk.italic.bold('Pressing F2...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}\n`);
    print(`+${chalk.blue.bold('500')}`);
    await system.sleep(rules.gameSpeed);
  }
);

// Legendary
await GlobalCards.createCard(
  {Name: "Page Up", Type: "Boost", Rarity: "Legendary", Color: 'magenta', Desc: `Gives x${chalk.red.bold('15')}.`},
  async (rules) => {
    clear();
    print(chalk.italic.bold('Pressing Page Up...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}`);
    await system.sleep(rules.gameSpeed);
    rules.gameMultiplier = rules.gameMultiplier * 10;
    clear();
    print(chalk.italic.bold('Pressing Page Up...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}\n`);
    print(`x${chalk.red.bold('10')}`);
    await system.sleep(rules.gameSpeed);
  }
);
await GlobalCards.createCard(
  {Name: "Page Down", Type: "Boost", Rarity: "Legendary", Color: 'magenta', Desc: `Gives x${chalk.blue.bold('5')}.`},
  async (rules) => {
    clear();
    print(chalk.italic.bold('Pressing Page Down...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}`);
    await system.sleep(rules.gameSpeed);
    rules.gamePoints = rules.gamePoints * 5;
    clear();
    print(chalk.italic.bold('Pressing Page Down...'));
    print(`${chalk.blue.bold(nToS(rules.gamePoints))} x ${chalk.red.bold(nToS(rules.gameMultiplier))}\n`);
    print(`x${chalk.blue.bold('5')}`);
    await system.sleep(rules.gameSpeed);
  }
);

//-------------------------------------------------------------------------//

// Export da inGameCards
const AllCards = Object.keys(GlobalCards.Registry);
export {InGameCards, AllCards};
