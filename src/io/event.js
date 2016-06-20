/*
    This script creates a basic user interface
*/

TwoCylinder.IO.Event = TwoCylinder.Engine.BoundingPoint.extend({
    initialize : function(evt, view){
        // -----------------------------------------------------
        // This part was taken from Stack Overflow
        // http://stackoverflow.com/questions/8389156
        var el = evt.target,
            x = 0,
            y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        // -----------------------------------------------------
        
        this._super('initialize',{
            x : evt.clientX - x
            ,y : evt.clientY - y
        });
        
        if(view){
            this.world_x = this.x + view.getBounding().origin_x;
            this.world_y = this.y + view.getBounding().origin_y;
            var rect = view.getCanvas().getBoundingClientRect();
            this.device_x = this.x + rect.left;
            this.device_y = this.y + rect.top;
        }
        
        this.timestamp = Date.now();
    }
    ,linkEvent(evt){
        // we want them to only link events
        if(evt instanceof TwoCylinder.IO.Event){
            this.linked_event = evt; 
            
            this.angle = TwoCylinder.Engine.Geometry.angleToPoint(this.linked_event, this);
            this.speed = TwoCylinder.Engine.Geometry.distanceToPoint(this.linked_event, this);
        }
        
        return this;
    }
    ,setType : function(eventType){
        if( _.indexOf(_.values(TwoCylinder.IO.EVENT_TYPES), eventType) !== -1){
            this.type = eventType;
            return this;
        }else{
            return false;
        }
    }
    ,getType : function(){
        if(this.type){
            return this.type;
        }else{
            return null;
        }
    }
});
