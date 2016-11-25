/*
 This script defines the Vector object
 */

TwoCylinder.Engine.Vector = TwoCylinder.Engine.Root.extend({
    initialize : function(options) {
        options = _.extend({
            direction : 0,
            speed : 0
        },options);

        this.__direction = options.direction;
        this.__speed = options.speed;
    }
// ------------------------------------
// GETTERS / SETTERS
// ------------------------------------
    ,getDirection : function(){
        return this.__direction;
    }
    ,getSpeed : function(){
        return this.__speed;
    }
    ,setDirection : function(dir){
        this.__direction = dir;
    }
    ,setSpeed : function (speed) {
        this.__speed = speed;
    }
// ------------------------------------
// CONVENIENCE FUNCTIONS
// ------------------------------------
    ,rotateTowards : function(dir, friction){
        var currentDirection = this.getDirection();
        var TAU = ( 2 * Math.PI );
        var directionDiff = (dir + TAU - currentDirection) % TAU;

        friction = friction ? friction : 1;
        if (directionDiff <= (Math.PI) ){
            this.setDirection(currentDirection + (directionDiff / friction));
        }else{
            this.setDirection(currentDirection - ( ( directionDiff - Math.PI ) / friction));
        }
    }
});
