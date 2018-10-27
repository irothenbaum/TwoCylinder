/*
 This script defines the particle object
 */
const Root = require('root')


class Particle extends Root {
    constructor(options) {
        super(options)
        options = Object.assign({}, options)
        this.__id = options.id
        this.__emitter = options.emitter
    }
    // This function is responsible for moving the particle or otherwise tracking its lifecycle
    step (clock) {
        return null
    }
    draw (canvas,x,y,rotation,scale,emitter){
        let context = canvas.getContext('2d')
        context.beginPath()
        context.arc(x, y, 20, 0, 2 * Math.PI, false)
        context.fillStyle = 'grey'
        context.fill()
        context.lineWidth = 5
        context.strokeStyle = '#333333'
        context.stroke()
    }
    destroy () {
        this.__emitter.removeParticle(this)
    }
}

module.exports = Particle
