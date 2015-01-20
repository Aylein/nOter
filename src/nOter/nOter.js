!function(){
    //private
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
    //var undefined = "undefined";
    //oter
    oter = window.oter = window.Oter = window.$ = function(select) {
        return new oter.fn.init(select);
    };
    //object
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
        splice: arr.splice
    };
    //static
    oter.types = {
        _undefined: /^(undefined|Undefined|null)$/, //["undefined", "Undefined", "null"],
        _object: /^[o|O]bject$/, //["object", "Object"],
        _array: /^Array$/, //["Array"],
        _window: /^Window$/,
        _document: /^HTML(Collection|AllCollection|Document)$/, //["HTMLCollection", "HTMLAllCollection", "HTMLDocument"],
        _element: /^HTML\S+Element$/, //["HTMLImageElement", "HTMLDivElement"],
        _function: /^[f|F]unction$/, //["function", "Function"],
        _number: /^[n|N]unction$/, //["number", "Number"],
        _string: /^[s|S]tring$/, //["string", "String"],
        _boolen: /^[b|B]oolean$/, //["boolean", "Boolean"]
    };
    oter.tags = ("a abbr acronym address applet area article aside audio b base basefont bdi bdo " +
        "big blockquote body br button canvas caption center cite code col colgroup command datalist " + 
        "dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame " + 
        "frameset h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark " + 
        "menu menuitem meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp " + 
        "rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td " + 
        "textarea tfoot th thead time title tr track tt u ul var video wbr").split(" ");
    oter.attrs = ("class id name style type rows cols width height ").split(" ");
    oter.isArrayLike = function(array){
        var type = oter.typeof(array, 1);
        if(type == "undefined") return false;
        if(type == "Array" || oter.types._document.test(type)) return true;
        return type == "Object" && array.splice != undefined && array.length >= 0;
    };
    oter.typeof = function(obj, deep){
        if(obj == undefined) return "undefined";
        return deep && re_typeof.test(toString.call(obj)) ? RegExp.$1 : typeof obj;
    };
    oter.isTypeof = function(type, obj, deep){
        return type == oter.typeof(obj, deep);
    };
    oter.merge = function(src, target){
        if(src == undefined) src = [];
        if(target == undefined) return;
        if(oter.isArrayLike(src) && oter.isArrayLike(target)){
            if(src.push) for(var i = 0, z = target.length; i < z; i++) src.push(target[i]);
            else for(var i = 0, z = target.length; i < z; i++) arr.push.call(src, target[i]);
        }
        return src;
    };
    oter.extend = oter.fn.extend = function(){
        var len = arguments.length;
        if(len == 0) return;
        var i = 0, f = arguments[i], src, target;
        if(oter.types._boolen.test(oter.typeof(f))) src = arguments[++i];
        else src = f;
        if(len == i + 1){
            target = src;
            src = this;
        }
        else target = arguments[++i];
        do{
            if(oter.isArrayLike(src) && oter.isArrayLike(target))
                src = oter.merge(src, target);
            else if((oter.typeof(src, 1) == "Object" || oter.typeof(src, 1) == "Function") && 
                oter.typeof(target, 1) == "Object"){
                for(var name in target){
                    if(src[name] != undefined && oter.typeof(src[name], 1) == "Object") 
                        src[name] = oter.extend(src[name], target[name]);
                    else src[name] = target[name];
                }
            }
            target = arguments[++i];
        } while(i < len);
        return src;
    };
    //出让 $ Oter oter 对象
    oter.doler = function() {
        if (_$) window.$ = _$;
        if (_oter) window.oter = _oter;
        if (_Oter) window.Oter = _Oter;
        return this;
    };
    //selector
    var selectionOption = {

    };
    var selection = function(select){

    };
    //init
    var init = oter.fn.init = function(select){
        this.selector = select;
        var type = oter.typeof(this.selector, 1);
        if(type == "undefined") {
            return this;
        }
        else if(oter.isArrayLike(select)){
            select = oter.map(select, function(){ 
                return oter.types._element.test(oter.typeof(this, 1)); 
            });
            return oter.merge(this, select);
        }
        else if(oter.types._object.test(type) && oter.constructor == select.constructor){
            return oter.merge(this, select);
        }
        else if(oter.types._element.test(type)){
            var _list = [];
            return _list.push(select), oter.merge(this, _list);
        }
        else if(oter.types._string.test(type)){
            return oter.merge(this, selection(select));
        }
        else{
            return this;
        }
    };
    init.prototype = oter.fn;
    oter.fn.extend({
        eq: function(index){ return this.constructor(oter.eq(this, index)); },
        get: function(index){ return oter.eq(this, index); },
        first: function(){ return this.get(0); },
        last: function(){ return this.length > 0 ? this.get(this.length - 1) : undefined; },
        text: function(text){
            text = text || undefined;
            if(text){
                oter.each(this, function(text){
                    if(this.innerText != undefined) this.innerText = text.toString();
                    else if(this.textContent != undefined) this.textContent = text;
                }, text);
                return this;
            }
            else{
                text = "";
                oter.each(this, function(){
                    if(this.innerText != undefined) text += this.innerText;
                    else if(this.textContent != undefined) text += this.textContent;
                });
                return text;
            }
        },
        html: function(html){
            html = html || undefined;
            if(html){
                var type = oter.typeof(html, 1);
                if(oter.types._string.test(type)){
                    oter.each(this, function(html){
                        if(this.innerHTML != undefined) this.innerHTML = html.toString();
                    }, html);
                    return this;
                }
                else if((oter.types._object.test(type) && oter.constructor == html.constructor) || 
                    oter.types_element.test(type)){
                    return this.append(html);
                }
            }
            else{
                html = "";
                oter.each(this, function(){
                    if(this.innerHTML != undefined) html += this.innerHTML;
                });
                return html;
            }
        },
        attr: function(){
            var len = arguments.length, i = 0, text;
            var deep = arguments[i++], key = arguments[i++], value;
            if(!oter.types._boolen.test(oter.typeof(deep, 1))){
                key = deep;
                deep = false;
                i--;
            }
            if(len > i) value = arguments[i];
            if(key == undefined) return false;
            console.log(deep, key, value);
            if(value != undefined){
                oter.each(this, function(key, value){
                    oter.attr(this, key, value);
                }, {key: key, value: value});
                return this;
            }
            else {
                value = "";
                var i = 0;
                if(deep){
                    oter.each(this, function(key){
                        var text = oter.attr(this, key);
                        if(text === false || text == null) i++;
                        else value += text + ";";
                    }, {key: key});
                    if(value == "" && i == this.length) return undefined;
                    else return value.length > 0 ? value.substr(0, value.length - 1) : value;
                }
                else {
                    value = oter.attr(this.first(), key);
                    if(value === false || value == null) return undefined;
                    else return value.length > 0 ? value.substr(0, value.length - 1) : value;
                }
            }
        },
        append: function(dom){
            var type = oter.typeof(dom, 1);
            if(type == "undefined") return this;
            else if((oter.types._object.test(type) && this.constructor == dom.constructor)|| 
                oter.types._document.test(type)){
                oter.each(this, function(dom){
                    for(var i = 0, z = dom.length; i < z; i++)
                        if(this.appendChild != undefined) this.appendChild(dom[i].cloneNode(1));
                }, dom);
                return this;
            }
            else if(oter.types._element.test(type)){
                oter.each(this, function(dom){
                    if(this.appendChild != undefined) this.appendChild(dom.cloneNode(1));
                }, dom);
                return this;
            }
            else if(oter.types._string.test(type)){

            }
            else return this;
        },
        each: function (callback, args) {
            return oter.each(this, callback, args);
        }
    });
    oter.extend({
        isArray: arr.isArray,
        trim: function(text){    
            return text == null ? "" : (text + "").replace(rtrim, "");
        },
        regex: {
            selector: {
                _tag: /^(\S+)$/,
                _id: /^#(\S+)$/,
                _class: /^.(\S+)$/,
                _type: /\(([\S\s]+)\)/,
                _attr: /^\[([\S\s]+)\]$/,
                _attrs: /([a-z\.\-_"'\d]+=[a-z\.\:-_#"'\d\(\)]+)/g
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
            }
        },
        makeArray: function(obj){
            var type = oter.typeof(obj, 1), _list = [];
            if(type == "undefined") return _list;
            else if(oter.isArrayLike(obj))
                return oter.merge(_list, obj);
            else if(oter.types._object.test(type)){
                for(var name in obj) if(obj[name] != undefined) _list.push(obj[name]);
                return _list;
            }
            else return _list.push(obj), _list;
        },
        makeElement: function(tag, opt){
            tag = tag || undefined, opt = opt || undefined;
            var element;
            if(oter.tags.indexOf(tag) > -1) element = document.createElement(tag);
            if(element != undefined && oter.types._object.test(oter.typeof(opt, 1))){
                for(var name in opt) {
                    if(opt[name] != undefined) {
                        if(name != "text") element.setAttribute(name, opt[name]);
                        else {
                            if(element.innerText != undefined) element.innerText = opt[name].toString();
                            else if(element.textContent != undefined) element.textContent = opt[name];
                        }
                    }
                }
            }
            return element;
        },
        each: function(list, callback, args){
            var type = oter.typeof(list, 1);
            if(type == "undefined" || typeof callback != "function") return list;
            args = oter.makeArray(args);
            if(oter.isArrayLike(list))
                for(var i = 0, z = list.length; i < z; i++) 
                    if(callback.apply(list[i], args) == false) break;
            return list;
        },
        map: function(list, callback, args){
            var _list = [];
            var type = oter.typeof(list, 1);
            if(type == "undefined" || typeof callback != "function") return _list;
            args = oter.makeArray(args);
            if(oter.isArrayLike(list))
                for(var i = 0, z = list.length; i < z; i++) 
                    if(callback.apply(list[i], args)) 
                        _list.push(list[i]);
            return _list;
        },
        attr: function(elem, key, value){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || key == undefined) return false;
            if(value == undefined) return elem.getAttribute(key.toString());
            else elem.setAttribute(key.toString(), value.toString());
        },
        eq: function(list, index){
            var type = oter.typeof(list, 1);
            if(type == "undefined") return undefined;
            else if(oter.isArrayLike(list)) return list[index];
            else if(oter.types._object.test(type)) {
                var i = 0;
                for(var name in list) if(i++ == index) return list[name];
                return undefined;
            }
            else return list;
        }
    });
}(window);