var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var io = require("socket.io");
var port = 800;
var types = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};

var httpServer = http.createServer(function (request, response) {
    var _url = url.parse(request.url).pathname, _path, ma = request.method;
    if(_url == undefined || _url == "/" || _url == "/index.html")
        _url = "/index.html";
    _path = path.join("test", _url);
    var ext = path.extname(_path);
    ext = ext ? ext.slice(1) : "unknown";
    fs.exists(_path, function (exists) {
        if(!exists){
            console.log(ma + " " + "404" + " " + _url);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("This request URL " + _url + " was not found on this server.");
            response.end();
        }else{
            fs.readFile(_path, "binary", function(err, file){
                if(err){
                    console.log(ma + " " + "500" + " " + _url);
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.end(err);
                }else{
                    console.log(ma + " " + "200" + " " + _url);
                    var contentType = types[ext] || "text/plain";
                    response.writeHead(200, {"Content-Type": contentType});
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
httpServer.listen(port);
console.log("http server now listenning on port: " + port + ".");

var list = {};
io = io.listen(httpServer);
io.sockets.on("connection", function(socket){
    if(list[socket.id] == undefined) list[socket.id] = socket;
    console.log("socket Connection " + socket.id + " accepted.");
    socket.on('message', function(action, msg){
        console.log(action);
        switch(action){
            case "log": 
                console.log.apply(this, msg);
                break;
            case "msg":
                socket.send("ok");
                break;
            case "send":
                for(var name in list){
                    console.log(list[name]);
                    list[name].send(msg);
                }
                break;
        }
    });
    socket.on("emit", function(){
        console.log("emit");
        //if(typeof callback == "function") callback(data);
    });
    socket.on('disconnect', function(){
        if(list[socket.id] != undefined) delete list[socket.id];
        console.log("Connection " + socket.id + " terminated.");
    });
});