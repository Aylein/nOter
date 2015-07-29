(function(){
	var Defaults = function(){
		this.id = "";
		this.sign = "ao";
		this.width = 0;
		this.height = 0;
		this.images = []; //[{url: "", title: ""}]
		this.type = "view"; //view touch
		this.speed = 4000;
		this.shiftspeed = 600;
		this.asborn = 10;
		this.shift = "left-right"; //left-right top-bottom
		this.position = "right-bottom"; //right-bottom left-bottom right-top left-top top bottom
		this.click = "click";
	};
	var nourl = "javascript:void(0);", cache = {signs: {}};
	var extend = function(src, target){
		for(var i in target)
			if(i in src) src[i] = target[i];
		return src;
	};
	var ntring = function(str, callback){
		return callback(parseInt(str)).toString();
	};
	var clearNode = function(node){
		while(node.lastChild) node.removeChild(node.lastChild);
	};
	var getSign = function(){
		var sign = Math.ceil(Math.random() * 100000000000).toString();
		if(cache.signs[sign] || cache[sign]) return getSign();
		return sign;
	};
	var make = {
		event: function(node, name, event){
			if(node.addEventListener)
				node.addEventListener(name, event, false);
			else if(node.attachEvent)
				node.attachEvent("on" + name, event);
			else
				node["on" + name] = event;
		},
		makeImage: function(opt, width, height, speed){
			var d = document.createElement("DIV");
			d.style.cssText = "width:" + width + "px;height:" + height + "px;position:absolute;"
				+ "left:" + width + "px;top:0;background-color:#0000ff;";
			var a = document.createElement("A");
			a.target = "_blank";
			a.href = nourl;
			a.title = opt.title;
			var img = document.createElement("IMG");
			img.style.cssText = "width:100%;height:100%;";
			img.src = opt.src;
			a.appendChild(img)
			d.appendChild(a);
			if(speed) make.addTransition(d, speed);
			return d;
		},
		makeA: function(width, speed){
			var a = document.createElement("A");
			a.style.cssText = "dispaly:inline-block;height:" + width + "px;width:" + width + "px;"
				+ "margin-right:5px;float:left;background-color:#ffffff;";
			a.href = nourl;
			if(speed) make.addTransition(a, speed);
			return a;
		},
		style: function(node, key, value){
			if(key in node.style)
				node.style[key] = value;
		},
		//terrible bug this can not work it will never stop
		stop: function(node){
			make.style(node, "left", node.style.left);
		},
		positionTo: function(node, index, width, cha){
			cha = cha || 0;
			make.style(node, "left", width * index + cha + "px");
		},
		clearTransition: function(node){
			make.style(node, "-webkit-transition", "none");
			make.style(node, "-moz-transition", "none");
			make.style(node, "-o-transition", "none");
			make.style(node, "-ms-transition", "none");
			make.style(node, "transition", "none");
		},
		addTransition: function(node, speed){
			speed = (speed || ".6s").toString();
			speed = speed.charAt(speed.length - 1) == "s" ? speed : speed + "s";
			make.style(node, "-webkit-transition", speed);
			make.style(node, "-moz-transition", speed);
			make.style(node, "-o-transition", speed);
			make.style(node, "-ms-transition", speed);
			make.style(node, "transition", speed);
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
		opt = extend(new Defaults(), opt);
		if(!opt.width || !opt.height){
			var f = domain.parentNode;
			opt.width = opt.width ? opt.width : f.clientWidth;
			opt.height = opt.height ? opt.height : f.clientHeight;
		}
		//domain
		var domain = document.getElementById(opt.id);
		if(!domain) throw new Error("no element selected");
		domain.style.cssText = "width:" + opt.width + "px;height: " + opt.height + "px;"
			+ "position:relative;overflow:hidden;";
		//images
		var imglist = domain.getElementsByTagName("IMG"), _imglist = [];
		for(var i = 0, z = imglist.length; i < z; i++)
			_imglist.push({
				url: imglist[i].getAttribute("url") ? imglist[i].getAttribute("url") : nourl,
				title: imglist[i].getAttribute("title") ? imglist[i].getAttribute("title") : "",
				src: imglist[i].getAttribute("src") ? imglist[i].getAttribute("src") : ""
			});
		for(var i = 0, z = opt.images.length; i < z; i++)
			_imglist.push({
				url: nourl, //opt.images[i].url ? opt.images[i].url : nourl,
				title: opt.images[i].title ? opt.images[i].title : "",
				src: opt.images[i].src ? opt.images[i].src : ""
			});
		opt.images = _imglist;
		//asborn
		var asborn = document.createElement("div");
		asborn.style.cssText = "display:block;position:absolute;overflow:hidden;";
		return new fn.init(domain, asborn, opt);
	};
	var fn = ef.fn = ef.prototype = {
		init: function(domain, asborn, opt){
			//this
			this.domain = domain;
			this.asborn = asborn;
			this.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
			this.length = opt.images.length;
			this.doms = {};
			this.turning = {ing: false, x: 0, _x: 0, len: 0, step: 0, begin: undefined, end: undefined, target: undefined};
			this.opt = opt;
			this.left = (document.body.clientWidth - this.opt.width) / 2;
			this.click = typeof opt.click == "function";
			var _a = document.createElement("A");
			_a.target = "_blank";
			this._a = _a;
			var _this = this;
			//serilaze nodes
			for(var i = 1, z = this.length; i <= z; i++)
				this.doms[i.toString()] = {
					sign: i,
					url: opt.images[i - 1].url,
					title: opt.images[i - 1].title,
					src: opt.images[i - 1].src,
					clone: false,
					img: make.makeImage(opt.images[i - 1], opt.width, opt.height),
					a: make.makeA(this.opt.asborn, this.opt.shiftspeed / 1000)
				};
			if(this.length == 2){
				for(z += this.length; i <= z; i++)
					this.doms[i.toString()] = {
						sign: i,
						url: opt.images[i - this.length - 1].url,
						title: opt.images[i - this.length - 1].title,
						src: opt.images[i - this.length - 1].src,
						clone: true,
						img: make.makeImage(opt.images[i - this.length - 1], opt.width, opt.height),
						a: this.doms[(i - this.length).toString()].a
					};
				this.length = 4;
			}
			//clear domain
			clearNode(domain);
			//append dom and event
			make.event(this.domain, "mouseenter", function(){
				_this.clearCTM();
			});
			make.event(this.domain, "mouseleave", function(){
				_this.ctm = setTimeout(function(){
					_this.beginCTM();
				}, _this.opt.speed);
			});
			for(var i in this.doms){
				if(i == 0) this.makeCur(i);
				(function(){
					var o = _this.doms[i];
					_this.domain.appendChild(o.img);
					if(!o.clone){
						_this.asborn.appendChild(o.a);
						make.event(o.a, "click", function(){
							_this.turnTo(o);
						});
					}
					make.event(o.img, "click", function(){
						if(_this.click)
							_this.opt.click(_this.cur.sign, _this.doms);
						else if(o.url != nourl){
							_this._a.href = o.url;
							_this._a.click();
						}
					});
					if(_this.touch){
						make.event(o.img, "touchstart", function(){
							event = event || window.event;
							event.preventDefault();
							_this.turning.x = event.touches[0].clientX
							_this.clearCTM();
							_this.dragToing(o);
						});
						make.event(o.img, "touchmove", function(){
							event = event || window.event;
							event.preventDefault();
							var x = event.touches[0].clientX, _x = x - _this.turning.x;
							if(x >= _this.left && x <= _this.opt.width + _this.left){
								_this.turning.x = x;
								_this.turning._x += _x;
								_this.dragTo(_x);
							}
						});
						make.event(o.img, "touchcancel", function(){
							var res = true;
							if(_this.turning._x > 35){
								_this.turning.begin = _this.next(_this.cur);
								_this.turning.len = 3;
								_this.turning.step = -1;
								_this.turning.move = this.opt.width * -1;
								_this.turning.beginPo = 1;
								_this.turning.end = this.turning.target = _this.pref(_this.cur);
								_this.turnToPref(true);
							}
							else if(_this.turning._x < -35){
								_this.turning.begin = _this.pref(_this.cur);
								_this.turning.len = 3;
								_this.turning.step = 1;
								_this.turning.move = this.opt.width * 1;
								_this.turning.beginPo = -1;
								_this.turning.end = this.turning.target = _this.next(_this.cur);
								_this.turnToNext(true);
							}
							else if(_this.turning._x == 0){
								console.log(_this.click);
								if(_this.click)
									res = _this.opt.click(_this.cur.sign, _this.doms);
								else if(o.url != nourl){
									_this._a.href = o.url;
									_this._a.click();
								}
							}
							else _this.review();
							_this.turning.x = _this.turning._x = 0;
							if(res !== false) _this.ctm = setTimeout(function(){
								_this.beginCTM();
							}, _this.opt.speed);
						});
						make.event(o.img, "touchend", function(){
							var res = true;
							if(_this.turning._x > 35){
								_this.turning.begin = _this.next(_this.cur);
								_this.turning.len = 3;
								_this.turning.step = -1;
								_this.turning.move = _this.opt.width * -1;
								_this.turning.beginPo = 1;
								_this.turning.end = _this.turning.target = _this.pref(_this.cur);
								_this.turnToPref(true);
							}
							else if(_this.turning._x < -35){
								_this.turning.begin = _this.pref(_this.cur);
								_this.turning.len = 3;
								_this.turning.step = 1;
								_this.turning.move = _this.opt.width * 1;
								_this.turning.beginPo = -1;
								_this.turning.end = _this.turning.target = _this.next(_this.cur);
								_this.turnToNext(true);
							}
							else if(_this.turning._x == 0){
								if(_this.click)
									res = _this.opt.click(_this.cur.sign, _this.doms);
								else if(o.url != nourl){
									_this._a.href = o.url;
									_this._a.click();
								}
							}
							else _this.review();
							_this.turning.x = _this.turning._x = 0;
							if(res !== false) _this.ctm = setTimeout(function(){
								_this.beginCTM();
							}, _this.opt.speed);
						});
					}
				})();
			}
			domain.appendChild(asborn);
			//asborn position
			switch(opt.position){
				case "top": 
					asborn.style.top = "10px";
					asborn.style.left = (this.opt.width - asborn.clientWidth) / 2 + "px";
					break;
				case "bottom":
					asborn.style.bottom = "10px";
					asborn.style.left = (this.opt.width - asborn.clientWidth) / 2 + "px";
					break;
				case "left-top":
					asborn.style.top = "10px";
					asborn.style.left = "10px";
					break;
				case "right-top":
					asborn.style.top = "10px";
					asborn.style.right = "5px";
					break;
				case "left-bottom":
					asborn.style.bottom = "10px";
					asborn.style.left = "10px";
					break;
				case "right-bottom":
					asborn.style.bottom = "10px";
					asborn.style.right = "5px";
					break;
				case "none":
					asborn.style.display = "none";
					break;
			}
			//show first
			var m = this.first();
			this.turning.target = m;
			this.makeCur(m);
			this.curA(m);
			this.show(m);
			this.ctm = setTimeout(function(){
				_this.beginCTM();
			}, this.opt.speed);
		},
		beginCTM: function(){
			this.turnToNext();
			var _this = this;
			this.ctm = setTimeout(function(){
				_this.beginCTM();
			}, this.opt.speed);
		},
		clearCTM: function(){
			clearTimeout(this.ctm);
		},
		first: function(){
			return this.get(1);
		},
		last: function(){
			return this.get(this.length);
		},
		all: function(){
			return this.doms;
		},
		get: function(sign){
			sign = sign || false;
			if(!sign) return undefined;
			if(sign.sign) return sign;
			return this.doms[sign.toString()];
		},
		pref: function(sign){
			sign = this.get(sign);
			if(!sign) sign = this.cur;
			sign = sign.sign > 1 ? sign.sign - 1 : this.length;
			return this.doms[sign];
		},
		next: function(sign){
			sign = this.get(sign);
			if(!sign) sign = this.cur;
			sign = sign.sign < this.length ? sign.sign + 1 : 1;
			return this.doms[sign];
		},
		style: function(sign, key, value, name, deep){
			name = name || "img";
			deep = deep || false;
			sign = this.get(sign);
			if(sign) make.style(sign[name], key, value);
			else if(!deep)
				for(var i in this.doms)
					make.style(this.doms[i][name], key, value);
		},
		/*
		stop: function(){
			if(!this.turning.ing) return;
			var t = (new Date().getTime() - this.turning.beginTime) / this.opt.shiftspeed;
			if(t > 1) return;
			this.clearTransition(true);
			var f = this.turning.begin, po = this.turning.beginPo, 
				mo = this.turning.step > 0 ? "next" : "pref",
				end = this.turning.step > 0 ? 
					this.next(this.turning.end) : this.pref(this.turning.end);
			do{
				make.positionTo(f.img, po - this.turning.step * t, this.opt.width);
				f = this[mo](f);
				po = this.turning.step > 0 ? po + 1 : po - 1;
			}while(f.sign != end.sign);
		},
		*/
		clearTransition: function(){
			var f = arguments[0];
			if(f == undefined || f == false)
				for(var i in this.doms)
					make.clearTransition(this.doms[i].img);
			else if(typeof f != "boolean"){
				f = this.get(f);
				make.clearTransition(f.img);
			}
			else if(f && this.turning.ing){
				var mo = this.turning.step > 0 ? "next" : "pref";
				f = this.turning.begin;
				do{
					make.clearTransition(f.img);
					f = this[mo](f);
				}while(f.sign != this.turning.end.sign);
			}
		},
		addTransition: function(sign, name, deep){
			var f = arguments[0];
			if(f == undefined || f == false)
				for(var i in this.doms)
					make.addTransition(this.doms[i].img, this.opt.shiftspeed / 1000);
			else if(typeof f != "boolean"){
				f = this.get(f);
				make.addTransition(f.img, this.opt.shiftspeed / 1000);
			}
			else if(f && this.turning.ing){
				var mo = this.turning.step > 0 ? "next" : "pref";
				f = this.turning.begin;
				do{
					make.addTransition(f.img, this.opt.shiftspeed / 1000);
					f = this[mo](f);
				}while(f.sign != this.turning.end.sign);
			}
		},
		show: function(sign){
			sign = this.get(sign);
			if(sign) make.show(sign.img);
			else 
				for(var i in this.doms)
					make.show(this.doms[i].img);
		},
		hide: function(sign){
			sign = this.get(sign);
			if(sign) make.hide(sign.img);
			else for(var i in this.doms)
					make.hide(this.doms[i].img);
		},
		curA: function(sign){
			sign = this.get(sign);
			if(!sign) sign = this.cur;
			make.style(sign.a, "width", this.opt.asborn * 2 + "px");
		},
		clearCurA: function(sign){
			sign = this.get(sign);
			if(sign) make.style(sign.a, "width", this.opt.asborn + "px");
			else for(var i in this.doms)
				make.style(this.doms[i].a, "width", this.opt.asborn + "px");
		},
		makeCur: function(sign){
			this.cur = this.get(sign);
			if(this.cur == undefined) throw new Error("no cur : " + sign);
			this.turning.ing = false;
		},
		positionTo: function(sign){
			//make step
			sign = sign || false;
			if(!sign) return;
			sign = typeof sign == "string" ? sign : sign.sign;
			var cur = this.cur.sign;
			var cha = sign - cur, step, len = this.length;
			if(cha == 0) return;
			else if(cha > 0 && cha <= len / 2) step = cha;
			else if(Math.abs(cha) > len / 2){
				if(cha > 0) step = cha - len;
				else step = cha + len;
			}
			else step = cha;
			//if(!this.turning.ing){
				this.turning.begin = step > 0 ? this.pref() : this.next();
				this.turning.len = Math.abs(step) + 2;
				this.turning.step = step;
				this.turning.move = this.opt.width * step;
				this.turning.beginPo = step > 0 ? -1 : 1;
				this.turning.end = this.turning.target = this.get(sign);
				var mo = step > 0 ? "next" : "pref", end = this[mo](this.turning.end), f = this.turning.begin, 
					po = this.turning.beginPo;
				do{
					make.positionTo(f.img, po, this.opt.width);
					f = this[mo](f);
					po = this.turning.step > 0 ? po + 1 : po - 1;
				}while(f.sign != end.sign);
			/*
			}
			else{
				var t = (new Date().getTime() - this.turning.beginTime) / this.opt.shiftspeed,
					_step = this.turning.step * t, wc = 0;
				if(this.turning.step > 0 && cha || this.turning.step < 0 && !cha){
					//if(cha && step > this.turning.step) 
					//else if(!cha && step < this.turning.step)
				}
				else{
					//if(cha && step < this.turning.step) 
					//else if(!cha && step < this.turning.step)
				}
			}
			*/
		},
		dragToing: function(sign){
			sign = this.get(sign);
			if(!sign) return;
			this.clearTransition();
			this.makeCur(sign);
			this.positionTo(this.next());
			this.turning.target = sign;
		},
		dragTo: function(px){
			var cur = this.cur, left, p = this.pref(cur), n = this.next(cur);
			left = parseInt(p.img.style.left.replace("px", ""));
			make.style(p.img, "left", left + px + "px");
			left = parseInt(cur.img.style.left.replace("px", ""));
			make.style(cur.img, "left", left + px + "px");
			left = parseInt(n.img.style.left.replace("px", ""));
			make.style(n.img, "left", left + px + "px");
		},
		review: function(){
			var cur = this.cur, left, p = this.pref(cur), n = this.next(cur);
			this.addTransition(p);
			make.style(p.img, "left", -this.opt.width + "px");
			this.addTransition(cur);
			make.style(cur.img, "left", 0);
			this.addTransition(n);
			make.style(n.img, "left", this.opt.width + "px");
		},
		turnToing: function(){
			var _this = this;
			if(_this.turning.begin == undefined || _this.turning.end == undefined) return;
			setTimeout(function(){
				_this.turning.ing = true;
				//_this.turning.beginTime = new Date().getTime();
				var f = _this.turning.begin, po = _this.turning.beginPo, 
					mo = _this.turning.step > 0 ? "next" : "pref",
					end = _this.turning.step > 0 ? 
						_this.next(_this.turning.end) : _this.pref(_this.turning.end);
				do{
					_this.addTransition(f);
					wc = parseInt(f.img.style.left.replace("px", ""));
					make.positionTo(f.img, po - _this.turning.step, _this.opt.width);
					f = _this[mo](f);
					po = _this.turning.step > 0 ? po + 1 : po - 1;
				}while(f.sign != end.sign);
				_this.clearCurA();
				_this.curA(_this.turning.target);
			}, 10);
		},
		turnTo: function(sign, deep){
			deep = deep || false;
			if(!deep){
				this.clearTransition();
				this.positionTo(sign);
			}
			this.makeCur(this.turning.target);
			this.turnToing();
		},
		turnToPref: function(deep){
			deep = deep || false;
			if(!deep){
				this.clearTransition();
				this.positionTo(this.pref());
			}
			this.makeCur(this.turning.target);
			this.turnToing();
		},
		turnToNext: function(deep){
			deep = deep || false;
			if(!deep){
				this.clearTransition();
				this.positionTo(this.next());
			}
			this.makeCur(this.turning.target);
			this.turnToing();
		}
	};
	fn.init.prototype = fn;
})();