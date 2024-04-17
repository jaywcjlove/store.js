/**
 * @jest-environment jsdom
 */
import store from '../main.js';

test('Set localstorage', () => {
  expect(store()).toEqual({})
  expect(store('name1', 'value1')).toEqual({})
  expect(store('name1')).toEqual('value1')
  expect(store.set('name3', 'value3')).toEqual(store);
  expect(store('name3')).toEqual('value3')
});

test('Delete multiple localstorage', () => {
  store({ 'name2': 'value2', 'name3': 'value3' })
  expect(store('name2')).toEqual('value2')
  expect(store('name3')).toEqual('value3')
  store.set({ 'name4': 'value4', 'name5': 'value5' })
  expect(store('name4')).toEqual('value4')
  expect(store('name5')).toEqual('value5')
});

test('Determine if the `key` exists', () => {
  expect(store('?name1')).toBeTruthy()
  expect(store('?name2')).toBeTruthy()
  expect(store('?name3')).toBeTruthy()
  expect(store('?name7')).toBeFalsy()
  expect(store.has('name1')).toBeTruthy()
  expect(store.has('name2')).toBeTruthy()
  expect(store.has('name3')).toBeTruthy()
  expect(store.has('name7')).toBeFalsy()
  expect(store.get('?name1')).toBeTruthy()
  expect(store.get('?name7')).toBeFalsy()
});

test('Delete one localstorage', () => {
  expect(store.remove('name1')).toEqual('value1');
  expect(store('name1')).toBeUndefined();
  expect(store('name2', false)).toEqual('value2');
  expect(store('name2')).toBeUndefined();
  expect(store('name3', undefined)).toEqual('value3');
  expect(store('name3')).toBeUndefined();
  expect(store('name4', null)).toEqual('value4');
  expect(store('name4')).toBeUndefined();
});

test('Clean all localstorage', () => {
  store({ 'name4': 'value4' });
  expect(store.get('name5')).toEqual('value5');
  expect(store.clear()).toEqual(store);
  expect(store('?name5')).toBeFalsy()
  expect(store('?name4')).toBeFalsy()
  store({ 'name4': 'value4', 'name5': 'value5'  });
  // Deprecated
  store(false)
  expect(store('?name5')).toBeTruthy()
  expect(store('name5')).toEqual('value5')
  expect(store('?name4')).toBeTruthy()
  expect(store('name4')).toEqual('value4')
});

test('Get all the keys of localstorage', () => {
  store.keys().length
  expect(store.keys()).toEqual(['name4', 'name5']);
  expect(store.keys().length).toEqual(2);
});

test('Test localstorage forEach', () => {
  store.forEach((item, val) => {
    expect(store.has(item)).toBeTruthy();
  });
  expect(store()).toEqual({ "name4": "value4", "name5": "value5" });

  store({ 'forEach': 'forEachvalue1' })
  expect(store('forEach', (key) => {
    expect(key).toEqual('forEach');
    return '111';
  })).toEqual(store);
  expect(store()).toEqual({ "forEach": "111", "name4": "value4", "name5": "value5" });
  expect(store.remove('forEach')).toEqual('111');
});

test('Get localstorage', () => {
  store.set('namef', false);
  store.set('namenull', null);
  expect(store('name4')).toEqual('value4');
  expect(store.get('namef')).toEqual(false);
  expect(store.get('name4')).toEqual('value4');
  expect(store.get()).toEqual({
    'name4': 'value4',
    'name5': 'value5',
    'namef': false,
    'namenull': null,
    'nameundefined': undefined
  });
  expect(store.get('name4', 'nameeee', 'namef', 'namenull', 'nameundefined')).toEqual({
    "name4": 'value4',
    'namef': false,
    'namenull': null,
    'nameundefined': undefined
  });
  expect(store.get('name4', 'name5')).toEqual({ "name4": 'value4', "name5": "value5" });
  expect(store.get('nameeee11', 'nameeee222')).toEqual({});
  expect(store.get('name4322323')).toBeUndefined();

  store.remove('namef');
  store.remove('namenull');
  store.remove('nameundefined');
});

test('Get all localstorage', () => {
  expect(store()).toEqual({ 'name4': 'value4', 'name5': 'value5' });
  expect(store.get()).toEqual({ 'name4': 'value4', 'name5': 'value5' });
});

test('Chained function call test', () => {
  expect(store.set('ad', 234).get('ad')).toEqual(234);
  expect(store('ad', 234)).toEqual(store);
  expect(store('ad')).toEqual(234);
  expect(store.forEach((item) => {
    expect(store.has(item)).toBeTruthy();
  }).get('ad')).toEqual(234);

  expect(store.forEach((item) => {
    expect(store.has(item)).toBeTruthy();
  }).set('ad', 2344).get('ad')).toEqual(2344);
  expect(store.set('ad', 234).clear()).toEqual(store);
});

test('Set multiple localstorage', () => {
  store.set(['name6', 'name7'])
  expect(store.get()).toEqual({ "name6,name7": "undefined" });
  expect(store.set({ 'name6': 123 })).toEqual(store);
  expect(store.get()).toEqual({ "name6,name7": "undefined", name6: 123 });
});

test('Test store.search', () => {
  expect(store.search('name6')).toEqual({ "name6,name7": "undefined", name6: 123 });
  expect(store.search('name6,name7')).toEqual({ "name6,name7": "undefined" });
});

test('Test Change localstorage', () => {
  expect(store(["name6", "name6,name7"], (key, val) => {
    // 获取多个key的数据处理，return 并保存；
    if (key && key == 'name6,name7') return "keytest";
    return val
  })).toEqual(store);
  expect(store.get()).toEqual({ "name6": 123, "name6,name7": "keytest" });
  expect(store('test', (key, val) => {
    return [3, 4, 5]
  })).toEqual(store);
  expect(store.get()).toEqual({ "name6": 123, "name6,name7": "keytest", "test": [3, 4, 5] });
});

test('Get store length', () => {
  store.clear()
  store.set('name6', 'value6')
  store.set('name7', 'value7')
  expect(store.len()).toEqual(2);
  store.clear()
  expect(store.len()).toEqual(0);
});
