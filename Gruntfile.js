module.exports = function(grunt) {
    grunt.initConfig({
        concat : {
            options : {
                separator : "\n"
                , banner : "(function (root, factory) {if(typeof module === \"object\" && module.exports){module.exports = factory(require(\"underscore\"));} else if(typeof define === \"function\" && define.amd){define(\"TwoCylinder\",[\"underscore\"], factory);} else {root[\"TwoCylinder\"] = factory(root._);}}(this, function(_) {return new function(){var TwoCylinder = this;this.Engine = {};this.Entities = {};this.IO = {};this.Sprites = {};\n"
                , footer : "};}));"
            }
            , dist : {
                src : [
                    // ENGINE
                    "src/engine/root.js"
                    , "src/engine/geometry.js"
                    , "src/engine/generic.js"
                    , "src/engine/appearance.js"
                    , "src/engine/entity.js"
                    , "src/engine/game.js"
                    , "src/engine/view.js"
                    , "src/engine/world.js"
                    , "src/engine/background.js"
                    , "src/engine/bounding.js"
                    , "src/engine/bounding_box.js"
                    , "src/engine/bounding_circle.js"
                    , "src/engine/bounding_point.js"
                    // ENTITIES
                    
                    // IO
                    , "src/io/event_types.js"
                    , "src/io/event.js"
                    , "src/io/touch.js"
                    , "src/io/joystick.js"
                    
                    // SPRITES
                    , "src/sprites/joystick.js"
                ]
                , dest : "dist/twocylinder.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.registerTask("default", [ "concat" ]);
};