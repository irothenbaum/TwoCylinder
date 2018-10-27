/*
    This script defines an appearance.
    Appearances are attached to instances and define how that instance should be drawn in the world
*/

const Generic = require('./generic')

class Appearance extends Generic {
    constructor (options) {
        super(options)
    }
    
    draw (canvas, x, y, rotation, scale, entity){
        let context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = 'grey';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#333333';
        context.stroke();
    }
}

module.exports = Appearance