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
    };
    oter.tags = ("a abbr acronym address applet area article aside audio b base basefont bdi bdo " +
        "big blockquote body br button canvas caption center cite code col colgroup command datalist " + 
        "dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame " + 
        "frameset h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark " + 
        "menu menuitem meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp " + 
        "rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td " + 
        "textarea tfoot th thead time title tr track tt u ul var video wbr").split(" ");
    oter.attrs = ("class id name style type rows cols width height").split(" ");
    oter.eventType = ("click dblclick mousedown mouseup mouseover mouseout mousemove keypress keydown keyup" +
        "blur focus change reset submit").split(" ");
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
    var selection = function(deep, select){
        var type = oter.typeof(deep, 1);
        var list = [];
        if(type == "undefined") return list;
        else if(!oter.types._boolen.test(type)){
            select = deep;
            deep = false;
        }
        if(select == undefined) return list;
        if(!deep && document.querySelectorAll) return document.querySelectorAll(select);
        var reg_name = "a-zA-Z0-9\\-_";
        var reg_select = "([" + reg_name + "]*)([.#]?[" + reg_name + "]+)";
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
            else oter.merge(this, selection(select));
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
        clear: function(){ return oter.each(this, function(){ oter.clear(this); }), this; },
        addClass: function(className){
            var type = oter.typeof(className, 1);
            if(oter.types._array.test(type))
                oter.each(this, function(className){
                    for(var i = 0, z = className.length; i < z; i++)
                        if(className[i] != undefined)
                            oter.addClass(this, className[i].toString());
                }, {name: className});
            else 
                oter.each(this, function(className){
                    oter.addClass(this, className);
                }, {name: className.toString()});
            return this;
        },
        removeClass: function(className){
            oter.each(this, function(className){
                oter.removeClass(this, className);
            }, {name: className});
            return this;
        },
        text: function(){
            var len = arguments.length, i = 0;
            var deep = arguments[i++], text = arguments[i++];
            if(!oter.types._boolen.test(oter.typeof(deep, 1))){
                text = deep;
                deep = false;
            }
            if(text != undefined){
                oter.each(this, function(text){
                    oter.text(this, text);
                }, {text: text});
                return this;
            }
            else{
                if(deep){
                    var i = 0, text = [];
                    oter.each(this, function(){
                        var val = oter.text(this);
                        if(val === false || val == null) i++;
                        else text.push(val);
                    });
                    if(text.length == 0 && i == this.length) return undefined;
                }
                else {
                    text = oter.text(this.first());
                    if(text === false || text == null) return undefined;
                }
                return text;
            }
        },
        html: function(){
            var len = arguments.length, i = 0;
            var deep = arguments[i++], html = arguments[i++];
            if(!oter.types._boolen.test(oter.typeof(deep, 1))){
                html = deep;
                deep = false;
            }
            if(html != undefined){
                oter.each(this, function(html){
                    oter.html(this, html);
                }, {html: html});
                return this;
            }
            else{
                if(deep){
                    var i = 0, html = [];
                    oter.each(this, function(){
                        var val = oter.html(this);
                        if(val === false || val == null) i++;
                        else html.push(val);
                    });
                    if(html.length == 0 && i == this.length) return undefined;
                }
                else {
                    html = oter.html(this.first());
                    if(html === false || html == null) return undefined;
                }
                return html;
            }
        },
        style: function(styleName, style){
            oter.each(this, function(){
                oter.style(this, styleName, style);
            }, {styleName: styleName, style: style});
            return this;
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
            if(value != undefined){
                oter.each(this, function(key, value){
                    oter.attr(this, key, value);
                }, {key: key, value: value});
                return this;
            }
            else {
                if(deep){
                    var i = 0, value = [];
                    oter.each(this, function(key){
                        var text = oter.attr(this, key);
                        if(text === false || text == null) i++;
                        else vals.push(text);
                    }, {key: key});
                    if(value.length == 0 && i == this.length) return undefined;
                }
                else {
                    value = oter.attr(this.first(), key);
                    if(value === false || value == null) return undefined;
                }
                return value;
            }
        },
        append: function(dom){
            var type = oter.typeof(dom, 1);
            if(type == "undefined") return this;
            else if((oter.types._object.test(type) && this.constructor == dom.constructor)|| 
                oter.types._document.test(type)){
                var _list = [];
                _list.push(dom);
                return oter.each(this, function(dom){
                    for(var i = 0, z = dom.length; i < z; i++){
                        oter.append(this, dom[i]);
                    }
                }, _list);
            }
            else if(oter.types._element.test(type)){
                oter.each(this, function(dom){
                    if(this.appendChild != undefined) this.appendChild(dom.cloneNode(1));
                }, dom);
                return this;
            }
            else if(oter.types._string.test(type) && oter.regex.selector._tag.test(dom)){
                var no = {
                    tag: RegExp.$1,
                    attr: RegExp.$2,
                    text: RegExp.$3
                }, _list = [], list = [];
                _list.push(oter.makeElement(no.tag, {text: no.text}));
                var ar = no.attr.match(oter.regex.selector._attrs);
                if(ar != undefined && ar.length > 0){
                    for(var i = 0, z = ar.length; i < z; i++)
                    {
                        if(ar[i].indexOf("=") > -1){
                            oter.attr(_list[0], ar[i].split("=")[0], ar[i].split("=")[1].replace(/"/g, ""));
                        }
                        else
                            oter.attr(_list[0], ar[i], true);
                    }
                }
                list.push(_list);
                return oter.each(this, function(dom){
                    for(var i = 0, z = dom.length; i < z; i++){
                        oter.append(this, dom[i]);
                    }
                }, list);
            }
            else return this;
        },
        each: function (callback, args) {
            return oter.each(this, callback, args);
        },
        addEvent: function(eventName, callback, bs){
            oter.each(this, function(eventName, callback, bs){
                oter.addEvent(this, eventName, callback, bs);
            }, {eventName: eventName, callback: callback, bs: bs});
            return this;
        },
        click: function(callback, bs){
            return this.addEvent("click", callback, bs);
        },
        dblClick: function(callback, bs){
            return this.addEvent("dblclick", callback, bs);
        },
    });
    oter.extend({
        isArray: arr.isArray,
        trim: function(text){    
            return text == null ? "" : (text + "").replace(rtrim, "");
        },
        replace: function(src, target, rep){
            if(src == undefined || target == undefined || rep == undefined) return src;
            return src.toString().replace(new RegExp(target, "g"), rep.toString());
        },
        regex: {
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
            else if(oter.regex.selector._tag.test(tag)){
                var no = {
                    tag: RegExp.$1,
                    attr: RegExp.$2,
                    text: RegExp.$3
                };
                element = oter.makeElement(no.tag, {text: no.text});
                var ar = no.attr.match(oter.regex.selector._attrs);
                if(ar != undefined && ar.length > 0){
                    for(var i = 0, z = ar.length; i < z; i++)
                    {
                        if(ar[i].indexOf("=") > -1){
                            oter.attr(element, ar[i].split("=")[0], ar[i].split("=")[1].replace(/"/g, ""));
                        }
                        else
                            oter.attr(element, ar[i], true);
                    }
                }
            }
            if(element != undefined && oter.types._object.test(oter.typeof(opt, 1))){
                for(var name in opt) {
                    if(opt[name] != undefined) {
                        if(name == "text") {
                            if(element.innerText != undefined) element.innerText = opt[name].toString();
                            else if(element.textContent != undefined) element.textContent = opt[name];
                        }
                        else element.setAttribute(name, opt[name]);
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
        clear: function(elem){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type)) return false;
            while(elem.lastChild) elem.removeChild(elem.lastChild);
            return elem;
        },
        hasClass: function(elem, className){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || className == undefined) return false;
            return elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        },
        addClass: function(elem, className){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || className == undefined) return false;
            if(elem.classList) elem.classList.add(className.toString());
            else if(!oter.hasClass(elem, className))
                elem.className += " " + className.toString();
            return elem;
        },
        removeClass: function(elem, className){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || className == undefined) return false;
            if(elem.classList)
                elem.classList.remove(className.toString());
            else{
                var reg = new RegExp('(\\s|^)' + elem.className + '(\\s|$)');
                elem.className = elem.className.replace(reg, "");
            } 
            return elem;
        },
        append: function(elem, _elem){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type)) return false;
            type = oter.typeof(_elem, 1);
            if(!oter.types._element.test(type)) return false;
            if(elem.appendChild == undefined) return false;
            elem.appendChild(_elem.cloneNode(1));
            return elem;
        },
        text: function(elem, text){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type)) return false;
            if(text != undefined){
                if(elem.innerText != undefined) elem.innerText = text.toString();
                else if(elem.textContent != undefined) elem.textContent = text.toString();
                else return false;
            }
            else{
                if(elem.innerText != undefined) return elem.innerText;
                else if(elem.textContent != undefined) return elem.textContent;
                else return false;
            }
        },
        html: function(elem, html){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type)) return false;
            if(html != undefined){
                oter.clear(elem);
                type = oter.typeof(html, 1);
                if(oter.types._element.test(type)) {
                    if(elem.innerHTML != undefined) elem.innerText = html.toString();
                    else return false;
                }
                else if(oter.isArrayLike(html)){
                    oter.each(html, function(){
                        if(oter.types._element.test(oter.typeof(this, 1))) 
                            elem.append(this);
                    });
                }
                else if(oter.types._string.test(type)){

                }
                else return false;
            }
            else{
                if(elem.innerHTML != undefined) return elem.innerText;
                else return false;
            }
        },
        style: function(elem, styleName, style){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || styleName == undefined) return false;
            if(style == undefined) return elem.style[styleName.toString()];
            else elem.style[styleName.toString()] = style.toString();
            return elem;
        },
        attr: function(elem, key, value){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || key == undefined) return false;
            if(value == undefined) return elem.getAttribute(key.toString());
            else oter.types._boolen.test(oter.typeof(value)) ? 
                (value ? elem.setAttribute(key.toString(), key.toString()) : oter.removeAttr(elem, key)) :
                elem.setAttribute(key.toString(), value.toString());
            return elem;
        },
        removeAttr: function(elem, key){
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || key == undefined) return false;
            elem.removeAttribute(key.toString());
            return elem;
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
        },
        addEvent: function(elem, eventName, callback, bs){
            if(arguments.length < 3) return false;
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || oter.eventType.indexOf(eventName) <= -1 || 
                typeof callback != "function") return false;
            bs = bs || false;
            if(elem.addEventListener) elem.addEventListener(eventName, callback, bs);
            else if(elem.attachEvent) elem.attachEvent("on" + eventName, callback);
            else return false;
            return elem;
        },
        degaEvent: function(elem, tag, eventName, callback, bs){
            if(arguments.length < 4) return false;
            var type = oter.typeof(elem, 1);
            if(!oter.types._element.test(type) || oter.eventType.indexOf(eventName) <= -1 || 
                typeof callback != "function") return false;
            bs = bs || false;
            !function(tag, eventName, callback){
                oter.addEvent(elem, eventName, function(){
                    var event = event || window.event;
                    var type = oter.typeof(tag, 1);
                    var tar = event.srcElement || event.target;
                    if(!oter.types._string.test(type) || tag.length < 1) return false;
                    if(oter.tags.indexOf(tag) > -1 && tar.tagName.toLowerCase() == tag) callback();
                    else if(oter.regex.selector._id.test(tag) && oter.attr(tar, "id") == tag.substr(1)) callback();
                    else if(oter.regex.selector._class.test(tag) && oter.hasClass(tar, tag.substr(1))) callback();
                    else return false;
                }, bs);
            }(tag, eventName, callback);
            return elem;
        },
        loadXml: function(xmlString){
            var xmlDoc=null;if(window.DOMParser && document.implementation && document.implementation.createDocument){
                domParser = new  DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            }
            else if(!window.DOMParser && window.ActiveXObject){
                if(arguments.callee.ver != undefined) { 
                    xmlDoc = new ActiveXObject(arguments.callee.ver);
                    xmlDoc.async = false;
                }
                else{
                    var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
                    for(var i=0;i<xmlDomVersions.length;i++){
                        xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                        arguments.callee.ver = xmlDomVersions[i];
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString); 
                        break;
                    }
                }
            }
            else{
                return null;
            }
            return xmlDoc;
        },
        parseJson: function(json){
            return eval("(" + json + ")");
        }
    });
    //browser
    var navi = function() {
        this.en = undefined;
        this.env = undefined;
        this.bs = undefined;
        this.bsv = undefined;
        this.os = undefined;
    };
    var browser = function() {
        var ua = window.navigator.userAgent;
        var na = new navi();
        if (window.opera) {
            na.bs = "Opera";
            na.bsv = window.opera.version();
        } else if (oter.regex.navi.isAWK.test(ua)) {
            na.en = "AppleWebKit";
            na.env = RegExp.$1;
            if (oter.regex.navi.isOpera.exec(ua)) {
                na.bs = "Opera";
                na.bsv = RegExp.$1;
            } else if (oter.regex.navi.isChrome.exec(ua)) {
                na.bs = "Chrome";
                na.bsv = RegExp.$1;
            } else if (oter.regex.navi.isSafari.exec(ua)) {
                na.bs = "Safari";
                na.bsv = RegExp.$1;
            }
        } else if (oter.regex.navi.isGecko.test(ua)) {
            na.en = "Gecko";
            na.env = RegExp.$1;
            if (oter.regex.navi.isFireFox.exec(ua)) {
                na.bs = "FireFox";
                na.bsv = RegExp.$1;
            }
        } else if (oter.regex.navi.isIE.test(ua)) {
            na.en = "MSIE";
            na.env = RegExp.$1;
            na.bs = "IE";
            na.bsv = RegExp.$1;
        } else if (oter.regex.navi.isTrident.test(ua)) {
            na.en = "Trident";
            na.env = RegExp.$1;
            na.bs = "IE"
            switch (na.env) {
                case "4.0":
                    na.bsv = "8.0";
                    break;
                case "5.0":
                    na.bsv = "9.0";
                    break;
                case "6.0":
                    na.bsv = "10.0";
                    break;
                case "7.0":
                    na.bsv = "11.0";
                    break;
                default:
                    break;
            }
        }
        if (oter.regex.navi.isWinNT.test(ua)) {
            switch (RegExp.$1) {
                case "5.0":
                    na.os = "Windows 2000";
                    break;
                case "5.1":
                    na.os = "Windows XP";
                    break;
                case "6.0":
                    na.os = "Windows Vista";
                    break;
                case "6.1":
                    na.os = "Windows 7";
                    break;
                case "6.2":
                    na.os = "Windows 8";
                    break;
                case "6.3":
                    na.os = "Windows 8.1";
                    break;
                default:
                    na.os = "Windows NT " + RegExp["$2"];
                    break;
            }
        } else if (oter.regex.navi.isLikeMac.test(ua)) {
            if (oter.regex.navi.isIPhone.test(ua)) {
                na.os = "IPhone OS " + RegExp.$1;
            }
            if (oter.regex.navi.isIpad.test(ua)) {
                na.os = "iPad CPU OS " + RegExp.$1;
            }
        } else if (oter.regex.navi.isMac.test(ua)) {
            if (oter.regex.navi.isIPhone.test(ua)) {
                na.os = "Mac OS X " + RegExp.$1;
            }
        }
        return na;
    };
    navi.prototype = {
        toString: function() {
            return "Rendering Engine : " + (this.en||"") + " " + (this.env||"") + ", Browser : " +  (this.bs||"") + " " + (this.bsv||"")  + ", Operating System : " + (this.os||"");
        }
    };
    var makeAllDoc = function(elem){
        var chi = elem.children, _list = [];
        if(chi && chi.length > 0){
            for(var i = 0, z = chi.length; i < z; i++){
                _list.push(chi[i]);
                oter.merge(_list, makeAllDoc(chi[i]));
            }
        }
        console.log(_list);
        return _list;
    };
    var ajaxDefault = function(){
        this.async = true;
        this.type = "get";
        this.url = " ";
        this.data = {};
        this.dataType = "text";
        this.jsonp = false;
        this.error = function(err){ throw new Error(err.msg); };
        this.success = function(data){};
    };
    var XHR = function(){
        if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
        else if(typeof ActiveXObject != "undefined"){
            if(arguments.callee.ver) return new ActiveXObject(arguments.callee.ver);
            else{
                var ver = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                for(var i = 0, z = ver.lenght; i < z; i++){
                    try{
                        new ActiveXObject(ver[i]);
                        arguments.callee.ver = ver[i];
                        break;
                    }
                    catch(e){
                        continue;
                    }
                }
            }
        }
        else return null;
    };
    var makeUrl = function(url, data){
        if(!data) return url;
        url += url.indexOf("?") > 0 ? "&" : "?";
        for(var key in data) 
            url += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
        if(url.length > 0) url = url.substr(0, url.length - 1);
        return url;
    };
    var formRealize = function(data){
        var va = "";
        for(var key in data) 
            va += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
        if(va.length > 0) va = va.substr(0, va.length - 1);
        return va;
    };;
    oter.extend({
        navi: browser(),
        allDoc: function(deep){
            deep = deep || false;
            var doc = document.all, _list = [];
            console.log(!deep && doc.length);
            if(!deep && doc.length){
                if(doc.length > 0)
                    for(var i = 0, z = doc.length; i < z; i++)
                        _list.push(doc[i]);
            }
            else _list = makeAllDoc(document);
            return _list;
        },
        jsonp: function(option){
            if(option.jsonp == undefined || option.jsonp === false) return oter.ajax(option);
            option = oter.extend(new ajaxDefault(), option);
            var scr = oter.makeElement("script");
            var url = makeUrl(option.url, option.data) + "&callback=" + encodeURIComponent(option.jsonp);
            window[option.jsonp] = option.success;
            oter.attr(scr, "src", url);
            document.head.appendChild(scr);
        },
        ajax: function(option){
            if(option.jsonp != undefined && option.jsonp !== false) return oter.jsonp(option);
            option = oter.extend(new ajaxDefault(), option);
            var xhr = XHR();
            if(xhr == undefined){
                throw new exception("no xhr build");
                return;
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304){
                        switch(option.dataType){
                            case "json":
                            case "Json":
                                option.success(oter.parseJson(xhr.responseText));
                                break;
                            case "xml":
                            case "XML":
                                option.success(oter.loadXml(xhr.responseText));
                                break;
                            default: 
                                option.success(xhr.responseText);
                                break;
                        }
                    }
                    else 
                        option.error({ err: xhr.status, msg: "something wrong" });
                }
            };
            if(xhr == null){
                option.error({ code: -1, msg: "no XHR" });
                return;
            }
            if(option.type == "get"){
                xhr.open(option.type, makeUrl(option.url, option.data), option.async);
                xhr.send();
            }
            else {
                xhr.open(option.type, option.url, option.async);
                xhr.setRequestHeader("Content-Type", "Application/x-www-form-urlencoded");
                xhr.send(formRealize(option.data));
            }
        }
    }); 
}(window);