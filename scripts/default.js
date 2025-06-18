class SystemDefault {
  constructor() {
  };

  async sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };
};

const System = new SystemDefault;
export {System};
