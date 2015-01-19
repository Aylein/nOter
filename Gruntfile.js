module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat:{
            dist:{
                src: ["src/nOter/nOter.js"],
                dest: "test/scripts/nOter.js"
            },
            js:{
                src: ["src/nOter/nOter.js"],
                dest: "nOter/nOter.js"
            }
        },
        uglify:{
            options:{
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n"
            },
            dist:{
                files:{"test/scripts/nOter.min.js": ["test/scripts/nOter.js"]}
            },
            js:{
                files:{"nOter/nOter.min.js": ["nOter/nOter.js"]}
            }
        },
        watch:{
            nOter: {
                files: ["src/nOter/*.js"],
                tasks: ["concat:*", "uglify:*"]
            }
        }
    });  

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    //grunt.registerTask("default", ["concat:*", "uglify:*"]);
    grunt.registerTask("default", ["watch"]);
    /*
    grunt.loadTasks("build_tasks");
    grunt.registerTask("default", ["concat:*", "uglify:*"]);
    grunt.registerTask("test", function(){
        console.log("begin");
        var fs = require( "fs" );
        var requirejs = require( "requirejs" );
        var config = {
            baseUrl: "/src/nOter",
            name: "/nOter",
            out: "/nOter/nOter.js"
        };
        //if(requirejs.optimize) console.log(requirejs);
        try{
            requirejs.optimize(config, function(buildResponse){
                fs.readFile(config.out, "UTF8", function(err, content){
                    if(err){
                        console.log("1");
                    }
                    else{
                        console.log("3");
                    }
                });
            }, function(err) {
                console.log("2");
            });
        } catch(e){
            console.log(e);
        }
        console.log("end");
    });
    */
};