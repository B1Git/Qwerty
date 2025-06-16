// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe da carta
class DefaultKeyboard {
  constructor(Name, props = {}) {
    this.Name = Name;
    Object.assign(this, props);
  };
};

// Classe do registro
class KeyboardRegistry {
  constructor() {
    this.Registry = {};
  };

  _createKeyboardInstance(name) {
    const keyboardClass = this.Registry[name];
    if (!keyboardClass) {throw new Error(`Teclado ${name} não foi registrada.`)}
    this.Registry[name] = new keyboardClass();
  };

  createKeyboard(props) {
    const {Name} = props;
    if (!Name) {throw new Error("Propriedade 'Name' é obrigatória para criar um teclado.")}

    const Keyboard = class extends DefaultKeyboard {
      constructor() {
        super(Name, props);
      };
    };
    
    this.Registry[Name] = Keyboard;
    this._createKeyboardInstance(Name);
  };
};

// Classe que vai ser puxada
class Keyboards {
  constructor() {
    this.Selected = "Qwerty";
  };

  changeRules(rules) {
    let keyboardClass = GlobalKeyboards.Registry[this.Selected];
    if (!keyboardClass) {keyboardClass = GlobalKeyboards.Registry["Qwerty"]};
    for (const key of Object.keys(keyboardClass)) {
      let existingRule = rules[key];
      if (existingRule) {
        rules[key] = keyboardClass[key];
      };
    }
  };
};

// Global para definir as cartas
global.GlobalKeyboards = new KeyboardRegistry;
const alf = [...'abcdefghijklmnopqrstuvwxyz'];

//--- Fazer cartas novas a partir daqui ---//

// Template

// GlobalKeyboards.createKeyboard(
//   {
//     Name: "(Nome aqui)",
//   }
// );

// Commom
GlobalKeyboards.createKeyboard(
  {
    Name: "Qwerty",
  }
);
GlobalKeyboards.createKeyboard(
  {
    Name: "Azerty",
    gameKeysQuantity: 4,
    gameKeyboard: [...alf],
    gameEnters: 2,
    gameDeletes: 4,
    keyboardCard: "AzertyCard",
  }
);

// Uncommom
// Rare
// Legendary
//-------------------------------------------------------------------------//

// Export da inGameCards
const KeyboardNames = Object.keys(GlobalKeyboards.Registry);
module.exports = {Keyboards, KeyboardNames};
