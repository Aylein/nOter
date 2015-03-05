
    !function(){
        //花色
        var i = ["黑", "红", "梅", "方"];
        //牌码
        var n = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        //顺序生成一套牌
        var makePuke = function(){
            var puke = [];
            puke.push("JOKER");
            for(var s = 0; s < 4; s++)
                for(var d = 0; d < 13; d++)
                    puke.push(i[s] + n[d]);
            puke.push("joker");
            return puke;
        }; 
        //普通切牌 中间抽几张放最上面
        var cutPuke = function(arr, s, e){
            var ar = [];
            for(var i = s; i < e; i++) ar.push(arr[i]);
            for(var i = 0; i < s; i++) ar.push(arr[i]);
            for(var i = e, z = arr.length; i < z; i++) ar.push(arr[i]);
            return ar;
        };
        //普通切牌 中间抽几张放最下面
        var cutPuke_down = function(arr, s, e){
            var ar = [];
            for(var i = e, z = arr.length; i < z; i++) ar.push(arr[i]);
            for(var i = s; i < e; i++) ar.push(arr[i]);
            for(var i = 0; i < s; i++) ar.push(arr[i]);
            return ar;
        };
        //普通切牌 下面的放上面来
        var cutPuke_half = function(arr, index){
            index = (index != undefined && index >= 1 && index <= 54 ? index : undefined) || 27;
            var ar = [];
            for(var i = 0; i < index; i++){
                ar.push(arr[i + 27]);
                ar.push(arr[i]);
            }
            return ar;
        }
        //高级切牌 分量部分交叉切
        var cutPuke_each = function(arr){
            var ar = [];
            for(var i = 0; i < 27; i++){
                ar.push(arr[i]);
                ar.push(arr[i + 27]);
            }
            return ar;
        }
        //构造函数
        Puke = function(){
            //初始化一套牌
            this.cards = makePuke();
            //初始化玩家
            this.player = {};
        };
        //原型
        Puke.prototype = {
            //初始化玩家
            clear: function(){
                this.player = {
                    p1: {focus: false, cards: [], win: false, dz: false},
                    p2: {focus: false, cards: [], win: false, dz: false},
                    p3: {focus: false, cards: [], win: false, dz: false},
                    deep: []
                };
            },
            //查看当前牌顺序
            showCards: function(){
                for(var i = 0, z = this.cards.length; i < z; i++)
                    document.write("[" + this.cards[i] + "] ");
            },
            //切牌
            cutCards: function(arr){
                this.cards = arr || this.cards;
                this.cards = cutPuke_half(this.cards);
                for(var i = 0, z = 10; i < z; i++){
                    var si = Math.ceil(Math.random()*46 + 5);
                    var sn = Math.ceil(Math.random()*46 + 5);
                    if(si > sn){
                        si = si + sn;
                        sn = si - sn;
                        si = si - sn;
                    }
                    else if(si = sn){
                        i--;
                        continue;
                    }
                    si = si < 5 ? 5 : si;
                    sn = sn > 50 ? 50 : sn;
                    this.cards = cutPuke(this.cards, si, sn);
                    this.cards = cutPuke_each(this.cards);
                }
            },
            //发牌
            pushCards: function(deep, index){
                this.clear();
                if(typeof deep !== "boolen") {
                    index = deep;
                    deep = false;
                }
                index = (index != undefined && index >= 1 && index <= 54 ? index : undefined) || Math.ceil(Math.random()*46 + 5);
                if(deep) this.cards = cutPuke_half(this.cards, index);
                var i = 53, n = 0;
                while(i > 2){
                    n = 1 + n%3;
                    if(i == index - 1) this.player["p" + n].focus = true;
                    this.player["p" + n].cards.push(this.cards[i--]);
                    n++;
                }
                this.player["deep"].push(this.cards[51]);
                this.player["deep"].push(this.cards[52]);
                this.player["deep"].push(this.cards[53]);
            },
            //玩家信息
            showPlayer: function(){
                return this.player;
            }
        };
    }();