// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe do teclado
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
  
  // Método para retornar um valor de uma Propriedade
  returnPropertyValue(keyboard, property) {
    const keyboardClass = GlobalKeyboards.Registry[keyboard];
    if (!keyboardClass) {return};
    const prop = keyboardClass[property];
    return prop ? prop : null;
  };

  // Método para mudar as propriedades da gameRules
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

// Global para definir os teclados
global.GlobalKeyboards = new KeyboardRegistry;
const alf = [...'abcdefghijklmnopqrstuvwxyz'];

//--- Fazer teclados novos a partir daqui ---//

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
    Color: "green",
  }
);
GlobalKeyboards.createKeyboard(
  {
    Name: "Azerty",
    Color: "blue",
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

// Export dos teclados
const KeyboardNames = Object.keys(GlobalKeyboards.Registry);
export {Keyboards, KeyboardNames};
