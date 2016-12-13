/*
    This script defines a single generic object that can be inserted into the world
*/

TwoCylinder.Engine.ParticleEmitter = TwoCylinder.Engine.Generic.extend({
    initialize:function(options){
        this._super('initialize',options);

        // -------------------------------
        this.__particles = [];
        this.__toRemove = [];

        // by default, newly created emitters do not emit until told to
        this.__isEmitting = false;

        // an internal id counter
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

        this.__removeParticles();
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
        this.__toRemove.push(particle);
    }

    ,__removeParticles : function(particle) {
        if (!this.__toRemove.length) {
            return
        }

        var i;
        var j;
        for(i=0; i<this.__toRemove.length; i++) {
            for(j=0; j<this.__particles.length; j++){
                if(this.__particles[j].__id == this.__toRemove[i]){
                    delete this.__particles[j].__id;
                    this.__particles.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemove = [];
    }
    /**
     * It may be advantageous for particle emitters to emit particles one at a time
     * rather than repeatedly. In that case, this function can be used
     * @param {function} particleType
     */
    ,emitParticle: function(particleType, options) {
        var newParticle;
        var defaultOptions = {
            id : ++this.__particleKey,
            emitter : this
        };

        options = options ? _.extend(options,defaultOptions) : defaultOptions;
        newParticle = new particleType(options);
        this.__particles.push(newParticle);

        return newParticle;
    }
});