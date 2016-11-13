/*
    This script handles drawing the joystick appearance
*/
TwoCylinder.Sprites.Joystick = TwoCylinder.Engine.Appearance.extend({
    initialize : function(){
        options = {
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : 0
                ,y : 0
                ,radius : 20
            })
        };
        
        this._super('initialize',options);
        
    }
    ,draw : function(canvas,x,y,rotation,scale,joystick){
        var options = joystick.getDrawOptions();
        var context = canvas.getContext('2d');
        
        // if the joystick is being operated, we draw the binding circle
        if(options.operating){
            context.beginPath();
            context.arc(x, y, 160, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(0,255,0,0.1)';
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = 'rgba(0,255,0,0.3)';
            context.stroke();
        }
        
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = '#000000';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#303030';
        context.stroke();
        
        context.beginPath();
        context.lineWidth = 18;
        context.strokeStyle = '#333333';
        context.lineCap = 'round';
        context.moveTo(options.stick.x, options.stick.y);
        context.lineTo(x, y);
        context.stroke();
        
        context.beginPath();
        context.arc(options.stick.x, options.stick.y, 18, 0, 2 * Math.PI, false);
        context.fillStyle = '#dd2222';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#aa1111';
        context.stroke();
        
        context.beginPath();
        context.arc(options.stick.x + 6, options.stick.y - 6, 4, 0, 2 * Math.PI, false);
        context.fillStyle = '#ffcccc';
        context.fill();
    }
}); 