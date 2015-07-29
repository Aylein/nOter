(function(){
    //privates
    //保存 window.$ 的值
    var _$ = window.$ || undefined;
    //保存 window.oter 的值
    var _Oter = window.Oter || undefined;
    var _oter = window.oter || undefined;
    //Array
    var arr = [];
    //regex
    var re_typeof = /^\[object (\S+)\]$/;
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    //selector
    var selection = function(deep, select){
        if(arguments.length < 1) return list;
        else if(typeof deep != "boolean"){
            select = deep;
            deep = false;
        }
        if(select == undefined) return list;
        if(!deep && document.querySelectorAll) return document.querySelectorAll(select);
		return [];
    };
    
    //oter
    var oter = window.oter = window.Oter = window.$ = function(select) {
        return new oter.fn.init(select);
    };
    
    //static
    oter.regex = {
        selector: {
            _select: /()(:)\[()\]/g,
            _tag: /^<([a-z]+)([^<>]*)>([^<>]*)/,
            _id: /^#(\S+)$/,
            _class: /^.(\S+)$/,
            _type: /\(([\S\s]+)\)/,
            _attr: /^([\S]*)=([\S]*)|([\S]*)="([\S]*)"$/,
            _attrs: /([\S]*="[\s\S]*")|(\S)*[^\s]|([\S]*=[\s]*)[^\s]/g
        },
        navi: {
            isWinNT: /Windows NT (\d+.\d+)[\.\d+]*/,
            isMac: /Mac OS X (\S+)/,
            isLikeMac: /Mac OS X/,
            isIPhone: /iPhone OS (\S+)/,
            isIpad: /iPad; CPU OS (\S+)/,
            isGecko: /Gecko\/(\d+.\d+)[\.\d+]*/,
            isAWK: /AppleWebKit\/(\d+.\d+)[\.\d+]*/,
            isTrident: /Trident\/(\d+.\d+)[\.\d+]*/,
            isFireFox: /Firefox\/(\d+.\d+)[\.\d+]*/,
            isIE: /MSIE (\d+.\d+)[\.\d+]*/,
            isChrome: /Chrome\/(\d+.\d+)[\.\d+]*/,
            isSafari: /Safari\/(\d+.\d+)[\.\d+]*/,
            isOpera: /OPR\/(\d+.\d+)[\.\d+]*/
        },
        extra: {
            isNumber: /^\d+$/,
            isInt: /^[\-1-9][0-9]{0,11}$/,
            isFloat: /^[\-1-9][0-9]{0,11}(\.[0-9]{0,3}[1-9])?$/,
            isEmail: /^[\w\-_\.]+@[\w]+(\.[a-z\d]+)+$/,
            isMobile: /^[1][3|5|7|8][\d]{9}$/,
            isTelephone: /^(\d{3,4}[\-|\s])?\d{7,8}$/,
            isChinese: /^[\u4E00-\u9FA5]+$/,
            _byte: /[^\x00-\xff]/ig,
            blank: /\s+/
        },
        types: {
            _undefined: /^undefined|Undefined|null$/, //["undefined", "Undefined", "null"],
            _object: /^[o|O]bject$/, //["object", "Object"],
            _array: /^Array$/, //["Array"],
            _window: /^Window$/,
            _document: /^NodeList|HTMLCollection|HTMLAllCollection|HTMLDocument$/, //["HTMLCollection", "HTMLAllCollection", "HTMLDocument"],
            _element: /^HTML\S+Element$/, //["HTMLImageElement", "HTMLDivElement"],
            _domtoken: /^DOMTokenList$/,
            _function: /^[f|F]unction$/, //["function", "Function"],
            _number: /^[n|N]unction$/, //["number", "Number"],
            _string: /^[s|S]tring$/, //["string", "String"],
            _boolen: /^[b|B]oolean$/, //["boolean", "Boolean"]
        }
    };
    oter.trim = function(str){ return str == null ? "" : (str + "").replace(rtrim, ""); }; //from jquery
    oter.replace= function(src, target, rep){
        if(src == undefined || target == undefined || rep == undefined) return src;
        return src.toString().replace(new RegExp(target, "g"), rep.toString());
    };
    oter.charcut = function(val, len) {
        var l = 0, z = "";
        for (var i = 0; i < val.length; i++) {
            z += val[i];
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) l += 0.5;
            else l += 1;
            if (l >= len) {
                if (l < val.length) z += "...";
                break;
            }
        }
        return z;
    },
    oter.charLength = function(val){
        var l = 0;
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) l += 1;
            else l += 2;
        }
        return l;
    };
    oter.obj = function(obj, deep){
        deep = deep || false;
        var i = 0;
        for(var name in obj){
            i++;
            if(!deep) return true;
        }
        return !deep ? false : i;
    };
    oter.objc = function(obj, deep){
        deep = deep || false;
        var i = 0;
        for(var name in obj){
            var type = oter.typeof(obj[name]);
            if(oter.regex.types._object.test(type) || oter.regex.types._array.test(type)){
                i++;
                if(!deep) return true;
            }
        }
        return !deep ? false : i;
    };
    oter.isArrayLike = function(array){
        var type = oter.typeof(array);
        if(type == "undefined") return false;
        if(type == "Array" || oter.regex.types._document.test(type)) return true;
        return type == "Object" && array.splice != undefined && array.length >= 0;
    };
    oter.typeof = function(obj, deep){
        deep = deep || false;
        if(obj == undefined) return "undefined";
        return !deep && re_typeof.test(Object.prototype.toString.call(obj)) ? RegExp.$1 : typeof obj;
    };
    oter.isTypeof = function(type, obj, deep){
        return type == oter.typeof(obj, deep);
    };
    oter.extend = function(){
        var len = arguments.length;
        if(len == 0) return {};
        var i = 0, n = 0, f = arguments[i++], src, target, main = oter;
        if(oter.regex.types._boolen.test(oter.typeof(f))) src = arguments[i++];
        else {src = f; f = false;}

        if(len == 1){
            src = this;
            i--;
        }
        var type = oter.typeof(src), _type;
        if(src != oter && src != oter.fn){
            if(!oter.regex.types._object.test(type)) src = oter.extend({}, src);
            if(f && oter.obj(src)) src = oter.extend(true, {}, src);
            if(len <= i) return src ? src : {};
        }

        while(i < len){
            target = arguments[i++];
            if(!target) continue;
            _type = oter.typeof(target);
            if(oter.regex.types._object.test(_type)){
                oter.each(target, function(i, v, k){
                    src[k] = f ? main.copy(v) : v;
                });
            }
            else if(oter.isArrayLike(target)){
                oter.each(target, function(i, v){
                    src[n] = f ? main.copy(v) : v;
                    n++;
                });
            }
            else {
                src[n.toString()] = target;
                n++;
            }
        }
        return src;
    };
    oter.merge = function(){
        var len = arguments.length;
        if(len == 0) return [];
        var i = 0, f = arguments[i++], src, target, _this = oter;
        if(oter.regex.types._boolen.test(oter.typeof(f))) src = arguments[i++];
        else {src = f; f = false;}
        var type = oter.typeof(src), _type;
        //if(!oter.regex.types._array.test(type)) src = oter.merge([], src);
        if(!oter.isArrayLike(src)) src = oter.merge([], src);
        if(f && src.length > 1) src = oter.merge(true, [], src);
        if(len <= i) return src ? src : [];
        while(i < len){
            target = arguments[i++];
            if(!target) continue;
            if(oter.regex.types._object.test(_type) || oter.isArrayLike(target))
                oter.each(target, function(i, v){
                    src.push(f ? _this.copy(v) : v); 
                });
            else src.push(target);
        }
        return src;
    };
    oter.map = function(){
        var list = [];
        var len = arguments.length;
        if(len == 0) return list;
        var i = 0, f = arguments[i++];
        if(oter.regex.types._boolen.test(oter.typeof(f))) i--;
        else f = false;
        var src = arguments[i++], callback = arguments[i++], args = arguments[i++];
        if(!oter.regex.types._function.test(oter.typeof(callback))) return list;
        var type = oter.typeof(src);
        if(oter.isArrayLike(src)){
            for(var i = 0, z = src.length; i < z; i++){
                var _this = src[i], _args = oter.merge(true, [], args);
                _args.push(i, _this);
                if(callback.apply(_this, _args)) list.push(f ? oter.copy(_this) : _this);
            }
        }
        else if(oter.regex.types._object.test(type)){
            list = {};
            var i = 0;
            for(var key in src){
                var _this = src[key], _args = oter.merge(true, [], args);
                _args.push(i, key, _this);
                if(callback.apply(_this, _args)) list[key] = f ? oter.copy(_this) : _this;
                i++;
            }
        }
        else {
            var _args = oter.merge(true, [], args);
            if(callback.apply(src, _args)) list = src;
        }
        return list;
    };
    oter.copy = function(target){
        if(!target) return undefined;
        var type = oter.typeof(target);
        if(oter.isArrayLike(target)) return oter.merge(true, target);
        else if(oter.regex.types._object.test(type)) return oter.extend(true, target);
        else return target;
    };
    oter.each = function(src, callback, args){
        if(!oter.regex.types._function.test(oter.typeof(callback))) return src;
        var type = oter.typeof(src);
        if(oter.isArrayLike(src)){
            for(var i = 0, z = src.length; i < z; i++){
                var _this = src[i], _args = oter.merge(true, [], args);
                _args.push(i, _this);
                if(callback.apply(_this, _args)) break;
            }
        }
        else if(oter.regex.types._object.test(type)){
            var i = 0;
            for(var key in src){
                var _this = src[key], _args = oter.merge(true, [], args);
                _args.push(i, _this, key);
                if(callback.apply(_this, _args)) break;
                i++;
            }
        }
        else {
            var _args = oter.merge(true, [], args);
            callback.apply(src, _args);
        }
    };
    
    //prototype
    oter.fn = oter.prototype = {
        ver: "1.0",
        constructor: oter,
        length: this.length,
        sort: arr.sort,
        join: arr.join,
        push: arr.push,
        pop: arr.pop,
        shift: arr.shift,
        unshift: arr.unshift,
        indexOf: arr.indexOf,
        lastIndexOf: arr.lastIndexOf,
        splice: arr.splice,
        extend: oter.extend
    };

    //init
    var init = oter.fn.init = function(select){
        var type = oter.typeof(select);
        if(type == "undefined") {
            return this;
        }
        else if(oter.isArrayLike(select)){
            select = oter.map(select, function(){ 
                return oter.regex.types._element.test(oter.typeof(this, 1)); 
            });
            return oter.merge(this, select);
        }
        else if(oter.regex.types._object.test(type) && oter.constructor == select.constructor){
            return oter.merge(this, select);
        }
        else if(oter.regex.types._element.test(type)){
            var _list = [];
            return _list.push(select), oter.merge(this, _list);
        }
        else if(oter.regex.types._string.test(type)){
            if(oter.regex.selector._tag.test(select)){
                var no = {
                    tag: RegExp.$1,
                    attr: RegExp.$2,
                    text: RegExp.$3
                }, list = [];
                list.push(oter.makeElement(no.tag, {text: no.text}));
                var ar = no.attr.match(oter.regex.selector._attrs);
                if(ar != undefined && ar.length > 0){
                    for(var i = 0, z = ar.length; i < z; i++)
                    {
                        if(ar[i].indexOf("=") > -1){
                            oter.attr(list[0], ar[i].split("=")[0], ar[i].split("=")[1].replace(/"/g, ""));
                        }
                        else
                            oter.attr(list[0], ar[i], true);
                    }
                }
                return oter.merge(this, list);
            }
            else return oter.merge(this, selection(select));
        }
        else{
            return this;
        }
    };
    init.prototype = oter.fn;
    //出让 $ Oter oter 对象
    oter.doller = function(){
        if (_$) window.$ = _$;
        if (_oter) window.oter = _oter;
        if (_Oter) window.Oter = _Oter;
        return this;
    };
})(window);