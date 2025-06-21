// Se um método tiver um "_" antes do nome da função, significa que não é para puxa-lo.
// Apenas outros métodos devem puxa-lo.

// Classe dos encontros //
// Classe template para ser extendida depois.
// O Nome é obrigatório para funcionar.
import {system} from "./system.js";
import chalk from "chalk";
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
//   async (rules, money, cards) => {
//  }
// );

// Commom
Encounters.createEncounter(
  {Name: "Shop", Rarity: 'Commom'},
  async (rules, money, cards) => {
  }
);

// Uncommom
// Rare
// Legendary
//-------------------------------------------------------------------------//

// Export dos teclados
const EncounterNames = Object.keys(Encounters.Registry);
export {Encounters, EncounterNames};
