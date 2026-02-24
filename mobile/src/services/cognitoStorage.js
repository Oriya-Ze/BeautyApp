const memoryStore = {};

const cognitoStorage = {
  setItem: (key, value) => {
    memoryStore[key] = value;
    return memoryStore[key];
  },
  getItem: (key) => {
    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
      return memoryStore[key];
    }
    return undefined;
  },
  removeItem: (key) => {
    delete memoryStore[key];
  },
  clear: () => {
    Object.keys(memoryStore).forEach((key) => {
      delete memoryStore[key];
    });
  },
};

export default cognitoStorage;
