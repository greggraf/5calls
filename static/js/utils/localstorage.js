// localStorage wrapper

var _localStorage = window.localStorage;

module.exports = {
  getAll: (storeName, cb) => {
    console.log("_localStorage", _localStorage)
    try {
      cb(JSON.parse(_localStorage[storeName]));
    } catch (e) {
      console.log("err")
      cb([]);
    }
  },
  get: (storeName) => {
    try {
      var item;
      var all = JSON.parse(_localStorage[storeName]);
      if (all.length > 0) {
        item = all[0];
      }
      return item;
    } catch (e) {
      return;
    }
  },
  set: (storeName, item) => {
    module.exports.replace(storeName, 0, item, () => {});
  },
  add: (storeName, item, cb) => {
    module.exports.getAll(storeName, (items) => {
      items.push(item);
      saveStore(storeName, JSON.stringify(items), cb);
    });
  },
  replace: (storeName, index, item, cb) => {
    module.exports.getAll(storeName, (items) => {
      items[index] = item;
      saveStore(storeName, JSON.stringify(items), cb);
    });
  },
  remove: (storeName, cb) => {
    module.exports.getAll(storeName, () => {
      _localStorage.removeItem(storeName);
      cb();
    });
  },
  setStorage: (storageObj) => {
    _localStorage = storageObj;
  }
};

// handle storage quota errors
function saveStore (storeName, storeItems, cb) {
  try {
    _localStorage[storeName] = storeItems;
    cb();
  }
  catch (e) {
    cb(e);
  }
}
