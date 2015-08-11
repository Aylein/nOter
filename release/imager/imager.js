!function(){
    if(!window.Cache) window.Cache = {};
    var Default = function(id){
        this.id = id || "";
        this.list = [];
    };
    var extend = function(opt){
        var def = new Default();
        for(var i in opt)
            if(def[i] != undefined)
                def[i] = opt[i];
        return def;
    };
    var makeList = function(node, list){
        for(var i = 0, z = node.children.length; i < z; i++)
            if(node.children[i].nodeName == "IMG") list.push(node.children[i].src);
        return list;
    };
    var action = function(elem, event, callback){
        if(addEventListener) elem.addEventListener(event, callback, false);
        else if(attachEvent) elem.attachEvent("on" + event, callback);
    };
    var show = function(cur){
        cur = cur ? cur - 1 : undefined || window.Cache["to"].cur + 1;
        window.Cache["to"].imgList[window.Cache["to"].cur].style["z-index"] = 0;
        if(cur > window.Cache["to"].imgList.length - 1) cur = 0;
        window.Cache["to"].cur = cur;
        window.Cache["to"].imgList[window.Cache["to"].cur].style["z-index"] = 9;
    };
    var start = function(){
        var shift = function(){
            show();
            window.Cache["to"].to = setTimeout(shift, 5000);
        };
        window.Cache["to"].to = setTimeout(shift, 5000);
    };
    var stop = function(){
        clearTimeout(window.Cache["to"].to);
    };
    var showor = window.Showor = function(option){
        if(typeof option == "string")
            option = new Default(option);
        else option = extend(option);
        if(!option.id) return;
        this.id = option.id;
        this.n = document.getElementById(option.id);
        this.srclist = makeList(this.n, option.list);
        this.n.style["position"] = "relative";
        this.list = [];
        this.alist = [];
        this.clear().makeImg().makeA();
        if(!window.Cache["to"])
            window.Cache["to"] = {to: null, cur: 0, imgList: this.list};
        this.start();
    };
    showor.fn = showor.prototype = {
        clear: function(){
            while(this.n.lastChild)
                this.n.removeChild(this.n.lastChild);
            return this;
        },
        makeImg: function(){
            for(var i = 0, z = this.srclist.length; i < z; i++){
                var node = document.createElement("img");
                node.src = this.srclist[i];
                node.style["position"] = "absolute";
                if(i == 0) node.style["z-index"] = 9;
                else node.style["z-index"] = 0;
                this.list.push(node);
                this.n.appendChild(node);
            }
            return this;
        },
        makeA: function(){
            this.f = document.createElement("div");
            this.f.style.cssText = "position: absolute; z-index: 10; bottom: 5px;";
            for(var m = 0, z = this.list.length; z > m; z--){
                var img = this.list[z];
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.style.cssText = "display: inline-block; background-color: #ffffff; width: 15px; height: 15px; float: right; margin-left: 5px;";
                (function(z){
                    action(a, "mouseenter", function(){
                        clearTimeout(window.Cache["to"].to);
                        show(z);
                        console.log(z, window.Cache.to);
                    });
                })(z);
                action(a, "mouseout", function(){ start(); });
                this.alist.push(a);
                this.f.appendChild(a);
            }
            this.n.appendChild(this.f);
            return this;
        },
        start: function(){ start(); return this; },
        stop: function(){ stop(); return this; }
    };
}(window, document);