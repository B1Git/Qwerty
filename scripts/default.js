class SystemDefault {
  constructor() {
  };
;
  async sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  async timedPrint(log, delay) {
    if (typeof log === "object") {
      log.forEach((item) => {
        console.log(item);
      });
    } else {
      console.log(log);
    };
    await this.sleep(delay);
  };

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
