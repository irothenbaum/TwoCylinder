const Generic = require('generic')
const Background = require('background')
const BoundingBox = require('bounding/bounding_box')
const Functions = require('utilities').Functions

class World extends Generic {
    constructor (options) {
        options.bounding = new BoundingBox({
            origin_x : 0
            ,origin_y : 0
            ,width : options.width
            ,height : options.height
        })
        super(options)
        this._fps = options.fps || 30

        this.__instances = []
        this.__particleEmitters = []
        this.__views = []

        this.__toRemoveParticleEmitters = []
        this.__toRemoveInstances = []
        this.__toRemoveViews = []

        this.__collisionGroups = {}
        this.__background = options.background || new Background()

        this.__instanceKey = 0
        this.__viewKey = 0
        this.__emitterKey = 0
        this.__clock = 0
    }

    //TODO: Needs to somehow sync touch events up with the game clock
    start (){
        this.__intervalId = setInterval(() => {
            try{
                this.loop.apply(this, [])
            } catch (e) {
                this.exit(e)
            }
        }, 1000 / this._fps)
    }

    __preStep (time){
        // we have each instance perform a frame step.
        this.__instances.forEach((inst) => {
            inst.preStep(time)
        })
    }

    __postStep (time){
        // we have each instance perform a frame step.
        this.__instances.forEach((inst) => {
            inst.postStep(time)
        })

        this.__removeParticleEmitters()
        this.__removeViews()
        this.__removeInstances()
    }

    loop (){
        this.__preStep(++this.__clock)

        // we have each instance perform a frame step.
        this.__particleEmitters.forEach((part) => {
            part.step(this.__clock)
        })

        // we have each instance perform a frame step.
        this.__instances.forEach((inst) => {
            inst.step(this.__clock)
        })

        // check for collisions
        this.__instances.forEach((me) => {
            if (me.hasCollisionChecking()) {
                let myCollisionGroups = me.getCollidableGroups()
                myCollisionGroups.forEach((group) => {
                    // if there are instances that match the groups im listening for
                    if (this.__collisionGroups[group] && this.__collisionGroups[group].length) {

                        // for each of those matching instance types,
                        this.__collisionGroups[group].forEach( (other) => {

                            // if they're not me, and I collide with them
                            if (me.__id !== other.__id && me.collides(other.getBounding())) {
                                me.handleCollidedWith(other)
                            }
                        })
                    }
                })
            }
        })

        // draw the views
        this.__views.forEach((view) => {
            view.draw(this.__clock)
        })

        this.__postStep(this.__clock)
    }

    exit (){
        clearInterval(this.__intervalId)

        //TODO: handle exit
    }

    /****************************************************************************
     INSTANCE FUNCTIONS
     ****************************************************************************/
    removeInstance (instance){
        if(instance.__id){
            // we add their id to the array of instances to remove
            this.__toRemoveInstances.push(instance)
        }
        return instance
    }
    __removeInstances () {
        disjoinArray2FromArray1(this.__instances, this.__toRemoveInstances, this.__removeFromCollisionGroup)
        this.__toRemoveInstances = []
    }

    addInstance (instance){
        if(instance.__id){
            throw "Instance already added"
        }
        instance.__id = ++this.__instanceKey
        // add it to the big list
        this.__instances.push(instance)
        // also add it according to its collision group
        this.__addToCollisionGroup(instance)

        return instance
    }

    getInstances (){
        return this.__instances
    }

    /****************************************************************************
     VIEW FUNCTIONS
     ****************************************************************************/
    addView (view){
        if (view.__id) {
            throw "View already added"
        }
        view.__id = ++this.__viewKey
        view.setWorld(this)
        this.__views.push(view)

        return view
    }

    getViews (){
        return this.__views
    }

    __removeViews () {
        disjoinArray2FromArray1(this.__views, this.__toRemoveViews)

        this.__toRemoveViews = []
    }

    removeView (view){
        if(view.__id) {
            // we add them to the array of views to remove
            this.__toRemoveViews.push(view)
        }
        return view
    }

    /****************************************************************************
     PARTICLE FUNCTIONS
     ****************************************************************************/
    addParticleEmitter (emitter){
        if (emitter.__id){
            throw "Emitter already added"
        }
        emitter.__id = ++this.__emitterKey
        this.__particleEmitters.push(emitter)
        return emitter
    }

    removeParticleEmitter (emitter){
        if (emitter.__id) {
            // we add their id to the array of emitters to remove
            this.__toRemoveParticleEmitters.push(emitter)
        }
        return emitter
    }
    __removeParticleEmitters (){
        disjoinArray2FromArray1(this.__particleEmitters, this.__toRemoveParticleEmitters)

        this.__toRemoveParticleEmitters = []
    }
    getParticleEmitters () {
        return this.__particleEmitters
    }
    /****************************************************************************
     BACKGROUND FUNCTIONS
     ****************************************************************************/
    setBackground (background){
        this.__background = background
    }

    getBackground (){
        return this.__background
    }
    /****************************************************************************
     HELPER FUNCTIONS
     ****************************************************************************/
    __addToCollisionGroup (instance){
        let group = instance.getCollisionGroup()

        if(!this.__collisionGroups[group]){
            this.__collisionGroups[group] = []
        }
        this.__collisionGroups[group].push(instance)
    }
    __removeFromCollisionGroup (instance){
        let i
        let group = instance.getCollisionGroup()

        if (!this.__collisionGroups[group]) {
            throw "Collision Group does not exist"
        }

        for(i=0; i<this.__collisionGroups[group].length; i++){
            if(this.__collisionGroups[group][i].__id === instance.__id){
                this.__collisionGroups[group].splice(i,1)
                break
            }
        }
    }
}

module.exports = World