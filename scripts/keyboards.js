// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe do teclado //
// Classe template para ser extendida depois.
// O Nome é obrigatório para funcionar.
import {system} from "./system.js";
import chalk from 'chalk';
class DefaultKeyboard {
  constructor(Name, props = {}) {
    this.Name = Name;
    Object.assign(this, props);
  };
};

// Classe do registro //
// Classe utilizada para registrar novos teclados. (decks)
// Diferente das cartas, o KeyboardRegistry não guarda uma classe extendida.
// ele guarda um new Class direto.
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

// Classe que vai ser puxada //
// A constante do keyboard no main.js
// O Selected indica qual teclado está selecionado, uma string.
// o changeRules, como o nome indica, muda as gameRules para se adequar ao teclado selecionado
// caso o teclado selecionado não exista, o "Qwerty" (teclado padrão) será puxado.
//
// o returnPropertyValue vai ser usado para voltar cores de cada teclado
// uso isso para deixar as coisas mais bonitinhas, mas pode ser usado para puxar
// qualquer coisa de qualquer teclado.
class Keyboards {
  constructor() {
    this.Selected = "Membrane";
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
    if (!keyboardClass) {keyboardClass = GlobalKeyboards.Registry["Membrane"]};
    for (const key of Object.keys(keyboardClass)) {
      let existingRule = rules[key];
      if (existingRule) {
        rules[key] = keyboardClass[key];
      };
    }
  };
};

// Global para definir os teclados
// esse três pontos antes da string no array alf
// serve para desconstruir o array em ["a", "b", "c", etc.]
global.GlobalKeyboards = new KeyboardRegistry;
const alf = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

//--- Fazer teclados novos a partir daqui ---//

// Template

// Nome obrigatório.
// Interessante seria colocar uma Color tbm, mas não é obrigatório.
// as Cores são as cores que o chalk tem
//
// GlobalKeyboards.createKeyboard(
//   {
//     Name: "(Nome aqui)",
//   }
// );

// Commom
GlobalKeyboards.createKeyboard(
  {
    Name: "Membrane",
    Desc: `A bad keyboard, but it never lets you down. Gives +1 ${chalk.red.bold('DELETE')}.`,
    gameDeletes: 5,
  }
);
GlobalKeyboards.createKeyboard(
  {
    Name: "Semi-Mechanical",
    Color: "green",
    Desc: `Gives +1 ${chalk.red.bold('DELETE')} and ${chalk.green.bold('ENTER')}, but it makes the game very ${chalk.yellow.italic.bold('dirty')}...`,
    gameKeysQuantity: 4,
    gameKeyboard: [...alf],
    gameEnters: 5,
    gameDeletes: 5,
  }
);
GlobalKeyboards.createKeyboard(
  {
    Name: "Mechanical",
    Color: 'blue',
    Desc: `Too much ${chalk.green.italic.bold('gaming')}...`,
    gameEnters: 10,
    gameDeletes: 1,
  }
);
GlobalKeyboards.createKeyboard(
  {
    Name: "Optical",
    Color: 'yellow',
    Desc: `Makes the game a little too ${chalk.yellow.italic.bold('fast')}...`,
    gameDefaultSpeed: 250,
    gameSpeed: 250,
  }
);

// Uncommom
// Rare
// Legendary
//-------------------------------------------------------------------------//

// Export dos teclados
const KeyboardNames = Object.keys(GlobalKeyboards.Registry);
export {Keyboards, KeyboardNames};
