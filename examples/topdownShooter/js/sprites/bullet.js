/*
    This script contains the player sprite
*/
MyGame.Sprites.Bullet = TwoCylinder.Engine.Appearance.extend({
    initialize : function(){
        options = {
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : 0
                ,y : 0
                ,radius : 5
            })
        };
        
        this._super('initialize',options);
    }

    //drawFunctions should assume the context of the canvas drawing them
    ,drawFunction : function(x,y,rotation,scale,entity){
        var context = this.getContext('2d');
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'red';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#000033';
        context.stroke();
    }
});