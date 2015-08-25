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
    //tags
    var tags = ("a abbr acronym address applet area article aside audio b base basefont bdi bdo " +
        "big blockquote body br button canvas caption center cite code col colgroup command datalist " +
        "dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font fomain form frame " +
        "frameset h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark " +
        "menu menuitem meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp " +
        "rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td " +
        "textarea tfoot th thead time title tr track tt u ul var video wbr").split(" ");
    var attrs = ("class id name style type rows cols width height require checked selected readonly contenteditable " + 
        "placehoder").split(" ");
    var eventType = ("click dblclick mousedown mouseup mouseover mouseout mousemove ouseenter mouseleave keypress keydown keyup" +
        "blur focus change reset submit touchstart touchmove touchend touchcancel").split(" ");
    
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
            _node: /^NodeList|HTMLCollection|HTMLAllCollection$/, //["HTMLCollection", "HTMLAllCollection"],
            _document: /^HTMLDocument$/, //["HTMLDocument"],
            _element: /^HTML\S+Element$/, //["HTMLImageElement", "HTMLDivElement"],
            _domtoken: /^DOMTokenList$/,
            _function: /^[f|F]unction$/, //["function", "Function"],
            _number: /^[n|N]umber$/, //["number", "Number"],
            _string: /^[s|S]tring$/, //["string", "String"],
            _boolen: /^[b|B]oolean$/, //["boolean", "Boolean"]
        }
    };
    oter.trim = function(str){ return str == null ? "" : (str + "").replace(rtrim, ""); }; //from jquery
    oter.replace= function(src, target, rep){
        if(src == undefined || target == undefined || rep == undefined) return src;
        return src.toString().replace(new RegExp(target, "g"), rep.toString());
    };
    oter._value = function(obj){
        var type = oter.typeof(obj);
        if(oter.regex.types._string.test(type) || oter.regex.types._number.test(type) || oter.regex.types._boolen.test(type))
            return obj.valueOf();
        return obj;
    };
    oter.charcut = function(val, len){
        var l = 0, z = "";
        for (var i = 0; i < val.length; i++){
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
    };
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
        if(type == "Array" || oter.regex.types._node.test(type)) return true;
        return type == "Object" && array.splice != undefined && array.length > -1;
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
    oter.map = function(){ //arguments bool src function args
        var list = [];
        var len = arguments.length;
        if(len == 0) return list;
        var i = 0, f = arguments[i++];
        if(!oter.regex.types._boolen.test(oter.typeof(f))){
            i--;
            f = false;
        }
        var src = arguments[i++], callback = arguments[i++], args = arguments[i++];
        if(!oter.regex.types._function.test(oter.typeof(callback))) return list;
        var type = oter.typeof(src);
        if(oter.isArrayLike(src)){
            for(var i = 0, z = src.length; i < z; i++){
                var _this = src[i], _args = oter.merge(true, [], args);
                _args.push(i, _this);
                var res = callback.apply(_this, _args);
                if(res) list.push(oter._value(f ? oter.copy(res) : res));
                //if(callback.apply(_this, _args)) list.push(f ? oter.copy(_this) : _this);
            }
        }
        else if(oter.regex.types._object.test(type)){
            list = {};
            var i = 0;
            for(var key in src){
                var _this = src[key], _args = oter.merge(true, [], args);
                _args.push(i, key, _this);
                var res = callback.apply(_this, _args);
                if(res) list.push(oter._value(f ? oter.copy(res) : res));
                //if(callback.apply(_this, _args)) list[key] = f ? oter.copy(_this) : _this;
                i++;
            }
        }
        else {
            var _args = oter.merge(true, [], args);
            var res = callback.apply(_this, _args);
            if(res) list = src;
            //if(callback.apply(src, _args)) list = src;
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
                var type = oter.typeof(this);
                return oter.regex.types._element.test(type) || oter.regex.types._document.test(type) ? this : false; 
            });
            return oter.merge(this, select);
        }
        else if(oter.regex.types._object.test(type) && oter.constructor == select.constructor){
            return oter.merge(this, select);
        }
        else if(oter.regex.types._element.test(type) || oter.regex.types._document.test(type)){
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
                list.push(oter.Element(no.tag, {text: no.text}));
                var ar = no.attr.match(oter.regex.selector._attrs);
                if(ar != undefined && ar.length > 0){
                    for(var i = 0, z = ar.length; i < z; i++)
                    {
                        if(ar[i].indexOf("=") > -1)
                            oter.attr(list[0], ar[i].split("=")[0], ar[i].split("=")[1].replace(/"/g, ""));
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
    //dom action
    oter.extend({
        clear: function(elem){
            while(elem.lastChild) elem.removeChild(elem.lastChild);
        },
        append: function(elem, _elem, deep){
            deep = deep || false;
            elem.appendChild(deep ? _elem.cloneNode(1) : _elem);
        },
        on: function(event, elem, callback, bs){
            if(arguments.length < 3) return elem;
            var type = oter.typeof(elem);
            if((!oter.regex.types._element.test(type) && !oter.regex.types._document.test(type)) || 
                eventType.indexOf(event) < 0 || !oter.regex.types._function.test(oter.typeof(callback))) return;
            bs = bs || false;
            if(elem.addEventListener)
                elem.addEventListener(event, callback, bs);
            else if(elem.attachEvent)
                elem.attachEvent("on" + event, callback);
            else elem["on" + event] = callback;
        },
        html: function(elem, html){
            var type = oter.typeof(elem), _this = this;
            if(!oter.regex.types._element.test(type)) return;
            if(html != undefined){
                this.clear(elem);
                type = oter.typeof(html);
                if(oter.regex.types._element.test(type))
                    if(elem.innerHTML != undefined) elem.innerHTML = html.toString();
                else if(oter.isArrayLike(html)){
                    oter.each(html, function(){
                        if(oter.regex.types._element.test(oter.typeof(this)))
                            _this.append(elem, this);
                    });
                }
                else if(oter.regex.types._string.test(type))
                    elem.innerHTML = html;
            }
            else return elem.innerHTML != undefined ? elem.innerHTML.toString() : "";
        },
        text: function(elem, text){
            elem = elem || {};
            var bo = text == undefined;
            var fun = elem.innerText != undefined ? "innerText" : undefined;
            fun = fun == undefined && elem.textContent ? "textContent" : fun;
            return fun != undefined ? (bo ? elem[fun] : elem[fun] = text.toString()) : undefined;
        },
        attr: function(elem, key, value){
            elem = elem || {};
            if(key == undefined || !elem.getAttribute) return;
            if(value == undefined)
                return elem.getAttribute(key.toString());
            else oter.regex.types._boolen.test(oter.typeof(value)) ?
                (value ? elem.setAttribute(key.toString(), key.toString()) : elem.removeAttribute(key)) :
                elem.setAttribute(key.toString(), value.toString());
        },
        class: function(elem, clsName){
            if(!clsName) return;
            if(elem.classList){
                elem.classList.toggle(clsName);
                return;
            }
            if(elem.className.indexOf(clsName) < 0) elem.className += " " + clsName;
            else elem.className = elem.className.replace(clsName, "");
        },
        addClass: function(elem, clsName){
            if(!clsName) return;
            if(elem.classList && !elem.classList.contains(clsName)){
                elem.classList.add(clsName);
                return;
            }
            if(elem.className.indexOf(clsName) < 0) elem.className += " " + clsName;
        },
        removeClass: function(elem, clsName){
            if(!clsName) return;
            if(elem.classList && elem.classList.contains(clsName)){
                elem.classList.remove(clsName);
                return;
            }
            if(elem.className.indexOf(clsName) > 0) 
                elem.className = elem.className.replace(clsName, "");
        },
        classExsits: function(elem, clsName){
            if(!clsName) return false;
            return elem.className.indexOf(clsName) > -1;
        },
        style: function(elem, key, value){
            if(value) elem.style[key] = value;
            else return elem.style[key];
        },
        styleText: function(elem, value){
            elem.style.cssText = value.toString();
        },
        Element: function(tag, opt){
            tag = tag || undefined, opt = opt || undefined;
            var element;
            if(tags.indexOf(tag) > -1) element = document.createElement(tag);
            else if(oter.regex.selector._tag.test(tag)){
                var no = {
                    tag: RegExp.$1,
                    attr: RegExp.$2,
                    text: RegExp.$3
                };
                element = oter.Element(no.tag, {text: no.text});
                var ar = no.attr.match(oter.regex.selector._attrs);
                if(ar != undefined && ar.length > 0){
                    for(var i = 0, z = ar.length; i < z; i++)
                    {
                        if(ar[i].indexOf("=") > -1)
                            oter.attr(element, ar[i].split("=")[0], ar[i].split("=")[1].replace(/"/g, ""));
                        else oter.attr(element, ar[i], true);
                    }
                }
            }
            if(element != undefined && oter.regex.types._object.test(oter.typeof(opt))){
                for(var name in opt) {
                    if(opt[name] != undefined) {
                        if(name == "text") oter.text(element, opt.text);
                        else oter.attr(element, name, opt[name]);
                    }
                }
            }
            return element;
        }
    });
    oter.fn.extend({
        each: function(callback, args){
            oter.each(this, callback, args);
            return this;
        },
        clear: function(){ 
            this.each(function(){ 
                oter.clear(this); 
            }); 
            return this;
        },
        append: function(elem){
            this.each(function(){ 
                oter.append(this, elem); 
            }); 
            return this;
        },
        on: function(_event, selector, callback, bs){
            var type = oter.typeof(selector), bo = false;
            bs = bs || false;
            if(!oter.regex.types._function.test(type)){
                bo = true;
                selector = oter(selector);
            }
            else{
                bs = callback ? callback : bs;
                callback = selector;
                selector = this;
            }
            if(bo)
                this.each(function(){
                    oter.on(_event, this, function(event){
                        event = event || window.event;
                        var target = event.target || event.srcElement;
                        if(selector.indexOf(target) > -1) callback.call(target);
                    }, bs);
                });
            else
                this.each(function(){
                    oter.on(_event, this, callback, bs);
                });
            return this;
        }
    });
    //出让 $ Oter oter 对象
    oter.doller = function(){
        if (_$) window.$ = _$;
        if (_oter) window.oter = _oter;
        if (_Oter) window.Oter = _Oter;
        return this;
    };
})(window);