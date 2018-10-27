/*
    This script handles drawing the joystick appearance
*/

const Touch = require('./touch')
const BoundingCircle = require('../engine/bounding/bounding_circle')
const {Geometry, Functions} = require('../engine/utilities')
const JoystickSprite = require('../sprites/joystick')

class Joystick extends Touch {
    constructor (options){
        let defaultRadius = 40
        options.tap_distance = 0
        options.bounding = new BoundingCircle({
            x : options.x
            ,y : options.y
            ,radius : defaultRadius
        })
        super (options)
        this._defaultRadius = defaultRadius

        this.__isHeld = false
        
        this.__pullRatio = 1.8
        
        // the operate function is what we will pass joystick motions to
        this.__operateFunction = null
        
        this.__appearance = new JoystickSprite()
        
        this._previousEvent = null
        
        this.onDown((evt) => {
            this._previousEvent = evt; //initialize evt
            
            // we link to itself so that the joystick draws properly
            this._previousEvent.linkEvent(evt)

            this.getBounding().updateBounding({
                radius : 4 * this._defaultRadius
            })
            
            if(typeof this.__operateFunction === 'function'){
                if (evt.velocity) {
                    evt.velocity.setSpeed(0)
                }
                this.__operateFunction(evt)
            }
        })
        
        this.onUp((evt) => {
            this.getBounding().updateBounding({
                radius : this._defaultRadius
            })
            delete this._previousEvent
            
            if(typeof this.__operateFunction === 'function'){
                if (evt.velocity) {
                    evt.velocity.setSpeed(0)
                }
                this.__operateFunction(evt)
            }
        })
        
        this.onMove((evt) => {
            if (this.isDown()){
                evt.linkEvent(this.__lastDown)
                if(typeof(this.__operateFunction) === 'function'){
                    //want to make the max speed the distance we allow the joystick to move
                    if (evt.velocity) {
                        evt.velocity.setSpeed(Math.min(evt.velocity.getSpeed(), this._defaultRadius / this.__pullRatio))
                    }
                    this.__operateFunction(evt)
                }
                this._previousEvent = evt
            }
        })
    }
    onOperate (callback){
        this.__operateFunction = callback
    }
    offOperate (){
        delete this.__operateFunction; 
    }
    getDrawOptions () {
        let options = {
            stick : this.getBounding().getCenter()
            ,operating : this.isDown()
        }
        
        if(this._previousEvent && this._previousEvent.velocity){
            let vector = Functions.clone(this._previousEvent.velocity)
            vector.setSpeed(Math.min(this._defaultRadius / this.__pullRatio, this._previousEvent.velocity.getSpeed()))
            options.stick = Geometry.pointFromVector(options.stick, vector)
        }
        
        return options
    }
}

module.exports = Joystick