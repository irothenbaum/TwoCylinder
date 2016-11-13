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
        this.__particleEmitters = [];
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
            try{
                that.loop.apply(that,[]);
            } catch (e) {
                that.exit(e);
            }
        }, 1000 / this._fps);
    }
    
    ,__preStep : function(time){
        var i;

        // we have each instance perform a frame step. 
        for(i=0; i<this.__instances.length; i++){
            if(this.__instances[i]){
                this.__instances[i].preStep(time);
            }
        }
    }
    
    ,__postStep : function(time){
        var i;
        var obj;

            // we have each instance perform a frame step.
        for(i=0; i<this.__instances.length; i++){
            if(this.__instances[i]){
                obj = this.__instances[i].postStep(time);
            }
        }
    }
    
    ,loop : function(){
        this.__preStep(++this.__clock);
        var i;
        var j;
        var k;
        var part;
        var me;
        var other;
        var obj;
        var instanceCollisionGroups;
        var group;

        // we have each instance perform a frame step.
        for(i=0; i<this.__particleEmitters.length; i++){
            if(this.__particleEmitters[i]){
                part = this.__particleEmitters[i];
                part.step(this.__clock);
            }
        }

        // we have each instance perform a frame step. 
        for(i=0; i<this.__instances.length; i++){
            if(this.__instances[i]){
                obj = this.__instances[i];
                obj.step(this.__clock);
            }
        }

        // check for collisions
        for(i=0; i<this.__instances.length; i++){
            if(this.__instances[i].hasCollisionChecking()){
                me = this.__instances[i];
                instanceCollisionGroups = me.getCollidableGroups();
                
                // for each group, we want to search each of the elements in the world of that group
                for(j=0; j<instanceCollisionGroups.length; j++){
                    group = instanceCollisionGroups[j];
                    if(this.__collisionGroups[group] && this.__collisionGroups[group].length){
                        for(k=0; k<this.__collisionGroups[group].length; k++){
                            other = this.__collisionGroups[group][k];
                            
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
        for(i=0; i<this.__views.length; i++){
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
        var i;
        if(instance.__id){
            this.__removeFromCollisionGroup(instance);
            for(i=0; i<this.__instances.length; i++){
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
PARTICLE FUNCTIONS
****************************************************************************/
   ,addParticleEmitter : function(particle){
       var that = this;
       this.__particleEmitters.push(particle);
       
       if (particle.getLifetime() > 0) {
           setTimeout(function(){
               that.ParticleEmitter(particle);
           },particle.getLifetime());
       }
       
       return particle;
   }
   
   ,removeParticleEmitter : function(particle){
       // TODO?
   }

   ,getParticleEmitters : function() {
        return this.__particleEmitters;
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
        var i;
        var group = instance.getCollisionGroup();

        for(i=0; i<this.__collisionGroups[group].length; i++){
            if(this.__collisionGroups[group][i].__id == instance.__id){
                this.__collisionGroups[group].splice(i,1);
                break;
            }
        }
    }
});