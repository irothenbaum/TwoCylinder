/*
    Backgrounds are objects that control how the game background should appear. 
    At most, there should be one per world. 
*/

const Root = require('./root')

class Background extends Root {
    constructor (options) {
        super(options)
        options = Object.assign({
            color : 'transparent'
        }, options)
        this._color = options.color
    }
    draw (view){
        let canvas = view.getCanvas()
        let containingRectangle = view.getBounding().getContainingRectangle()
        let context = canvas.getContext('2d')
        context.beginPath()
        context.fillStyle = this._color
        context.fillRect(0,0,containingRectangle.width,containingRectangle.height)
        context.fill()
        context.stroke()
    }
}

module.exports = Background