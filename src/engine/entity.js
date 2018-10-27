const Generic = require('generic')
const Appearance = require('appearance')
const Vector = require('vector')
const BoundingPoint = require('bounding/bounding_point')

class Entity extends Generic {
    constructor (options){
        super(options)

        // -------------------------------
        this.__appearance = null

        options = Object.assign({
            velocity : null // Vector :: the instance's velocity vector
            ,rotation : 0 // float :: the instance's this.__appearance rotation
            ,rotation_lag : 20 // int :: the number of steps it will take to turnTowards a target direction
        }, options)

        if(options.appearance){
            this.setAppearance(options.appearance)
        }

        this._velocity = options.velocity
        this._rotationLag = options.rotation_lag
        this._rotation = options.rotation
        this._collisionGroup = 'ENTITY'

        // -------------------------------

        // id is set by the world when it's inserted
        this.__id = null
        this.__collisionGroupListening = {}

        this.__visible = true;           // boolean  :: is this instance visible
    }

    // draw is called by a view.
    // the view passes a callback function which is called IFF this instance is to be drawn
    // passed to that function is important information that will be forwarded to the Instance's this.__appearance
    draw (view, center_x, center_y) {
        this.getAppearance().draw(
            view.getCanvas(),
            center_x,
            center_y,
            view.getRotation() * this._rotation, // TODO: this is probably wrong? haven't tested
            view.getScale(),
            this
        )
    }
    preStep (worldClock){
        return
    }
    step (worldClock){
        if(this.getSpeed()){
            this.getBounding().setCenter({
                x : this.getBounding().getCenter().x + this.getSpeed() * Math.cos(this.getDirection())
                ,y : this.getBounding().getCenter().y + this.getSpeed() * Math.sin(this.getDirection())
            })

            if(this.getAppearance()){
                this.getAppearance().getBounding().setCenter(this.getBounding().getCenter())
            }
        }
    }
    postStep (worldClock){
        return
    }
    /****************************************************************************
     COLLISIONS AND COLLISION CHECKING
     ****************************************************************************/

    // this will return what collision group this entity belongs to
    getCollisionGroup (){
        return this._collisionGroup
    }

    getCollidableGroups (){
        return Object.keys(this.__collisionGroupListening)
    }

    // this function passes an other instance and signifies a collision has occurred
    // this instance then determines if it should react to the collision or not
    handleCollidedWith (other){
        let collisionFunction = this.objectIsCollidable(other)
        if(collisionFunction){
            collisionFunction.apply(this,[other])
        }
    }

    groupIsCollidable (group){
        let retVal = false
        if(this.__collisionGroupListening[other]){
            retVal = this.__collisionGroupListening[other]
        }
        return retVal
    }

    // this function will return the collision function for a passed Entity instance
    // or false IFF there is no corresponding collision function
    objectIsCollidable (other){
        let retVal = false

        if (other instanceof Entity) {
            return this.groupIsCollidable(other.getCollisionGroup())
        }

        return retVal
    }

    // this will return true IFF this object is listening for collisions
    hasCollisionChecking (){
        return this.__collisionGroupListening.hasOwnProperty
    }

    // ----------------------

    // this collision function handles collisions between this instance and instances of a specified Group
    onCollideGroup (group, callback){
        this.__collisionGroupListening[group] = callback
    }

    offCollideGroup (group){
        delete this.__collisionGroupListening[group]
    }

    /****************************************************************************
     GETERS AND SETTERS
     ****************************************************************************/

    getPosition (){
        return this.getBounding().getCenter()
    }

    /**
     * tuple can either be a boundingPoint, tuple (x & y) or just x (in which case y is y)
     */
    setPosition (tuple, y){
        if(tuple instanceof BoundingPoint){
            this.getBounding().updateBounding(tuple.getCenter())
        }else if(typeof tuple === 'object'){
            this.getBounding().updateBounding({x:tuple.x,y:tuple.y})
        }else{
            this.getBounding().updateBounding(tuple,y)
        }
    }

    // ----------------------

    /**
     * app is an Appearance object
     * when setting an this.__appearance object, you can also change the collision box by passing new collision dimensions
     * "box" can either be a tuple (width & height) or just width in which case h is height
     */
    setAppearance (app){
        if (!(app instanceof Appearance)) {
            throw "Appearance must be a instance of Appearance"
        }
        this.__appearance = app
    }

    // This function defines how to draw this instance
    getAppearance (){
        return this.__appearance
    }

    // ----------------------

    getDirection (){
        return this.getVelocity().getDirection()
    }
    rotateTowards (dir){
        this.getVelocity().rotateTowards(dir, this._rotationLag)
    }
    setDirection (dir){
        this.getVelocity().setDirection(dir)

        return this.getDirection()
    }

    getSpeed (){
        return this.getVelocity().getSpeed()
    }

    setSpeed (speed){
        this.getVelocity().setSpeed(speed)
    }

    setVelocity (velocity) {
        this._velocity = velocity
    }
    getVelocity () {
        if (!this._velocity) {
            this._velocity = new Vector()
        }
        return this._velocity
    }

    // ----------------------

    getVisible (){
        return this.isVisible()
    }

    isVisible (){
        // must be in the world, visible, and with an appearance
        return this.__id && this.__visible && !!this.__appearance
    }

    setVisible (vis){
        this.__visible =  vis
    }
}

module.exports = Entity