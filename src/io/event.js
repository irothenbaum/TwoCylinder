/*
    This script creates a basic user interface
*/

const BoundingPoint = require('../engine/bounding/bounding_point')
const Geometry = require('../engine/utilities').Geometry

class Event extends BoundingPoint {
    static EVENT_TYPES = {
        TAP : 'tap',
        DOUBLE : 'doubletap',
        LONG :'longtap',
        MOVE : 'mousemove',
        UP : 'mouseup',
        DOWN : 'mousedown'
    }

    constructor (evt, view){
        super (evt, view)
        // -----------------------------------------------------
        // This part was taken from Stack Overflow
        // http://stackoverflow.com/questions/8389156
        let el = evt.target,
            x = 0,
            y = 0

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft
            y += el.offsetTop - el.scrollTop
            el = el.offsetParent
        }
        // -----------------------------------------------------
        
        this._super('initialize',{
            x : evt.clientX - x
            ,y : evt.clientY - y
        })
        
        if (view){
            this.world_x = this.x + view.getBounding().origin_x
            this.world_y = this.y + view.getBounding().origin_y
            let rect = view.getCanvas().getBoundingClientRect()
            this.device_x = this.x + rect.left
            this.device_y = this.y + rect.top
        }
        
        this.timestamp = Date.now()
    }
    linkEvent (evt){
        // we want them to only link events
        if(evt instanceof Event){
            this.linked_event = evt; 
            this.velocity = Geometry.pointToPoint(this.linked_event, this)
        }
        
        return this
    }
    setType (eventType){
        if(Event.EVENT_TYPES.values().indexOf(eventType) === -1){
            throw "Invalid event type"
        }
        this.type = eventType
        return this
    }
    getType (){
        return this.type ? this.type : null;
    }
}


module.exports = Event