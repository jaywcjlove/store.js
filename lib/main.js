var storage = window.localStorage, _data = {};

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

// http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
function isQuotaExceeded(e) {
  let quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}

// 隐身模式下的 hack
(function(){
  function isSupported(){
    const _KEY = '_Is_Incognit', _VALUE = 'yes';
    try {
      storage.setItem(_KEY, _VALUE)
      return true;
    } catch (error) {
      return false;
    } finally {
      if (storage.getItem(_KEY) === _VALUE) storage.removeItem(_KEY);
    }
  }

  if (!isSupported()) {
    try {
      storage.__proto__ = {
        setItem: function (id, val) {
          return _data[id] = String(val);
        },
        getItem: function (id) {
          return _data.hasOwnProperty(id) ? _data[id] : undefined;
        },
        removeItem: function (id) {
          return delete _data[id];
        },
        clear: function () {
          return _data = {};
        }
      }
    } catch (e) {
      console.error('localStorage pollyfill error: ', e);
    }
  }
})()

function Store() {
  if (!(this instanceof Store)) {
    return new Store();
  }
}

Store.prototype = {
  set: function (key, val) {
    if (key && !isJSON(key)) {
      try {
        storage.setItem(key, stringify(val));
      } catch (error) {
        if (isQuotaExceeded(error)) {
          // Storage full, maybe notify user or do some clean-up
          console.warn('Storage full!');
        }
      }
    } else if (isJSON(key)) {
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
