module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat:{
            dist:{
                src: ["src/nOter/nOter.js"],
                dest: "release/nOter/nOter.js"
            },
            puke: {
                src: ["src/Puke/puke.js"],
                dest: "release/Puke/puke.js"
            },
            imager: {
                src: ["src/imager/imager.js"],
                dest: "release/imager/imager.js"
            },
            ef: {
                src: ["src/EF/ef.js"],
                dest: "release/EF/ef.js"
            }
        },
        uglify:{
            options:{
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> @AyleinOter */\n"
            },
            dist:{
                files:{
                    "test/scripts/nOter.min.js": ["release/nOter/nOter.js"],
                    "release/nOter/nOter.min.js": ["release/nOter/nOter.js"]
                }
            },
            puke: {
                files:{
                    "test/scripts/puke.min.js": ["release/Puke/puke.js"],
                    "release/Puke/puke.min.js": ["release/Puke/puke.js"]
                }
            },
            imager: {
                files:{
                    "test/scripts/imager.min.js": ["release/imager/imager.js"],
                    "release/imager/imager.min.js": ["release/imager/imager.js"]
                }
            },
            ef: {
                files:{
                    "test/scripts/ef.min.js": ["release/EF/ef.js"],
                    "release/EF/ef.min.js": ["release/EF/ef.js"]
                }
            }
        },
        watch:{
            nOter: {
                files: ["src/nOter/*.js", "src/Puke/*.js", "src/imager/*.js", "src/EF/*.js"],
                tasks: ["concat:*", "uglify:*"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["concat:*", "uglify:*"]);
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