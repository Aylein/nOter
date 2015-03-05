    //$.doler();
    oter.jsonp({
        type: "post",
        url: "http://localhost:16996/api/test",
        data: {name: "123", age: 123},
        dataType: "json",
        success: function(data){
            console.log(data);
        }
    });