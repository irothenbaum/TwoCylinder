/*
    This script defines a game object
    This is an abstract class that ducktypes what a "game" must be able to do.
    
    
    
    THINGS TO WORK OUT
    - Instance to instance collision checking
    - World backgrounds?
        - Scaling and rotating world backgrounds consistently between views
    - TEST
*/

TwoCylinder.Engine.Game = TwoCylinder.Engine.Generic.extend({
    start : function(){
        return this.getWorld().start();
    }

    ,exit : function(){
        return this.getWorld().exit();
    }
    
    ,setWorld : function(w){
        this.__world = w;
    }
    
    ,getWorld : function(){
        return this.__world;
    }
});