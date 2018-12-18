var storage = window.localStorage;

function isJSON(obj) {
  return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
}
function stringify(val) {
  return val === undefined || typeof val === "function" ? val + '' : JSON.stringify(val);
}
function deserialize(value) {
  if (typeof value !== 'string') { return undefined; }
  try { return JSON.parse(value); }
  catch (e) { return value || undefined; }
}
function isFunction(value) { return ({}).toString.call(value) === "[object Function]"; }
function isArray(value) { return Object.prototype.toString.call(value) === "[object Array]"; }
function dealIncognito(storage) {
  var _KEY = '_Is_Incognit', _VALUE = 'yes';
  try { storage.setItem(_KEY, _VALUE) }
  catch (e) {
    if (e.name === 'QuotaExceededError') {
      var _nothing = function () { };
      storage.__proto__ = { setItem: _nothing, getItem: _nothing, removeItem: _nothing, clear: _nothing };
    }
  }
  finally { if (storage.getItem(_KEY) === _VALUE) storage.removeItem(_KEY); }
  return storage;
}

// deal QuotaExceededError if user use incognito mode in browser
storage = dealIncognito(storage);

function Store() {
  if (!(this instanceof Store)) {
    return new Store();
  }
}

Store.prototype = {
  set: function (key, val) {
    if (key && !isJSON(key)) {
      storage.setItem(key, stringify(val));
    } else if (key && isJSON(key) && !val) {
      for (var a in key) this.set(a, key[a]);
    }
    return this;
  },
  get: function (key) {
    if (!key) {
      var ret = {};
      this.forEach((key, val) => ret[key] = val);
      return ret;
    }
    if (key.charAt(0) === '?') {
      return this.has(key.substr(1));
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
    for (var i = 0; i < storage.length; i++) {
      var key = storage.key(i);
      if (callback(key, this.get(key)) === false) break;
    }
    return this;
  },
  search: function (str) {
    var arr = this.keys(), dt = {};
    for (var i = 0; i < arr.length; i++) {
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
      return dt ? store.set(key, dt) : store;
    }
  }
  if (argm.length === 2 && isArray(key) && isFunction(data)) {
    for (var i = 0; i < key.length; i++) {
      dt = data(key[i], _Store.get(key[i]))
      store.set(key[i], dt)
    }
    return store
  }
}
for (var a in Store.prototype) store[a] = Store.prototype[a];

export default store;
