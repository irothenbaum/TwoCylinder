/*
    This script sets up the world canvas.
    Pass options to this object defining things like framerate, dimensions, etc
*/

TwoCylinder.Engine.World = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        options.bounding = new TwoCylinder.Engine.BoundingBox({
            origin_x : 0
            ,origin_y : 0
            ,width : options.width
            ,height : options.height
        });
        this._super('initialize',options);
        this._fps = options.fps || 30;
        
        this.__instances = [];
        this.__collisionGroups = {};
        this.__views = [];
        this.__background = options.background || new TwoCylinder.Engine.Background();
        
        this.__key = 0;
        this.__clock = 0;
    }
    
/****************************************************************************
 CONTROLLER FUNCTIONS
 ****************************************************************************/
    //TODO: Needs to somehow sync touch events up with the game clock
    ,start : function(){
        var that = this;
        this.__intervalId = setInterval(function(){
            that.loop.apply(that,[]);
        }, 1000 / this._fps);
    }
    
    ,__preStep : function(time){
        // we have each instance perform a frame step. 
        for(var i=0; i<this.__instances.length; i++){
            if(this.__instances[i]){
                this.__instances[i].preStep(time);
            }
        }
    }
    
    ,__postStep : function(time){
        // we have each instance perform a frame step. 
        for(var i=0; i<this.__instances.length; i++){
            if(this.__instances[i]){
                var obj = this.__instances[i].postStep(time);
            }
        }
    }
    
    ,loop : function(){
        this.__preStep(++this.__clock);
        
        // we have each instance perform a frame step. 
        for(var i=0; i<this.__instances.length; i++){
            if(this.__instances[i]){
                var obj = this.__instances[i];
                obj.step(this.__clock);
            }
        }
        
        // check for collisions
        for(var i=0; i<this.__instances.length; i++){
            if(this.__instances[i].hasCollisionChecking()){
                var me = this.__instances[i];
                var instanceCollisionGroups = me.getCollidableGroups();
                
                // for each group, we want to search each of the elements in the world of that group
                for(var j=0; j<instanceCollisionGroups.length; j++){
                    var group = instanceCollisionGroups[j];
                    if(this.__collisionGroups[group] && this.__collisionGroups[group].length){
                        for(var k=0; k<this.__collisionGroups[group].length; k++){
                            var other = this.__collisionGroups[group][k];
                            
                            // cannot collide with self
                            if( me.__id == other.__id ){
                                continue;
                            }

                            // if their collision boxes touch, we issue a collision
                            if(me.collides(other.getBounding())){
                                me.handleCollidedWith(other);
                            }
                        }
                    }
                }
            }
        }
        
        // for every view attached to this world, we have them draw
        for(var i=0; i<this.__views.length; i++){
            if(this.__views[i]){
                this.__views[i].draw(this.__clock);
            }
        }
        this.__postStep(this.__clock);
    }
    
    ,exit : function(){
        clearInterval(this.__intervalId);
        
        //TODO: handle exit
    }
    
/****************************************************************************
 INSTANCE FUNCTIONS
 ****************************************************************************/    
    ,removeInstance : function(instance){
        if(instance.__id){
            this.__removeFromCollisionGroup(instance);
            for(var i=0; i<this.__instances.length; i++){
                if(this.__instances[i].__id == instance.__id){
                    this.__instances.splice(i,1);
                    break;
                }
            }
        }
        return instance;
    }
    
    ,addInstance : function(instance){
        if(!instance.__id){
            instance.__id = ++this.__key;
        }else{
            // should make sure it isn't already in the array
            this.removeInstance(instance);
        }
        // add it to the big list
        this.__instances.push(instance);
        // also add it according to its collision group
        this.__addToCollisionGroup(instance);
        
        return instance;
    }
    
    ,getInstances : function(){
        return this.__instances;
    }
    
/****************************************************************************
 VIEW FUNCTIONS
 ****************************************************************************/
    ,addView : function(view){
        view.setWorld(this);
        this.__views.push(view);
        
        return view;
    }
    
    ,getViews : function(){
        return this.__views;
    }
    
    ,removeView : function(view){
        // TODO?
    }
    
/****************************************************************************
BACKGROUND FUNCTIONS
****************************************************************************/
    ,setBackground : function(background){
        this.__background = background;
    }
    
    ,getBackground : function(){
        return this.__background;
    }
/****************************************************************************
HELPER FUNCTIONS
****************************************************************************/    
    ,__addToCollisionGroup : function(instance){
        var group = instance.getCollisionGroup();
        if(!this.__collisionGroups[group]){
            this.__collisionGroups[group] = [];
        }
        this.__collisionGroups[group].push(instance);
    }
    ,__removeFromCollisionGroup : function(instance){
        var group = instance.getCollisionGroup();
        for(var i=0; i<this.__collisionGroups[group].length; i++){
            if(this.__instances[i].__id == instance.__id){
                this.__collisionGroups[group].splice(i,0);
                break;
            }
        }
    }
});