/*
 This script defines the Vector object
 */

const Root = require('./root')
const Constants = require('./utilities').Constants

class Vector extends Root {
    constructor (options) {
        super (options)
        options = Object.assign({
            direction : 0,
            speed : 0
        },options)

        this.__direction = options.direction
        this.__speed = options.speed
    }
// ------------------------------------
// GETTERS / SETTERS
// ------------------------------------
    getDirection (){
        return this.__direction
    }
    getSpeed (){
        return this.__speed
    }
    setDirection (dir){
        this.__direction = dir
    }
    setSpeed  (speed) {
        this.__speed = speed
    }
// ------------------------------------
// CONVENIENCE FUNCTIONS
// ------------------------------------
    rotateTowards (dir, friction){
        let currentDirection = this.getDirection()
        let directionDiff = (dir + Constants.TAU - currentDirection) % Constants.TAU

        friction = friction ? friction : 1
        if (directionDiff <= (Math.PI) ){
            this.setDirection(currentDirection + (directionDiff / friction))
        }else{
            this.setDirection(currentDirection - ( ( directionDiff - Math.PI ) / friction))
        }
    }
}


module.exports = Vector