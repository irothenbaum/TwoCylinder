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
        this.__key = 0;
    }
    ,getCanvas : function(){
        return this.__canvas;
    }

    ,clearCanvas : function(){
        this.__canvas.getContext('2d').clearRect(0,0,this.__canvas.width,this.__canvas.height);
    }
    ,draw : function(time){
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
        var instances = this.__world.getInstances();
        for(var i=0; i < instances.length; i++){
            var inst = instances[i];
            
            // skip invisible instances
            if(!inst.isVisible()){
                continue;
            }
            
            // if this instance's appearance is inside this view box
            if( this.collides( inst.getAppearance().getBounding() ) ){
                var that = this;
                //then we draw the instance with this view's translations & transformations included
                inst.draw(
                    this.__canvas
                    ,inst.getBounding().getCenter().x - this.getBounding().getContainingRectangle().origin_x
                    ,inst.getBounding().getCenter().y - this.getBounding().getContainingRectangle().origin_y
                    ,this._rotation
                    ,this._scale
                );
            }
        }
        
        //now we loop through the IO handlers for this view
        var ios = this.getIOs();
        for(var i=0; i<ios.length; i++){
            ios[i].draw();
        }
    }
    ,setWorld : function(world){
        this.__world = world;
    }
/****************************************************************************
IO FUNCTIONS
****************************************************************************/    
    ,removeIO : function(io){
        if(io.__id){
            for(var i=0; i<this.__instances; i++){
                if(this.__instances[i].__id == instance.__id){
                    delete this.__instances[i];
                    break;
                }
            }
        }
        
        return io;
    }
    ,addIO: function(io){
        if(!io.__id){
            io.__id = ++this.__key;
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