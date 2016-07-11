/*
    This script defines an appearance.
    Appearances are attached to instances and define how that instance should be drawn in the world
*/

TwoCylinder.Engine.Appearance = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        this._super('initialize',options);
    }
    // drawFunctions should assume the context of the canvas drawing them
    ,drawFunction : function(x,y,rotation,scale,options){
        var context = this.getContext('2d');
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = 'grey';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#333333';
        context.stroke();
    }
    
    ,draw : function(canvas,x,y,rotation,scale,entity){
        return this.drawFunction.apply(canvas,[x,y,rotation,scale,entity]);
    }
});