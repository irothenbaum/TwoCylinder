/*
    This script defines a single generic object that can be inserted into the world
*/

TwoCylinder.Engine.ParticleEmitter = TwoCylinder.Engine.Generic.extend({
    initialize:function(options){
        this._super('initialize',options);

        options = _.extend({
            particleType : null,
            lifetime : false
        },options);

        // -------------------------------
        this.__particleReference = options.particleType;
        this.__lifetime = options.lifetime;
        this.__particles = [];

        // by default, newly created emitters do not emit until told to
        this.__isEmitting = false;

        // canEmit is an internal semaphore that helps control when to emit another particle
        this._canEmit = false;

        this.__particleKey = 0;

        // id is set by the world when it's inserted
        this.__id = null;
    }
    // an emitter drawing basically just calls draw on all its particles
    // particles are like appearances, but without bounding boxes - they just get drawn if the emitter is in
    // collision with the view
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

        if (this._canEmit) {
            this.emitNewParticle();
            this._canEmit = false;
        }
    }
    ,getLifetime : function() {
        return this.__lifetime;
    }
    ,destroy : function() {
        this.__particles = [];
    }
    ,setIsEmitting: function(isEmitting) {
        this.__isEmitting = isEmitting;
    }
    ,getIsEmitting: function() {
        return this.__isEmitting;
    }

/****************************************************************************
 PARTICLES
 ****************************************************************************/
    ,getParticles : function() {
        return this.__particles;
    }
    ,removeParticle : function(particle) {
        var i;
        if(particle.__id){
            for(i=0; i<this.__particles.length; i++){
                if(this.__particles[i].__id == particle.__id){
                    this.__particles.splice(i,1);
                    break;
                }
            }
        }
        return particle;
    }
    ,emitNewParticle : function(options) {
        var newParticle;
        if (typeof this.__particleReference == 'function') {
            options = _.extend(options,{
                id : ++this.__particleKey,
                emitter : this
            });
            newParticle = new this.__particleReference(options);
        } else {
            newParticle = null;
        }
        return newParticle;
    }
});