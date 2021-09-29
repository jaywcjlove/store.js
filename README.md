JavaScript localStorage
===

[![Downloads](https://img.shields.io/npm/dm/storejs.svg?style=flat)](https://www.npmjs.com/package/storejs)
[![Build and test storejs](https://github.com/jaywcjlove/store.js/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/store.js/actions/workflows/ci.yml)
[![Coverage Status](https://jaywcjlove.github.io/store.js/badges.svg)](https://jaywcjlove.github.io/store.js/lcov-report/)
[![README-zh.md](https://jaywcjlove.github.io/sb/lang/chinese.svg)](./README-zh.md)

A simple, lightweight JavaScript API for handling browser [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), it is easy to pick up and use, has a reasonable footprint 2.08kb(gzipped: 0.97kb), and has no dependencies. It should not interfere with any JavaScript libraries or frameworks.

> Old [v1](https://raw.githack.com/jaywcjlove/store.js/doc-v1.1/index.html) version [document preview](https://raw.githack.com/jaywcjlove/store.js/doc-v1.1/index.html).

**Features:**

🚀 Has no dependencies  
🌱 Works in all browsers  
🔥 Heavily tested  
📦 Supports AMD/CommonJS  
💥 [store.min.js](dist/store.min.js) 2.08kb(gzipped: 0.97kb)  

## Usage

Installed via [npm](https://www.npmjs.com/package/storejs). You will need `Node.js` installed on your system.

```bash
$ npm install storejs --save
```

```js
import store from 'storejs';

store('test', 'tank', 1)
```

Or manually download and link `storejs` in your HTML, It can also be downloaded via [UNPKG](https://unpkg.com/storejs/dist/) or [jsDelivr CDN](https://www.jsdelivr.com/package/npm/storejs):

```html
<script src="https://unpkg.com/cookiejs/dist/cookie.min.js"></script>
<script type="text/javascript">
  store('test', 'tank');
</script>
```

## Basic Usage

```js
store(key, data);                 // Single storage string data
store({key: data, key2: data2});  // Bulk storage of multiple string data
store(key);              // Get `key` string data
store('?key');           // Determine if the `key` exists
store();                 // Get all key/data
//store(false);🔫        // (Deprecated) because it is easy to empty the storage because of a null value or an error
//store(key, false); 🔫  // (Deprecated)

store.set(key, data[, overwrite]);    // === store(key, data);
store.set({key: data, key2: data2})   // === store({key: data, key2: data});
store.get(key[, alt]);                // === store(key);
store.get('?key');                    // Determine if the `key` exists
store.get('key1', 'key2', 'key3');    // Get `key1`,`key2`,`key3` data
store.remove(key);                    // ===store(key,false)
store.clear();                        // Clean all key/data
store.keys();                         // Returns an array of all the keys
store.forEach(callback);              // Loop traversal, return false to end traversal
store.search(string);                 // Search method

store.has(key); //⇒ Determine if there is a return true/false

//⇒ Provide callback method to process data
store('test', (key,val) => {
  console.log(val) // Processing the data obtained through the test here
  return [3,4,5] // Return data and set store
})

store(['key', 'key2'], (key) => {
  // Get data processing of multiple keys, return and save;
  console.log('key:', key)
  return '逐个更改数据'
})
```

## API

### set

Store or delete string data individually `store.set(key, data[, overwrite]);`. Same effect `store(key, data);`.

```js
store.set('wcj', '1')   //⇒  1
store.set('wcj')        //⇒  Delete `wcj` and string data
```

### get
Get the string data of the `key` `store.get(key[, alt])`. Same effect `store(key)`.

```js
store.get('wcj1') // Get the string data of `wcj1`
store('wcj1')     // Same function as above
```

### setAll

Bulk storage of multiple string data `store.setAll(data[, overwrite])`. Same effect `store({key: data, key2: data});`.

```js
store.setAll({
  "wcj1": 123,
  "wcj2": 345
}) // Store two string data

store.setAll(["w1", "w2", "w3"]) 
// Store three strings of data
//  0⇒ "w1"
//  1⇒ "w2"
//  2⇒ "w3"
```

### ~~getAll~~ 🔫

Get all key/data ~~`store.getAll()`~~. Same effect `store()`.

```js
store.getAll() // ⇒ JSON
store() // Same function as above
```

### clear
Clear all key/data. `store.clear()`

⚠️ Deprecate ~~`store(false)`~~ because it is easy to empty the library because of passing in a null value or reporting an error

```js
store.clear()
```

### keys

Return an array of all `keys`. `store.keys()`.

```js
store.keys() //⇒ ["w1", "w2", "w3"]
```

### has

Judge whether it exists, return true/false `store.has(key)`.

```js
store.has('w1'); //⇒ true
```

### remove

Delete key string data including key `store.remove(key)`

```js
store.remove('w1');  // Delete w1 and return the value of w1
store('w1', false)   // So also delete w1
```

### forEach

Loop traversal, return `false` to end the traversal

```js
store.forEach((k, d) => {
  console.log(k, d);
  if (k== 3) return false
});
```

## Storage Event

Responding to storage changes with the [StorageEvent](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Responding_to_storage_changes_with_the_StorageEvent)

```js
if (window.addEventListener) {
  window.addEventListener('storage', handleStorage,false);
} else if (window.attachEvent){
  window.attachEvent('onstorage', handleStorage);
}
function handleStorage(e) {
  if(!e) { e=window.event; }
  //showStorage();
}
```

| Property | Type | Description |
| ----- | ----- | ----- |
| key | String | The named key that was added, removed, or moddified |
| oldValue | Any | The previous value(now overwritten), or null if a new item was added |
| newValue | Any | The new value, or null if an item was added |
| url/uri | String | The page that called the method that triggered this change |

## Chained Call

```js
store.set('ad', 234).get('ad')
```

## TODO

- [ ] `store.get([key,key2])` Get method, return json
- [ ] `store([key,key2])` Get method, return json
- [ ] `onStorage` Method test cases, and implementation

## Related

- [cookiejs](https://github.com/jaywcjlove/cookie.js) 🍪 A simple, lightweight JavaScript API for handling browser cookies , it is easy to pick up and use, has a reasonable footprint(~2kb, gzipped: 0.95kb), and has no dependencies. It should not interfere with any JavaScript libraries or frameworks.

### License

Licensed under the MIT License.
