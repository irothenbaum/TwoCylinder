/*
    This script defines a single shrinking orb particle
*/

MyGame.Particles.ShrinkingCircle = TwoCylinder.Engine.Particle.extend({
    initialize : function(options) {
        this._super('initialize', options);
        this._size = options.size;
        this._velocity = options.velocity;
        this._color = options.color || '#ccc';

        this._currentCenter = {x : 0, y : 0};
    }
    ,step : function(clock) {
        this._currentCenter = TwoCylinder.Engine.Geometry.pointFromVector(this._currentCenter, this._velocity);
        this._size = this._size * 0.8;

        if ( this._size < 0.5) {
            this.destroy();
        }
    }
    ,draw : function(canvas, x, y, rotation, scale, emitter){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x + this._currentCenter.x, y + this._currentCenter.y, this._size, 0, 2 * Math.PI, false);
        context.fillStyle = this._color;
        context.fill();
    }
});
