/*
    This script defines a particle emitter to render an explosion
*/

MyGame.Emitters.Explosion = TwoCylinder.Engine.ParticleEmitter.extend({
    initialize : function(options){
        this._super('initialize', options);

        options = _.extend({
            size : 10
        },options);

        this.__colors = ['#ccc', '#ff0'];
        this.explode(options.size);
    }
    ,explode : function(size){
        var i;
        var newVector;

        for (i=0; i<size; i++) {
            newVector = new TwoCylinder.Engine.Vector({
                direction : TwoCylinder.Engine.Geometry.getRandomDirection(),
                speed : 2 + (Math.random() * size)
            });

            this.emitParticle(MyGame.Particles.ShrinkingCircle, {
                size : 4 + (Math.random() * size),
                velocity : newVector,
                color : this.__colors[parseInt(Math.random()*2)]
            });
        }
    }
});
