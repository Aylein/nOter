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
		makeImage: function(opt, width, height){
			var d = document.createElement("DIV");
			d.style.cssText = "width:" + width + "px;height:" + height + "px;position:absolute;"
				+ "left:" + width + "px;top:0;background-color:#0000ff;";
			var a = document.createElement("A");
			a.href = opt.url;
			a.target = opt.url == nourl ? "_self" : "_blank";
			a.title = opt.title;
			var img = document.createElement("IMG");
			img.style.cssText = "width:100%;height:100%;border:none;";
			img.src = opt.src;
			a.appendChild(img);
			d.appendChild(a);
			return d;
		},
		makeA: function(width){
			var a = document.createElement("A");
			a.style.cssText = "dispaly:inline-block;height:" + width + "px;width:" + width + "px;"
				+ "margin-right:5px;float:left;background-color:#ffffff;";
			a.href = nourl;
			return a;
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
			this.opt = opt;
			this.domain = domain;
			this.asborn = asborn;
			this.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
			this.length = opt.images.length;
			this.doms = {};
			this.turning = {ing: false, signs: {},  witdh: 0, step: 0, len: 0, z: this.opt.shiftspeed / 1000 * 60, az: Math.abs(this.opt.shiftspeed - 100) / 1000 * 60};
			this.turning.aeStep = Math.ceil(this.opt.asborn  / this.turning.az);
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
			make.clearNode(domain);
			make.event(domain, "mouseenter", function(){
				_this.clearTM();
			});
			make.event(domain, "mouseleave", function(){
				_this.tm = setTimeout(function(){
					_this.makeTM();
				}, _this.opt.speed);
			});
			//append dom and event
			for(var sign in this.doms){
				(function(){
					var o = _this.doms[sign];
					_this.domain.appendChild(o.img);
					if(!o.clone) _this.asborn.appendChild(o.a);
					make.event(o.a, "click", function(){
						_this.turnTo(o);
					});
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
			this.curTo = this.first();
			this.makeCur();
			this.tm = setTimeout(function(){
				_this.makeTM();
			}, this.opt.speed);
		},
		makeTM: function(){
			this.turnNext();
			var _this = this;
			this.tm = setTimeout(function(){
				_this.makeTM();
			}, this.opt.speed);
		},
		clearTM: function(){
			clearTimeout(this.tm);
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
		style: function(node, key, value){
			make.style(node, key, value);
		},
		stopTurning: function(){
			for(var sign in this.turning.signs){
				clearTimeout(this.turning.signs[sign].st);
			}
		},
		clearTurning: function(){
			for(var sign in this.turning.signs){
				clearTimeout(this.turning.signs[sign].st);
				clearTimeout(this.turning.signs[sign].ast);
				this.turning.signs[sign] = undefined;
				delete this.turning.signs[sign];
			}
			this.turning.len = 0;
			this.turning.begin = this.turning.end = undefined;
			this.turning.ing = false;
			this.turning.step = 0;
			this.turning.eStep = 0;
		},
		turningTo: function(){
			var _this = this;
			_this.turning.ing = true;
			for(var sign in this.turning.signs){
				(function(){
					var o = _this.doms[sign];
					var _o = _this.turning.signs[sign]; // { i: 0, toL: 0, st: 0 };
					_o.st = setTimeout(function(){
						var l = parseInt(o.img.style.left, 10), est = _o.toL - l;
						if(est > 0) est = est > _this.turning.eStep ? _this.turning.eStep : est;
						else if(est < 0) est = est < -_this.turning.eStep ? -_this.turning.eStep : est;
						//if(o.sign == _this.curTo.sign) console.log("to", l, est, _this.turning.eStep);
						//else console.log("dsf", l, est, _this.turning.eStep);
						if(est != 0){
							_this.style(o.img, "left", l + est + "px");
							_o.st = setTimeout(arguments.callee, 16.7);
						}
						else if(o.sign == _this.curTo.sign){
							_this.clearTurning();
							_this.makeCur();
						}
					}, 16.7);
					_o.ast = setTimeout(function(){
						var width = parseFloat(o.a.style.width), est;
						if(o.sign != _this.turning.end.sign){
							if(width > _this.opt.asborn){
								est = width - _this.opt.asborn;
								est = est > _this.turning.aeStep ? _this.turning.aeStep : est;
								make.style(o.a, "width", width - est + "px");
								_o.ast = setTimeout(arguments.callee, _this.turning.az);
							}
						}
						else{
							if(width < _this.opt.asborn * 2){
								est = _this.opt.asborn * 2 - width;
								est = est > _this.turning.aeStepn ? _this.turning.aeStep : est;
								make.style(o.a, "width", width + _this.turning.aeStep + "px");
								_o.ast = setTimeout(arguments.callee, _this.turning.az);
							}
						}
					}, _this.turning.az);
				})();
			}
		},
		makeTurning: function(sign){
			//0. meke step
			sign = sign || false;
			if(!sign) return;
			sign = typeof sign == "string" ? this.get(sign) : sign;
			var cha = parseInt(sign.sign) - parseInt(this.cur.sign), step, len = this.length;
			if(cha == 0) step = 0;
			else if(cha > 0 && cha <= len / 2) step = cha;
			else if(Math.abs(cha) > len / 2){
				if(cha > 0) step = cha - len;
				else step = cha + len;
			}
			else step = cha;
			//1. get the elements need to move
			var w = this.opt.width * step, no = step > 0, i = 0, _i = -step, 
				begin = this.cur, end = sign, _wc = parseInt(this.cur.img.style.left);
			if(this.turning.ing){
				var ji = step * this.turning.step;
				if(ji > 0){
					end = Math.abs(step) < Math.abs(this.turning.step) ? this.turning.end : end;
				}
				else if(ji < 0){
					step = this.turning.step > 0 ? len + step : -len + step;
					_i = -step;
					no = step > 0;
					w = this.opt.width * step;
				}
				else if(step == 0){
					w = this.opt.width * this.turning.step;
					i = _i = this.turning.step;
					no = this.turning.step < 0;
					begin = this.turning.end;
				}
			}
			else if(step == 0) return;
			//2. get the steps and eSteps
			this.turning.len = Math.abs(step) + 1;
			this.turning.begin = begin;
			var _w, __w, _bo, mo = no ? "next" : "pref";
			while(true){
				//now position
				__w = this.opt.width * i;
				_bo = this.turning.signs[begin.sign];
				if(!_bo) make.style(begin.img, "left", __w + _wc + "px");
				//to position
				_w = this.opt.width * _i;
				this.turning.signs[begin.sign] = {i: i, toL: _w, st: 0, l: parseInt(begin.img.style.left)};
				//next or pref
				begin = this[mo](begin);
				i = no ? i + 1 : i - 1;
				_i = no ? _i + 1 : _i - 1;
				if(begin.sign == end.sign) break;
			}
			//now position
			__w = this.opt.width * i;
			_bo = this.turning.signs[begin.sign];
			if(!_bo) make.style(begin.img, "left", __w + _wc + "px");
			//to position
			_w = this.opt.width * _i;
			this.turning.signs[begin.sign] = {i: i, toL: _w, st: 0, l: parseInt(begin.img.style.left)};
			//make turning
			this.turning.step = step;
			this.turning.eStep = Math.abs(Math.ceil(w / this.turning.z));
			this.curTo = sign;
			this.turning.end = begin;
			//3. make the turning 
			//if(!this.turning.ing)
				this.turningTo();
		},
		turnTo: function(sign){
			this.stopTurning();
			this.makeTurning(sign);
		},
		turnNext: function(){
			this.stopTurning();
			this.makeTurning(this.next());
		},
		turnPrev: function(){
			this.stopTurning();
			this.makeTurning(this.pref());
		},
		makeCur: function(){
			this.cur = this.curTo;
			for(var sign in this.doms){
				if(sign != this.cur.sign){
					make.hide(this.doms[sign].img);
					make.style(this.doms[sign].a, "width", this.opt.asborn + "px");
				}
				else{
					make.show(this.cur.img);
					make.style(this.doms[sign].a, "width", this.opt.asborn * 2 + "px");
				}
			}
		}
	};
	fn.init.prototype = fn;
})();