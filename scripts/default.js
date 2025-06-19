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
};

const system = new SystemDefault;
export {system};
