(function(){
	var Defaults = function(){

	};
	var nourl = "javascript:void(0);", cache = {signs: {}};
	var extend = function(src, target){
		for(var i in target)
			if(i in src) src[i] = target[i];
		return src;
	};
	var getSign = function(){
		var sign = Math.ceil(Math.random() * 100000000000).toString();
		if(cache.signs[sign] || cache[sign]) return getSign();
		return sign;
	};
	var make = {
		clearNode: function(node){
			while(node.lastChild) node.removeChild(node.lastChild);
		},
		event: function(node, name, event){
			if(node.addEventListener)
				node.addEventListener(name, event, false);
			else if(node.attachEvent)
				node.attachEvent("on" + name, event);
			else
				node["on" + name] = event;
		},
		style: function(node, key, value){
			if(key in node.style)
				node.style[key] = value;
		},
		show: function(node){
			make.style(node, "left", 0);
		},
		hide: function(node){
			var h = node.clientWidth + "px";
			make.style(node, "left", h);
		}
	};
	var ef = window.EF = function(opt){
	};
	var fn = ef.fn = ef.prototype = {
		init: function(domain, asborn, opt){
		}
	};
	fn.init.prototype = fn;
})();