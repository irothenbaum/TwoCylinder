/*
    This script handles the base configuration of the game
*/

window.MyGame = {
    Particles : {}
    ,Emitters : {}
};

MyGame.Game = TwoCylinder.Engine.Game.extend({
    initialize : function(){
        this.world = new TwoCylinder.Engine.World({fps:30, width:600,height:600});
        this.setWorld(this.world);

        this.__emitter = null;

        this.createViews();
    }
    ,clearEmitters:  function() {
        if (!this.__emitter) {
            return;
        }
        this.world.removeParticleEmitter(this.__emitter);
    }
    ,createEmitter: function(name) {
        this.clearEmitters();
        switch (name) {
            case "explosion":
                this.__emitter = new MyGame.Emitters.Explosion();
                break;
            default:
                throw "Unknown Type";
        }

        this.world.addParticleEmitter(this.__emitter);
    }
    ,createViews: function(){
        var blackCanvas = document.getElementById('black');
        var whiteCanvas = document.getElementById('white');
        var coloredCanvas = document.getElementById('colored');

        this.blackView = new TwoCylinder.Engine.View({
            canvas : blackCanvas
            ,bounding : new TwoCylinder.Engine.BoundingBox({
                width : parseInt(window.getComputedStyle(blackCanvas).width)
                ,height : parseInt(window.getComputedStyle(blackCanvas).height)
                ,origin_x : 0
                ,origin_y : 0
            })
        });

        this.whiteView = new TwoCylinder.Engine.View({
            canvas : whiteCanvas
            ,bounding : new TwoCylinder.Engine.BoundingBox({
                width : parseInt(window.getComputedStyle(whiteCanvas).width)
                ,height : parseInt(window.getComputedStyle(whiteCanvas).height)
                ,origin_x : 0
                ,origin_y : 0
            })
        });

        this.coloredView = new TwoCylinder.Engine.View({
            canvas : coloredCanvas
            ,bounding : new TwoCylinder.Engine.BoundingBox({
                width : parseInt(window.getComputedStyle(coloredCanvas).width)
                ,height : parseInt(window.getComputedStyle(coloredCanvas).height)
                ,origin_x : 0
                ,origin_y : 0
            })
        });

        this.world.addView(this.blackView);
        this.world.addView(this.whiteView);
        this.world.addView(this.coloredView);
    }
});
