/*
    This script defines a this.__world's view.
    Views are attached to this.__worlds and help determine which instances should be drawn to the this.__canvas and where
*/

TwoCylinder.Engine.View = TwoCylinder.Engine.Generic.extend({
    initialize: function(options){
        this._super('initialize',options);
        this.__canvas = options.canvas;
        
        this._rotation = options.rotation || 0;
        this._scale = options.scale || 1;
        this._resolution = options.resolution || 1;
        
        this.__canvas.width = this.getBounding().width * this._resolution;
        this.__canvas.height = this.getBounding().height * this._resolution;
        this.__canvas.style.width = this.getBounding().width + "px";
        this.__canvas.style.height = this.getBounding().height + "px";
        
        this.__followInstance = false;
        
        this.__ios = [];
        this.__ioKey = 0;

        // id is set by the world when it's inserted
        this.__id = null;
    }
    ,clearCanvas : function(){
        this.__canvas.getContext('2d').clearRect(0,0,this.__canvas.width,this.__canvas.height);
    }
    ,draw : function(time){
        var i;
        var instances;
        var inst;
        var particles;
        var part;
        var ios;

        // before we draw, we want to re-center on our tracked instance if we have one
        if(this.__followInstance){
            this.getBounding().setCenterWithinBounding(
                this.__followInstance.getBounding().getCenter()
                , this.__world.getBounding()
            );
        }
        
        // prepare to draw
        this.clearCanvas();
        
        // first draw the world's background
        this.__world.getBackground().draw(this);
        
        // get all instances and loop through them
        instances = this.__world.getInstances();
        for(i=0; i < instances.length; i++){
            inst = instances[i];

            // skip invisible instances
            if(!inst.isVisible()){
                continue;
            }
            
            // if this instance's appearance is inside this view box
            // NOTE: we check the appearance's bounding because it may be desirable for the calculated collision box
            // to be different from what is considered visible. for example, if the appearance draws shadows
            // those shadows might not be collidable with other entities, but should be included in
            // determining whether or not to draw the entity to a view.
            if( this.collides( inst.getAppearance().getBounding() ) ){
                //then we draw the instance and pass the view so it can reference the view's
                //transitions and transformation (rotation, scale, etc)
                inst.draw(
                    this
                    ,inst.getBounding().getCenter().x - this.getBounding().getContainingRectangle().origin_x
                    ,inst.getBounding().getCenter().y - this.getBounding().getContainingRectangle().origin_y
                );
            }
        }

        // Draw each particle emitter
        particles = this.__world.getParticleEmitters();
        for (i=0; i<particles.length; i++) {
            part = particles[i];
            if (this.collides(part.getBounding())) {
                part.draw(
                    this,
                    part.getBounding().getCenter().x - this.getBounding().getContainingRectangle().origin_x,
                    part.getBounding().getCenter().y - this.getBounding().getContainingRectangle().origin_y
                )
            }
        }
        
        //now we loop through the IO handlers for this view
        ios = this.getIOs();
        for(i=0; i<ios.length; i++){
            ios[i].draw();
        }
    }
/****************************************************************************
GETTER AND SETTER FUNCTIONS
****************************************************************************/
    ,getCanvas : function(){
        return this.__canvas;
    }
    ,getWorld : function(){
        return this.__world;
    }
    ,setWorld : function(world){
        this.__world = world;
    }
    ,getRotation : function(){
        return this._rotation;
    }
    ,setRotation : function(r){
        this._rotation = r;
    }
    ,getScale : function(){
        return this._scale;
    }
    ,setScale : function(s){
        this._scale = s;
    }
/****************************************************************************
IO FUNCTIONS
****************************************************************************/    
    ,removeIO : function(io){
        if(io.__id){
            for(var i=0; i<this.__instances; i++){
                if(this.__instances[i].__id == io.__id){
                    delete this.__instances[i];
                    break;
                }
            }
        }
        
        return io;
    }
    ,addIO: function(io){
        if(!io.__id){
            io.__id = ++this.__ioKey;
        }else{
            // should make sure it isn't already in the array
            this.removeIO(io);
        }
        
        this.__ios.push(io);
       
        return io;
    }
   
    ,getIOs : function(){
        return this.__ios;
    }
    
    // this gets the mouse position by world, view, and device OR any one of them as an x,y tuple
    ,getMousePosition : function(evt) {
        return new TwoCylinder.IO.Event(evt, this);
    }
    
    ,followInstance : function(instance){
        if(instance){
            this.__followInstance = instance;
        }else{
            this.__followInstance = false;
        }
    }
});