const Functions = require('utilities').Functions

class ParticleEmitter extends Generic {
    constructor(options) {
        super(options)

        // -------------------------------
        this.__particles = []
        this.__toRemove = []

        // by default, newly created emitters do not emit until told to
        this.__isEmitting = false

        // an internal id counter
        this.__particleKey = 0

        // id is set by the world when it's inserted
        this.__id = null
    }
    // an emitter drawing basically just calls draw on all its particles
    // particles are like appearances, but without bounding boxes - they just get drawn if the emitter is in
    // collision with the view
    draw (view, center_x, center_y){
        this.getParticles().forEach((p) => {
            p.draw(view.getCanvas(),
                center_x,
                center_y,
                view.getRotation() * this._rotation,
                view.getScale(),
                this)
        })
    }
    step (clock) {
        this.getParticles().forEach((p) => {
            p.step(clock)
        })

        this.__removeParticles()
    }
    destroy () {
        this.__particles = []
    }
    setIsEmitting(isEmitting) {
        this.__isEmitting = isEmitting
    }
    getIsEmitting() {
        return this.__isEmitting
    }

    /****************************************************************************
     PARTICLES
     ****************************************************************************/
    getParticles () {
        return this.__particles
    }
    removeParticle (particle) {
        this.__toRemove.push(particle)
    }

    __removeParticles (particle) {
        Functions.disjoinArray2FromArray1(this.__particles, this.__toRemove)
        this.__toRemove = []
    }
    /**
     * It may be advantageous for particle emitters to emit particles one at a time
     * rather than repeatedly. In that case, this function can be used
     * @param {function} particleType
     * @param {object} options
     */
    emitParticle(particleType, options) {
        let newParticle

        options = Object.assign({
            id : ++this.__particleKey,
            emitter : this
        }, options)
        newParticle = new particleType(options)
        this.__particles.push(newParticle)

        return newParticle
    }
}

module.exports = ParticleEmitter