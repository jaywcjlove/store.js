/**
 * Copyright © kacper.wang 
 * http://jaywcjlove.github.io
 * 小弟来自【热璞科技】
 */
;(function(window){
	var storage = window['localStorage'],
	Store = {
		storageAPI:{
			set: function(key, val){
				if (val === undefined) { return this.remove(key) }
				storage.setItem(key, Store.stringify(val))
				return val
			},
			setAll: function(data){
	            var changed, val;
	            for (var key in data) {
	                val = data[key];
	                if (this.set(key, val) !== val) {
	                    changed = true;
	                }
	            }
	            return changed;
			},
			get: function(key, val){
				return Store.deserialize(storage.getItem(key)) 
			},
			getAll: function(){
				var ret = {}
				this.forEach(function(key, val) {
					ret[key] = val;
				})
				return ret
			},
			clear: function(key, val){return storage.clear()},
			remove: function(key) {storage.removeItem(key) },
			has:function(key){return storage.hasOwnProperty(key)},
			keys:function(){
				var d=[]
				this.forEach(function(k, list){
					d.push(k);
				});
				return d
			},
			size: function(){ return this.keys().length;},
			forEach: function(callback) {
				for (var i=0; i<storage.length; i++) {
					var key = storage.key(i);
					if(callback(key, this.get(key))==false) break;
				}
			}
		},
		deserialize: function(value) {
			if (typeof value != 'string') { return undefined }
			try { return JSON.parse(value) }
			catch(e) { return value || undefined }
		},
		stringify: function(val) {
            return val === undefined || typeof val === "function" ? val+'' : JSON.stringify(val);
		}
	},
	store=function (key, data){
		var argm = arguments,
		storet = function(){
			if (argm.length === 0){ return store.getAll(); }
            if (data !== undefined){ return store.set(key, data); }
            if (typeof key === "string"){ return store.get(key); }
            if (!key){ return store.clear(); }
            return store.setAll(key, data);
		};
		return storet(key, data);
	};
	//IE不提供这个__proto__原型对象，可以这里判断
	store.__proto__ = Store.storageAPI;
	//如果有 JSLite ，则同样扩展到 JSLite ?类似jQuery
	// http://jaywcjlove.github.io/JSLite/
	if( window.JSLite ) window.JSLite.store = store;
	else window.store = store
})(window);