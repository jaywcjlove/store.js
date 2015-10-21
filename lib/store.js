;(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.store = factory(root);
    }
}(this,function(root, undefined){
    if(!root.localStorage) return;
    var storage = root.localStorage,store,_api,even_storage=function(){};

    function isJSON(obj){
        return typeof(obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() && !obj.length;
    }
    function stringify (val) {
        return val === undefined || typeof val === "function" ? val+'' : JSON.stringify(val);
    }
    function deserialize(value){
        if (typeof value !== 'string') { return undefined ;}
        try { return JSON.parse(value) ;}
        catch(e) { return value || undefined ;}
    }
    function isFunction(value) { return ({}).toString.call(value) === "[object Function]";}
    function isString(obj){ return typeof obj === 'string';}
    function isArray(value) { return value instanceof Array;}
    _api = {
        set: function(key, val){
            if (val === undefined) { return this.remove(key) ;}
            storage.setItem(key, stringify(val));
            even_storage(key,val);
            return val;
        },
        setAll: function(data){
            var changed, val;
            for (var key in data) {
                val = data[key];
                if (this.set(key, val) !== val) {
                    changed = true;
                }
                even_storage(key,val);
            }
            return changed;
        },
        get: function(key){
            return deserialize(storage.getItem(key));
        },
        getAll: function(){
            var ret = {};
            this.forEach(function(key, val) {
                ret[key] = val;
            });
            return ret;
        },
        clear: function(){
            this.forEach(function(key, val) {
                even_storage(key,val);
            });
            return storage.clear();
        },
        remove: function(key) {
            var val = this.get(key);
            storage.removeItem(key);
            even_storage(key,val);
            return val;
        },
        has:function(key){return storage.hasOwnProperty(key);},
        keys:function(){
            var d=[];
            this.forEach(function(k, list){
                d.push(k);
            });
            return d;
        },
        size: function(){ return this.keys().length;},
        forEach: function(callback) {
            for (var i=0; i<storage.length; i++) {
                var key = storage.key(i);
                if(callback(key, this.get(key))===false) break;
            }
        },
        onStorage: function(cb){
            if(cb && isFunction(cb)) even_storage = cb;
        }
    };
    store=function (key, data){
        var argm = arguments,dt=null,
        _store = function(key, data){
            if (isFunction(data)){
                if(isString(key)){
                    dt = data(store.get(key)); 
                    return dt ? store.set(key, dt): undefined; 
                } 
                if(isArray(key)) for(var a in key){
                    dt = data(store.get(key[a])); 
                    if(dt) store.set(key[a], dt); 
                }
                return;
            }
            if (isJSON(key)) return store.setAll(key);
            if (argm.length === 0){ return store.getAll(); }
            if (data===false){ return store.remove(key); }
            if (data !== undefined){ return store.set(key, data); }
            if (key){ return store.get(key);}
            // if (!key){ return store.clear(); }
            return store.setAll(key, data);
        };
        return _store(key, data);
    };
    //IE不提供这个__proto__原型对象，可以这里判断
    // store.__proto__ = _api;
    for (var a in _api) store[a]=_api[a];
    return store;
}));
