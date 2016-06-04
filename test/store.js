var tape = require('tape');
require('tape-chai');

if (typeof(window)==='object') {
    var tape_dom = require('tape-dom');
    var store = require('../dist/store.js');
    tape_dom.installCSS();
    tape_dom.stream(tape);

    tape('  localstorage 单元测试', function (t) {

        t.isFunction(store.clear(),"测试清空方法：store.clear()")
        t.isFalse(store.has("key"),'判断key不存在返回值：store.has("key")')
        t.deepEqual(store(),{},"测试存储方法：store()")
        t.isUndefined(store("key1"),'测试数据为空取值返回为空：store("String")')
        t.isObject(store({
            "key1":"val1", 
            "key2":"val2", 
            "key3":"val3"
        }),'测试批量存储方法：store({"key2":"val2", "key3":"val3"})')

        t.deepEqual(store('key3'),'val3',"测试单个取值方法：store('val3')")
        t.deepEqual(store("key1",false),'val1',"测试单个值data=false删除方法：store('key1',false)")
        t.deepEqual(store("key2",undefined),'val2',"测试单个值data=undefined删除方法：store('key2',undefined)")
        t.deepEqual(store("key3",null),'val3',"测试单个取值方法：store('key3',null)");
        t.isObject(store("key1","val1"),'存储数据方法：store("key1","val1")');
        

        t.isFunction(store.set({
            "key":"val1",
            "key2":"val2",
        }),'批量储存方法：store.set({"key":"val1", "key2":"val2"})'); 
        t.isTrue(store.has("key"),'判断key存在返回值：store.has("key")')
        t.isFunction(store.set("key","121"),'存储存String值方法：store.set("key","121")');
        t.isFunction(store.set("key1",{"a":1}),'存储存JSON值方法：store.set("key",{"a":1})');
        t.deepEqual(store.get("key1"),{a:1},'存储取值方法：store.get("key")');
        t.deepEqual(store.keys(),["key","key1","key2"],'返回所有key的数组方法：store.keys()');
        t.isFunction(store.forEach(function(key,val){
            t.isString(key,'forEach方法测试：store.forEach()');
        }),"forEach方法测试");

        t.isFunction(store("key",function(key,arr){
            t.deepEqual(arr,'121','Callback方法处理数据:store("key",function(arr){return data; })');
            return [3,4,5];
        }),'store(key,function)测试')
        t.deepEqual(store.get("key"),[3,4,5],'测试store(key,function)回调存储是否成功！');

        t.isFunction(store(["key","key2"],function(key,val){
            //获取多个key的数据处理，return 并保存；
            if(key&&key == 'key') return "keytest";
            return "逐个更改数据"
        }),'store([Arary],function)测试');
        t.deepEqual(store.get("key"),"keytest",'测试store(Array,function)存储key是否成功！');
        t.deepEqual(store.get("key2"),"逐个更改数据",'测试store(Array,function)存储key2是否成功！');
        t.deepEqual(store.set('ad',234).get('ad'),234,'链式调用测试');
        t.deepEqual(store.search('key'),{"key":"keytest","key1":{"a":1},"key2":"逐个更改数据"},'搜索方法测试');
    
    });

}