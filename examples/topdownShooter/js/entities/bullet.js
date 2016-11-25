/*
    This script contains the user object
*/
MyGame.Entities.Bullet = TwoCylinder.Engine.Entity.extend({
    initialize : function(options){
        options = _.extend({
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : options.x || 0
                ,y : options.y || 0
                ,radius : 5
            })
            ,appearance :  new MyGame.Sprites.Bullet(options)
            ,direction : 0
        }, options);
        options.velocity = new TwoCylinder.Engine.Vector({
            direction : options.direction,
            speed : 30
        });
        this._super('initialize',options);
        
        this._collisionGroup = 'PLAYER_BULLET';
    }
    ,postStep:function(){
        if(!this.getBounding().collides(window.game.getWorld().getBounding())){
            window.game.getWorld().removeInstance(this);
        }
    }
});