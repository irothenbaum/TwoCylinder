/*
    This script defines a single generic object that can be inserted into the world
*/

TwoCylinder.Engine.ParticleEmitter = TwoCylinder.Engine.Generic.extend({
    initialize:function(options){
        this._super('initialize',options);

        options = _.extend({
            particles : [],
            lifetime : false
        },options);

        // -------------------------------
        this.__particles = options.particles;
        this.__lifetime = options.lifetime;
    }
    
    // an emitter drawing basically just calls draw on all its particles
    // particles are extensions of appearances
    ,draw : function(view, center_x, center_y){
        _.each(this.getParticles(), function(p){
            p.draw(view.getCanvas(),
                center_x,
                center_y,
                view.getRotation() * this._rotation,
                view.getScale(),
                this);
        });
    }
    ,step : function(clock) {
        _.each(this.getParticles(), function(p) {
            p.step(clock);
        });
    }
    ,getLifetime : function() {
        return this.__lifetime;
    }
    ,getParticles : function() {
        return this.__particles;
    }
});