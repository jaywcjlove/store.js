function isJSON(obj) {
  obj = JSON.stringify(obj);
  if (!/^\{[\s\S]*\}$/.test(obj)) {
    return false;
  }
  return true;
}

function stringify(val) {
  return val === undefined || typeof val === "function" ? val + '' : JSON.stringify(val);
}
function deserialize(value) {
  if (typeof value !== 'string') { return undefined; }
  try { return JSON.parse(value); }
  catch (e) { return value; }
}
function isFunction(value) { return ({}).toString.call(value) === "[object Function]"; }
function isArray(value) { return Object.prototype.toString.call(value) === "[object Array]"; }
// https://github.com/jaywcjlove/store.js/pull/8
// Error: QuotaExceededError
function dealIncognito(storage) {
  var _KEY = '_Is_Incognit', _VALUE = 'yes';
  try {
    // NOTE: set default storage when not passed in
    if (!storage) {
      storage = window.localStorage;
    }
    storage.setItem(_KEY, _VALUE);
    storage.removeItem(_KEY);
  } catch (e) {
    var inMemoryStorage = {};
    inMemoryStorage._data = {};
    inMemoryStorage.setItem = function (id, val) {
      return inMemoryStorage._data[id] = String(val);
    };
    inMemoryStorage.getItem = function (id) {
      return inMemoryStorage._data.hasOwnProperty(id) ? inMemoryStorage._data[id] : undefined;
    };
    inMemoryStorage.removeItem = function (id) {
      return delete inMemoryStorage._data[id];
    };
    inMemoryStorage.clear = function () {
      return inMemoryStorage._data = {};
    }
    storage = inMemoryStorage;
  }
  finally { if (storage.getItem(_KEY) === _VALUE) storage.removeItem(_KEY); }
  return storage;
}

// deal QuotaExceededError if user use incognito mode in browser
const storage = dealIncognito();

function Store() {
  if (!(this instanceof Store)) {
    return new Store();
  }
}

Store.prototype = {
  set: function (key, val) {
    if (key && !isJSON(key)) {
      storage.setItem(key, stringify(val));
    } else if (isJSON(key)) {
      for (var a in key) this.set(a, key[a]);
    }
    return this;
  },
  get: function (key) {
    // Return all entries if no key
    if (key === undefined) {
      var ret = {};
      this.forEach((key, val) => ret[key] = val);
      return ret;
    }
    if (key.charAt(0) === '?') {
      return this.has(key.substr(1));
    }
    const args = arguments;
    if (args.length > 1) {
      const dt = {};
      for (var i = 0, len = args.length; i < len; i++) {
        const value = deserialize(storage.getItem(args[i]));
        if (this.has(args[i])) {
          dt[args[i]] = value;
        }
      }
      return dt;
    }
    return deserialize(storage.getItem(key));
  },
  clear: function () {
    storage.clear();
    return this;
  },
  remove: function (key) {
    var val = this.get(key);
    storage.removeItem(key);
    return val;
  },
  has: function (key) { return ({}).hasOwnProperty.call(this.get(), key); },
  keys: function () {
    var d = [];
    this.forEach((k) => {
      d.push(k);
    });
    return d;
  },
  forEach: function (callback) {
    for (var i = 0, len = storage.length; i < len; i++) {
      var key = storage.key(i);
      callback(key, this.get(key));
    }
    return this;
  },
  search: function (str) {
    var arr = this.keys(), dt = {};
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i].indexOf(str) > -1) dt[arr[i]] = this.get(arr[i]);
    }
    return dt;
  }
}

let _Store = null;
function store(key, data) {
  const argm = arguments;
  let dt = null;
  if (!_Store) _Store = Store();
  if (argm.length === 0) return _Store.get();
  if (argm.length === 1) {
    if (typeof (key) === "string") return _Store.get(key);
    if (isJSON(key)) return _Store.set(key);
  }
  if (argm.length === 2 && typeof (key) === "string") {
    if (!data) return _Store.remove(key);
    if (data && typeof (data) === "string") return _Store.set(key, data);
    if (data && isFunction(data)) {
      dt = null
      dt = data(key, _Store.get(key))
      store.set(key, dt);
    }
  }
  if (argm.length === 2 && isArray(key) && isFunction(data)) {
    for (var i = 0, len = key.length; i < len; i++) {
      dt = data(key[i], _Store.get(key[i]))
      store.set(key[i], dt)
    }
  }
  return store
}
for (var a in Store.prototype) store[a] = Store.prototype[a];

export default store;
