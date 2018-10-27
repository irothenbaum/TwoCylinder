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
        this.__views = [];

        this.__toRemoveParticleEmitters = [];
        this.__toRemoveInstances = [];
        this.__toRemoveViews = [];

        this.__collisionGroups = {};
        this.__background = options.background || new TwoCylinder.Engine.Background();
        
        this.__instanceKey = 0;
        this.__viewKey = 0;
        this.__emitterKey = 0;
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
        // we have each instance perform a frame step.
        _.each(this.__instances, function(inst){
            inst.preStep(time);
        });
    }
    
    ,__postStep : function(time){
        // we have each instance perform a frame step.
        _.each(this.__instances, function(inst){
            inst.postStep(time);
        });

        this.__removeParticleEmitters();
        this.__removeViews();
        this.__removeInstances();
    }
    
    ,loop : function(){
        this.__preStep(++this.__clock);
        var that = this;

        // we have each instance perform a frame step.
        _.each(this.__particleEmitters, function(part) {
            part.step(that.__clock);
        });

        // we have each instance perform a frame step.
        _.each(this.__instances, function(inst) {
            inst.step(that.__clock);
        });

        // check for collisions
        _.each(this.__instances, function(me) {
            if (me.hasCollisionChecking()) {
                var myCollisionGroups = me.getCollidableGroups();
                _.each(myCollisionGroups, function(group){
                    // if there are instances that match the groups im listening for
                    if (that.__collisionGroups[group] && that.__collisionGroups[group].length) {

                        // for each of those matching instance types,
                        _.each(that.__collisionGroups[group], function(other){

                            // if they're not me, and I collide with them
                            if (me.__id != other.__id && me.collides(other.getBounding())) {
                                me.handleCollidedWith(other);
                            }
                        });
                    }
                });
            }
        });

        // draw the views
        _.each(this.__views, function(view){
            view.draw(that.__clock);
        });

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
            // we add their id to the array of instances to remove
            this.__toRemoveInstances.push(instance.__id);
        }
        return instance;
    }
    ,__removeInstances : function() {
        if (!this.__toRemoveInstances.length) {
            return;
        }
        var i;
        var j;
        for (i=0; i<this.__toRemoveInstances.length; i++) {
            for(j=0; j<this.__instances.length; j++){
                if(this.__instances[j].__id == this.__toRemoveInstances[i]){
                    this.__removeFromCollisionGroup(this.__instances[j]);
                    delete this.__instances[j].__id;
                    this.__instances.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveInstances = [];
    }
    
    ,addInstance : function(instance){
        if(instance.__id){
            throw "Instance already added";
        }
        instance.__id = ++this.__instanceKey;
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
        if (view.__id) {
            throw "View already added";
        }
        view.__id = ++this.__viewKey;
        view.setWorld(this);
        this.__views.push(view);
        
        return view;
    }
    
    ,getViews : function(){
        return this.__views;
    }

    ,__removeViews : function() {
        if (!this.__toRemoveViews.length) {
            return;
        }
        var i;
        var j;
        for (i=0; i<this.__toRemoveViews.length; i++) {
            for(j=0; j<this.__views.length; j++){
                if(this.__views[j].__id == this.__toRemoveViews[i]){
                    delete this.__views[j].__id;
                    this.__views.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveViews = [];
    }
    
    ,removeView : function(view){
        if(view.__id) {
            // we add their id to the array of views to remove
            this.__toRemoveViews.push(view.__id);
        }
        return view;
    }
    
/****************************************************************************
PARTICLE FUNCTIONS
****************************************************************************/
    ,addParticleEmitter : function(emitter){
        if (emitter.__id){
            throw "Emitter already added";
        }
        emitter.__id = ++this.__emitterKey;
        this.__particleEmitters.push(emitter);
        return emitter;
    }

    ,removeParticleEmitter : function(emitter){
        if (emitter.__id) {
            // we add their id to the array of emitters to remove
            this.__toRemoveParticleEmitters.push(emitter.__id);
        }
        return emitter;
    }
    ,__removeParticleEmitters : function(){
        if (!this.__toRemoveParticleEmitters.length) {
            return;
        }
        var i;
        var j;
        for(i=0; i<this.__toRemoveParticleEmitters.length; i++) {
            for(j=0; j<this.__particleEmitters.length; j++){
                if(this.__particleEmitters[j].__id == this.__toRemoveParticleEmitters[i]){
                    delete this.__particleEmitters[j].__id;
                    this.__particleEmitters.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveParticleEmitters = [];
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