const alf = [...'abcdefghijklmnopqrstuvwxyz'];
class gameRules {
  constructor() {
    this.gameWord = "";
    this.gameEnters = 4;
    this.gameDeletes = 2;
    this.gamePoints = 0;
    this.gameMultiplier = 0;

    this.gameKeysQuantity = 5;
    this.gameKeyboard = [...alf, ...alf];
    this.gameKeys = [];
    this.gameGraveyard = [];
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
    if (this.gameDeletes < 1) {return};
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
};

export {gameRules};
//module.exports = {gameRules};
