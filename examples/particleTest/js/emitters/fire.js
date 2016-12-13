/*
    This script defines a particle emitter to render an explosion
*/

MyGame.Emitters.Fire = TwoCylinder.Engine.ParticleEmitter.extend({
    initialize : function(options){
        options = _.extend({
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : 200,
                y : 200,
                radius : 20
            })
        },options);
        this._super('initialize', options);

        this._size = 20;
    }
    ,step : function(clock){
        var flameVector = new TwoCylinder.Engine.Vector({
            direction : 0,
            speed : size / 2
        });

        // flame
        this.emitParticle(MyGame.Particles.ShrinkingCircle, {
            size : this._size,
            center : {y:0, x: Math.random()*this._size},
            velocity : vector,
            color : ['rgba(255,255,255,1)', 'rgba(255,255,0,1)', 'rgba(255,0,0,0)']
        });

        if (clock % 4 == 0) {
            var smokeVector = new TwoCylinder.Engine.Vector({
                direction : 0,
                speed : size / 3
            });
            // smoke
            this.emitParticle(MyGame.Particles.ExpandingCircle, {
                size : this._size * 2,
                center : {y:0, x: Math.random()*this._size},
                velocity : vector,
                color : ['rgba(150,150,150,1)', 'rgba(255,255,255,0)']
            });
        }


    }
});
