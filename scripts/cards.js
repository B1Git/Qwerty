// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe da carta //
// É uma class utilizada como "template", mais tarde vai ser utilizada com um extend
// É obrigatório o Name na classe
// O applyEffect é a função que solta o efeito da carta. Ela precisa das gameRules para funcionar.
// Caso o applyEffect não mude na criação de uma carta nova, ele manda um erro se for chamado.
import {system} from "./default.js";
import chalk from "chalk";
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
    return new cardClass();
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
    
    this.Registry[Name] = Card;
  };
};

// Classe que vai ser puxada //
// Meio auto-explicativo, é a classe que será exportada.
// o List é um array de cartas equipadas, muda a cada jogo novo.
// o addCard só adiciona uma carta na lista, utilizando o "_createCardInstance", mencionado acima.
// o playCards joga todas as cartas da List baseado na ordem delas.
class InGameCards {
  constructor() {
    this.List = [];
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
      for (let i = 0; i < count; i++) {
        await card.applyEffect(rules);
        await system.sleep(rules.gameSpeed);
      };
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
  {Name: "Enter", Type: "Boost", Rarity: "Commom", Desc: `Gives +${chalk.red.bold('5')}`},
  async (rules) => {
    rules.gameMultiplier += 5;
  }
);
await GlobalCards.createCard(
  {Name: "Backspace", Type: "Boost", Rarity: "Commom", Desc: `Gives +${chalk.blue.bold('50')}`},
  async (rules) => {
    rules.gamePoints += 50;
  }
);
await GlobalCards.createCard(
  {Name: 'Repeat', Type: 'Effect', Rarity: 'Uncommom', Color: 'cyan', Desc: `If real word, ${chalk.green.bold('REPEAT')} word scoring.`},
  async (rules) => {
    await rules.playWord();
  }
)

// Uncommom
// Rare
// Legendary
//-------------------------------------------------------------------------//

// Export da inGameCards
const AllCards = Object.keys(GlobalCards.Registry);
export {InGameCards, AllCards};
