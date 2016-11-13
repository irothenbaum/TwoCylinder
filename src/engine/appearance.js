/*
    This script defines an appearance.
    Appearances are attached to instances and define how that instance should be drawn in the world
*/

TwoCylinder.Engine.Appearance = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        this._super('initialize',options);
    }
    
    ,draw : function(canvas,x,y,rotation,scale,entity){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = 'grey';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#333333';
        context.stroke();
    }
});