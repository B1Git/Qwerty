// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe da carta
class DefaultCard {
  constructor(Name, props = {}) {
    this.Name = Name;
    Object.assign(this, props);
  };

  applyEffect(rules) {
    throw new Error("applyEffect() precisa ser implementado pela subclasse.")
  };
};

// Classe do registro
class CardRegistry {
  constructor() {
    this.Registry = {};
  };

  _createCardInstance(name) {
    const cardClass = this.Registry[name];
    if (!cardClass) {throw new Error(`Carta ${name} não foi registrada.`)}
    return new cardClass();
  };

  createCard(props, effectDef) {
    const {Name} = props;
    if (!Name) {throw new Error("Propriedade 'Name' é obrigatória para criar uma carta.")}

    const Card = class extends DefaultCard {
      constructor() {
        super(Name, props);
      };

      applyEffect(rules) {
        effectDef(rules);
      };
    };
    
    this.Registry[Name] = Card;
  };
};

// Classe que vai ser puxada
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

  playCards(rules) {
    this.List.forEach(([card, count]) => {
      for (let i = 0; i < count; i++) {
        card.applyEffect(rules);
      };
    });
  };
};

// Global para definir as cartas
global.GlobalCards = new CardRegistry;

//--- Fazer cartas novas a partir daqui ---//

// Template

//GlobalCards.createCard(
//  {Name: "(Nome aqui)", Type: "(Tipo aqui)", Rarity: "(Raridade aqui)"},
//  (rules) => {
//    console.log("Gozadas")
//  }
//);

// Commom
GlobalCards.createCard(
  {Name: "Enter", Type: "MultBoost", Rarity: "Commom"},
  (rules) => {
    rules.gameMultiplier += 5;
  }
);
GlobalCards.createCard(
  {Name: "Backspace", Type: "PointBoost", Rarity: "Commom"},
  (rules) => {
    rules.gamePoints += 10;
  }
);

// Uncommom
// Rare
// Legendary
//-------------------------------------------------------------------------//

// Export da inGameCards
const AllCards = Object.keys(GlobalCards.Registry);
export {InGameCards, AllCards};
//module.exports = {InGameCards, AllCards};
