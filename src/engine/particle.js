/*
 This script defines the particle object
 */

TwoCylinder.Engine.Particle = TwoCylinder.Engine.Root.extend({
    initialize : function(options) {
        options = _.extend({}, options);
        this.__id = options.id;
        this.__emitter = options.emitter;
    }
    // This function is responsible for moving the particle or otherwise tracking its lifecycle
    ,step : function(clock) {
        return null;
    }
    ,draw : function(canvas,x,y,rotation,scale,emitter){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = 'grey';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#333333';
        context.stroke();
    }
    ,destroy : function() {
        this.__emitter.removeParticle(this);
    }
});
