/*
    This script defines a single generic object that can be inserted into the world
*/

TwoCylinder.Engine.Entity = TwoCylinder.Engine.Generic.extend({
    initialize:function(options){
        this._super('initialize',options);
        
        // -------------------------------
        this.__appearance = null;
        
        options = _.extend({
            direction : 0 // float :: the instance's movement direction
            ,speed : 0 // float :: the instance's absolute speed in it's direction
            ,rotation : 0 // float :: the instance's this.__appearance rotation
            ,rotation_lag : 20 // int :: the number of steps it will take to turnTowards a target direction
        },options);
        
        if(options.appearance){
            this.setAppearance(options.appearance);
        }
        
        this._direction = options.direction;
        this._rotationLag = options.rotation_lag;
        this._speed = options.speed;
        this._rotation = options.rotation;
        this._collisionGroup = 'ENTITY';
        
        // -------------------------------
        
        // id is set by the world when it's inserted
        this.__id = null;
        this.__collisionGroupListening = {};
        
        this.__visible = true;           // boolean  :: is this instance visible
    }
    
    // draw is called by a view.
    // the view passes a callback function which is called IFF this instance is to be drawn
    // passed to that function is important information that will be forwarded to the Instance's this.__appearance
    ,draw : function(view, center_x, center_y){
        this.getAppearance().draw(
                view.getCanvas(), 
                center_x, 
                center_y, 
                view.getRotation() * this._rotation, 
                view.getScale(), 
                this
        );
    }
    ,preStep: function(worldClock){
        return;
    }
    ,step : function(worldClock){
        if(this._speed){
            this.getBounding().setCenter({
                x : this.getBounding().getCenter().x + this._speed * Math.cos(this.getDirection())
                ,y : this.getBounding().getCenter().y + this._speed * Math.sin(this.getDirection())
            });
            
            if(this.getAppearance()){
                this.getAppearance().getBounding().setCenter(this.getBounding().getCenter());
            }
        }
    }
    ,postStep: function(worldClock){
        return;
    }
/****************************************************************************
COLLISIONS AND COLLISION CHECKING
****************************************************************************/
    
    // this will return what collision group this entity belongs to
    ,getCollisionGroup : function(){
        return this._collisionGroup
    }
    
    ,getCollidableGroups : function(){
        return Object.keys(this.__collisionGroupListening);
    }
    
    // this function passes an other instance and signifies a collision has occurred
    // this instance then determines if it should react to the collision or not
    ,handleCollidedWith : function(other){
        var collisionFunction = this.objectIsCollidable(other);
        if(collisionFunction){
            collisionFunction.apply(this,[other]);
        }
    }
    
    ,groupIsCollidable : function(group){
        retVal = false;
        if(this.__collisionGroupListening[other]){
            retVal = this.__collisionGroupListening[other];
        }
        return retVal;
    }
    
    // this function will return the collision function for a passed Entity instance
    // or false IFF there is no corresponding collision function
    ,objectIsCollidable : function(other){
        var retVal = false;
        
        if(other instanceof TwoCylinder.Engine.Entity){
            _.each(this.__collisionGroupListening, function(collisionFunction,key){
                if(other.getCollisionGroup() == key){
                    retVal = collisionFunction;
                    return false;
                }
            });
        }
        
        return retVal;
    }
    
    // this will return true IFF this object is listening for collisions
    ,hasCollisionChecking : function(){
        return !_.isEmpty(this.__collisionGroupListening);
    }
    
    // ----------------------
    
    // this collision function handles collisions between this instance and instances of a specified Group
    ,onCollideGroup : function(group, callback){
        this.__collisionGroupListening[group] = callback;
    }
    
    ,offCollideGroup : function(group){
        delete this.__collisionGroupListening[group];
    }
    
/****************************************************************************
 GETERS AND SETTERS
 ****************************************************************************/
    
    ,getPosition : function(){
        return this.getBounding().getCenter();
    }
    
    /**
     * tuple can either be a boundingPoint, tuple (x & y) or just x (in which case y is y)
     */
    ,setPosition : function(tuple, y){
        if(tuple instanceof TwoCylinder.Engine.BoundingPoint){
            this.getBounding().updateBounding(tuple.getCenter());
        }else if(typeof(tuple) == 'object'){
            this.getBounding().updateBounding({x:tuple.x,y:tuple.y});
        }else{
            this.getBounding().updateBounding(tuple,y);
        }
    }
    
    // ----------------------
    
    /**
     * app is an Appearance object
     * when setting an this.__appearance object, you can also change the collision box by passing new collision dimensions
     * "box" can either be a tuple (width & height) or just width in which case h is height
     */
    ,setAppearance : function(app, h){
        this.__appearance = app;
    }
    
    // This function defines how to draw this instance
    ,getAppearance : function(){
        return this.__appearance; 
    }
    
    // ----------------------
    
    //TODO: I wonder if direction and speed should be represented with 1 object (vector)
    ,getDirection : function(){
        return this._direction;
    }
    
    ,rotateTowards : function(dir){
        var currentDirection = this.getDirection();
        var TAU = ( 2 * Math.PI );
        var directionDiff = (dir + TAU - currentDirection) % TAU;
        if (directionDiff <= (Math.PI) ){
            this.setDirection(currentDirection + (directionDiff / this._rotationLag));
        }else{
            this.setDirection(currentDirection - ( ( directionDiff - Math.PI ) / this._rotationLag));
        }
    }
    ,setDirection : function(dir){
        this._direction = dir;
        
        return this.getDirection();
    }
    
    // ----------------------
    
    ,getVisible : function(){
        return this.isVisible();
    }
    
    ,isVisible : function(){
        // must be in the world, visible, and with an appearance
        return this.__id && this.__visible && !!this.__appearance;
    }
    
    ,setVisible : function(vis){
        this.__visible =  vis;
    }
    
    // ----------------------
    
    ,getSpeed : function(){
        return this._speed;
    }
    
    ,setSpeed : function(speed){
        this._speed = speed;
    }
});