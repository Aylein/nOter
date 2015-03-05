    var socket;
    var firstconnect = true;
    function connect(){
        if(firstconnect){
            socket = io.connect(null);
            socket.on('message', function(data){ message(data); });
            socket.on('connect', function(){ status_update("Connected to Server"); });
            socket.on('disconnect', function(){ status_update("Disconnected from Server"); });
            socket.on('reconnect', function(){ status_update("Reconnected to Server"); });
            socket.on('reconnecting', function( nextRetry ){ status_update("Reconnecting in " + nextRetry + " seconds"); });
            socket.on('reconnect_failed', function(){ message("Reconnect Failed"); });
            firstconnect = false;
        }else{
            socket.socket.reconnect();
        }
    }
    function disconnect(){
        socket.disconnect();
    }
    function message(data){
        console.log(data);
    }
    function status_update(txt){
        console.log(txt);
    }
    function esc(msg){
        return msg.replace(/</g, '<').replace(/>/g, '>');
    }
    function send(act, obj){
        var i = 0;
        act = arguments[i];
        if(act != "msg" && act != "log" && act != "send"){
            obj = act;
            act = "msg";
        }
        obj = obj || "Holle World";
        socket.send(act, obj);
    }
    function emit(act, obj, callback){
        var i = 0, act = arguments[i++], callback;
        if(act != "msg" && act != "log" && act != "send"){
            callback = obj;
            obj = act;
            act = "emit";
        }
        callback = callback || arguments[i] || function(){};
        socket.emit(act, obj, callback);
    }
    console.slog = function(){
        console.log.apply(this, arguments);
        send("log", arguments);
    }
    connect();
    //send({a: "a"});
    //console.slog({b: "b"}, {b: "b"});
    //socket.emit("msg");