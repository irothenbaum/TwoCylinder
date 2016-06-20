/*
    This script contains the user object
*/
MyGame.Entities.Enemy = TwoCylinder.Engine.Entity.extend({
    initialize : function(options){
        options = _.extend({
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : options.x || 0
                ,y : options.y || 0
                ,radius : 20
            })
            ,appearance :  new MyGame.Sprites.Enemy(options)
        }
        ,options);
        this._super('initialize',options);
        
        this.setSpeed(3);
        this.__targetSpot = this.getPosition();
        
        this.onCollideGroup('PLAYER_BULLET', this.die);
    }
    ,preStep : function(){
        // Step 1 are we too close to the player
        var playerPosition = window.game.player.getPosition();
        var playerDistance = TwoCylinder.Engine.Geometry.distanceToPoint(this.getPosition(),playerPosition);
        if(playerDistance < 300){
            this.rotateTowards(TwoCylinder.Engine.Geometry.angleToPoint(playerPosition, this.getPosition()));
        }else{
            // Step 2, have we reached our point yet?
            if(TwoCylinder.Engine.Geometry.distanceToPoint(this.getPosition(),this.__targetSpot) < 10){
                this.__targetSpot = null;
            }
            if(!this.__targetSpot){
                var worldBox = window.game.getWorld().getBounding().getContainingRectangle();
                this.__targetSpot = {
                    x : parseInt(Math.random() * worldBox.width)
                    ,y : parseInt(Math.random() * worldBox.height)
                };
            }
            this.rotateTowards(TwoCylinder.Engine.Geometry.angleToPoint(this.getPosition(), this.__targetSpot));
        }
    }
    ,die : function(){
        window.game.getWorld().removeInstance(this);
    }
});