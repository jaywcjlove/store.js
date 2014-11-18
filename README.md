## 本地存储APIs
```js
store(key, data);                 //单个存储字符串数据
store({key: data, key2: data2});  //批量存储多个字符串数据
store(key);                       //获取key的字符串数据
store();                          //获取所有key/data
store(false);                     //清空所有key/data

store.set(key, data[, overwrite]);//=== store(key, data);
store.setAll(data[, overwrite]);  //=== store({key: data, key2: data});
store.get(key[, alt]);            //=== store(key);
store.getAll();                   //=== store();
store.clear();                    //=== store(false);
store.forEach(callback);             //循环遍历，返回false结束遍历
store.keys();                     //返回所有key的数组

store.has(key);         //⇒判断是否存在返回true/false          
store.remove(key);      //⇒删除key包括key的字符串数据   
```


### set
单个存储或删除字符串数据<br/>
`store.set(key, data[, overwrite]); `<br/>
`//=== store(key, data);`<br/>

```js
store.set("wcj","1")   //⇒  1
store.set("wcj")       //⇒  删除wcj及字符串数据
```

### forEach
循环遍历，返回false结束遍历

```js
store.forEach(function(k,d){
    console.log(k,d)
    if (k== 3) return false
})
```