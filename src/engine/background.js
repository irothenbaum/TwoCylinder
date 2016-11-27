/*
    Backgrounds are objects that control how the game background should appear. 
    At most, there should be one per world. 
*/

TwoCylinder.Engine.Background = TwoCylinder.Engine.Root.extend({
    initialize : function(options){
        options = _.extend({
            color : 'transparent'
        },options);
        this._color = options.color;
    }
    ,draw : function(view){
        var canvas = view.getCanvas();
        var containingRectangle = view.getBounding().getContainingRectangle();
        var context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = this._color;
        context.fillRect(0,0,containingRectangle.width,containingRectangle.height);
        context.fill();
        context.stroke();
    }
});
