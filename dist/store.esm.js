/*!
 * storejs v1.0.20
 * Local storage localstorage package provides a simple API
 * 
 * Copyright (c) 2018 kenny wang <wowohoo@qq.com>
 * https://github.com/jaywcjlove/store.js
 * 
 * Licensed under the MIT license.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var storage = window.localStorage,
    even_storage = function even_storage() {};

function isJSON(obj) {
  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
}
function stringify(val) {
  return val === undefined || typeof val === "function" ? val + '' : JSON.stringify(val);
}
function deserialize(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value || undefined;
  }
}
function isFunction(value) {
  return {}.toString.call(value) === "[object Function]";
}
function isArray(value) {
  return value instanceof Array;
}
function dealIncognito(storage) {
  var _KEY = '_Is_Incognit',
      _VALUE = 'yes';
  try {
    storage.setItem(_KEY, _VALUE);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      var _nothing = function _nothing() {};
      storage.__proto__ = { setItem: _nothing, getItem: _nothing, removeItem: _nothing, clear: _nothing };
    }
  } finally {
    if (storage.getItem(_KEY) === _VALUE) storage.removeItem(_KEY);
  }
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
  set: function set$$1(key, val) {
    even_storage('set', key, val);
    if (key && !isJSON(key)) {
      storage.setItem(key, stringify(val));
    } else if (key && isJSON(key) && !val) {
      for (var a in key) {
        this.set(a, key[a]);
      }
    }
    return this;
  },
  get: function get$$1(key) {
    if (!key) {
      var ret = {};
      this.forEach(function (key, val) {
        return ret[key] = val;
      });
      return ret;
    }
    if (key.charAt(0) === '?') {
      return this.has(key.substr(1));
    }
    return deserialize(storage.getItem(key));
  },
  clear: function clear() {
    this.forEach(function (key, val) {
      even_storage('clear', key, val);
    });
    storage.clear();
    return this;
  },
  remove: function remove(key) {
    var val = this.get(key);
    storage.removeItem(key);
    even_storage('remove', key, val);
    return val;
  },
  has: function has(key) {
    return {}.hasOwnProperty.call(this.get(), key);
  },
  keys: function keys() {
    var d = [];
    this.forEach(function (k) {
      d.push(k);
    });
    return d;
  },
  size: function size() {
    return this.keys().length;
  },
  forEach: function forEach(callback) {
    for (var i = 0; i < storage.length; i++) {
      var key = storage.key(i);
      if (callback(key, this.get(key)) === false) break;
    }
    return this;
  },
  search: function search(str) {
    var arr = this.keys(),
        dt = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(str) > -1) dt[arr[i]] = this.get(arr[i]);
    }
    return dt;
  },
  onStorage: function onStorage(cb) {
    if (cb && isFunction(cb)) even_storage = cb;
    return this;
  }
};

var _Store = null;
function store(key, data) {
  var argm = arguments;
  var dt = null;
  if (!_Store) _Store = Store();
  if (argm.length === 0) return _Store.get();
  if (argm.length === 1) {
    if (typeof key === "string") return _Store.get(key);
    if (isJSON(key)) return _Store.set(key);
  }
  if (argm.length === 2 && typeof key === "string") {
    if (!data) return _Store.remove(key);
    if (data && typeof data === "string") return _Store.set(key, data);
    if (data && isFunction(data)) {
      dt = null;
      dt = data(key, _Store.get(key));
      return dt ? store.set(key, dt) : store;
    }
  }
  if (argm.length === 2 && isArray(key) && isFunction(data)) {
    for (var i = 0; i < key.length; i++) {
      dt = data(key[i], _Store.get(key[i]));
      store.set(key[i], dt);
    }
    return store;
  }
}
for (var a in Store.prototype) {
  store[a] = Store.prototype[a];
}

export default store;
