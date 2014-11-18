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
store.keys();                     //返回所有key的数组
store.forEach(callback);          //循环遍历，返回false结束遍历

store.has(key);         //⇒判断是否存在返回true/false          
store.remove(key);      //⇒删除key包括key的字符串数据   
```


### set
单个存储或删除字符串数据<br/>
`store.set(key, data[, overwrite]); `<br/>
效果相同`store(key, data);`<br/>

```js
store.set("wcj","1")   //⇒  1
store.set("wcj")       //⇒  删除wcj及字符串数据
```

### setAll
批量存储多个字符串数据<br/>
`store.setAll(data[, overwrite]) `<br/>
效果相同`store({key: data, key2: data});`<br/>

```js
store.setAll({
    "wcj1":123,
    "wcj2":345
}) //存储两条字符串数据

store.setAll(["w1","w2","w3"]) 
//存储三条字符串数据 
//  0⇒ "w1"
//  1⇒ "w2"
//  2⇒ "w3"
```

### get
获取key的字符串数据<br/>
`store.get(key[, alt]) `<br/>
效果相同`store(key)`<br/>

```js
store.get("wcj1") //获取wcj1的字符串数据
store("wcj1") //功能同上
```

### getAll
获取所有key/data<br/>
`store.getAll()`<br/>
效果相同`store()`<br/>

```js
store.getAll() //⇒JSON
store() //功能同上
```

### clear
清空所有key/data<br/>
`store.clear()`<br/>
效果相同`store(false)`<br/>

```js
store.clear() //
store(false)  //功能同上
```

### keys
返回所有key的数组<br/>
`store.clear()`<br/>

```js
store.keys() //⇒["w1", "w2", "w3"]
```

### has
判断是否存在返回true/false<br/>
`store.has(key)`<br/>

```js
store.has("w1"); //⇒true
```

### remove
删除key包括key的字符串数据<br/>
`store.remove(key)`<br/> 

```js
store.has("w1"); //删除w1

store.set("w1") //这样也是 删除w1
```

### forEach
循环遍历，返回false结束遍历

```js
store.forEach(function(k,d){
    console.log(k,d)
    if (k== 3) return false
})
```