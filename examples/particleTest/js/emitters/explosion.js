/*
    This script defines a particle emitter to render an explosion
*/

MyGame.Emitters.Explosion = TwoCylinder.Engine.ParticleEmitter.extend({
    initialize : function(options){
        options = _.extend({
            size : 15,
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : 200,
                y : 200,
                radius : 20
            })
        },options);
        this._super('initialize', options);

        this.__colors = ['#ccc', '#ff0','#aaa', '#f60','#fb0','#777'];
        this.explode(options.size);
    }
    ,explode : function(size){
        var i;
        var newVector;

        for (i=0; i<size; i++) {
            newVector = new TwoCylinder.Engine.Vector({
                direction : TwoCylinder.Engine.Geometry.getRandomDirection(),
                speed : 2 + (Math.random() * size / 2)
            });
            this.emitParticle(MyGame.Particles.ShrinkingCircle, {
                size : 8 + (Math.random() * size * 1.5),
                velocity : newVector,
                color : this.__colors[parseInt(Math.random()*this.__colors.length)]
            });
        }
    }
});
