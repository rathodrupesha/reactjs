const LocalStorage = {
  setItem: function (key, value) {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, value);
      resolve();
    });
  },
  getItem: function (key) {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem(key)));
    });
  },
  removeItem: function (key) {
    return new Promise((resolve, reject) => {
      localStorage.removeItem(key);
      resolve();
    });
  },
};

export default LocalStorage;
