/*
    This script creates a basic user interface
*/
TwoCylinder.IO.Touch = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        this.__view = options.view;
        
        //by default the touch location is the full canvas
        options = _.extend({
            bounding : this.__view.getBounding()
            ,double : 300
            ,tap : 300
            ,tap_distance : 20
        }, options);
        
        this.setBounding(options.bounding);
        
        this._doubleTapThreshold = options.double;
        this._tapThreshold = options.tap;
        this._tapDistanceThreshold = options.tap_distance;
        this._longTapCancel = 2 * this._tapThreshold;
        
        // absolute touch boxes are bound to the world which means the calculate touching
        // via worldy coordinate systems as opposed to the view's relative coordinates [default]
        if(options.absolute){
            this.__boundToWorld = true
        }
        
        // these events store the last events -- TODO : Maybe make them arrays? Store the trailinge events?
        this._lastUp = null;
        this._lastDown = null;
        this._lastMove = null;
        
        var that = this;
        // create a listener for each type of event
        _.each(TwoCylinder.IO.EVENT_TYPES,function(val){
            that.__getListenersByType.call(that,val);
        });
        
        // id is set by the view when the touch object is inserted
        this.__id;
        
        // key is used to track touch listeners
        this.__key = 0;
        
        // used to check if the touch is currently down
        this.__isDown = false;
        
        // What follows are the browser event binding calls
        this.__view.getCanvas().addEventListener('mousedown',function(evt){
            that._handleDown.apply(that,arguments);
        },false);
        this.__view.getCanvas().addEventListener('touchstart',function(evt){
            evt.preventDefault();
            that._handleDown.apply(that,arguments);
        },false);
        
        this.__view.getCanvas().addEventListener('mouseup',function(evt){
            that._handleUp.apply(that,arguments);
        },false);
        this.__view.getCanvas().addEventListener('touchend',function(evt){
            evt.preventDefault();
            that._handleUp.apply(that,arguments);
        },false);
        
        this.__view.getCanvas().addEventListener('mousemove',function(evt){
            that._handleMove.apply(that,arguments);
        },false);
        this.__view.getCanvas().addEventListener('touchmove',function(evt){
            evt.preventDefault();
            that._handleMove.apply(that,arguments);
        },false);
    }
    /*
     * This function can be overriden by extended objects, but by default we do nothing
     */
    ,draw : function(){
        return true;
    }
    /*
     * Appearance will be important for extended objects wishing to give the touch zones a visual represenation
     */
    ,setAppearance : function(app){
        this.__appearance = app;
    }
    
    /*
     * These function receive a browser event and determin whether or not
     * to fire an IO event to listeners based on collision type, location, and touch state
     * They are also responsible with properly formatting the IO event (determining if it's
     * a single tap, double tap, move, etc...)
     */
    ,_handleDown : function(evt){
        var event = this.__formatTouchEvent(evt);
        if(!event){
            return;
        }
        event.setType(TwoCylinder.IO.EVENT_TYPES.DOWN);

        this.__isDown = true;
        this.__lastDown = event;
        this.__fireEvent(event);
    }
    ,_handleUp : function(evt){
        var event = this.__formatTouchEvent(evt);
        if(!event){
            return;
        }
        
        if(!this.isDown()){
            return;
        }
        
        // found is used to determine if we've already assigned a type to this event before checking for others
        // it's really just a helper variable so we can avoid deeply nested if / else ifs
        var found = false;
        
        // first we check for DOUBLE tap
        if( this.__lastUp 
            && this.__lastUp.type == TwoCylinder.IO.EVENT_TYPES.TAP 
            && (this.__lastUp.timestamp - event.timestamp) <= this._doubleTapThreshold
        ){
            event.setType(TwoCylinder.IO.EVENT_TYPES.DOUBLE);
            found = true;
        }
        
        // next we check for LONG tap
        if(!found && this.__lastDown && (TwoCylinder.Engine.Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold)){
            var lastDownDiff = event.timestamp - this.__lastDown.timestamp;
            if(lastDownDiff <= this._tapThreshold){
                event.setType(TwoCylinder.IO.EVENT_TYPES.TAP);
                found = true;
            }else if(lastDownDiff <= this._longTapCancel){
                event.setType(TwoCylinder.IO.EVENT_TYPES.LONG);
                found = true;
            }else{
                // do nothing, we're cancelling the long click
            }
        }
        
        // at this point, it must be the end of a move, so we give it a default
        if(!found){
            event.setType(TwoCylinder.IO.EVENT_TYPES.UP);
        }
        
        event.linkEvent(this.__lastDown);
        this.__lastUp = event;
        this.__fireEvent(event);
        this.__isDown = false;
    }
    ,_handleMove : function(evt){
        if( !this.isDown()){
            return;
        }
        
        var event = this.__formatTouchEvent(evt);
        if(!event){
            return;
        }
        
        if( 
            ( (event.timestamp - this.__lastDown.timestamp) <= this._longTapCancel)
            &&
            (TwoCylinder.Engine.Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold)
        ){
            // if they haven't moved their finger enough and we're within the longtap threshold
            return;
        }
            
        event.setType(TwoCylinder.IO.EVENT_TYPES.MOVE);
        event.linkEvent(this.__lastMove);
        this.__lastMove = event;
        this.__fireEvent(event);
        
    }
    /*
     * This function takes an IO Event and fires it to all bound listeners of its type
     */
    ,__fireEvent : function(event){
        var handlers = this.__getListenersByType(event.getType());
        if(handlers.length){
            for(var i=0; i<handlers.length; i++){
                handlers[i].callback(event);
            }
        }
    }
    /*
     * This function will be used to queue previous events to  store a history rather than just
     * the last one (lastMove, lastUp, lastDown)
     */
    ,__queueHistory : function(group,event){
        group[0] = group[0].toUpperCase();
        this['__last'+group].push(event);
        this['__last'+group].shift();
        return null;
    }
    
    /*
     * This function might be uneeded? It basically adds all listeners to an array so we can
     * potentially more easily track them (by key)
     */
    ,__formatListener : function(callback){
        return {
            key : ++this.__key
            ,callback : callback
        }
    }
    /*
     * This function takes a browser event (mouse or touch) and converts it into a TwoCylinder IO event
     * IFF it registered a collision with this touch space else it returns false 
     */ 
    ,__formatTouchEvent : function(evt){
        //TODO: I'm not sure if this.collides will work for views that are not origin_x = 0, origin_y = 0
        // BECAUSE, I think the event's x and y is relative to the device and the touch instance is relative
        // to the world view (I THINK)
        
        // changed Touches is used for multitouch... ?
        // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
        
        var touches = evt.changedTouches ? evt.changedTouches : touches;
        
        if(touches && touches.length){
            var event = false;
            var step = 0;
            
            do{
                if(step < touches.length){
                    evt.clientX = touches[step].clientX;
                    evt.clientY = touches[step].clientY;
                }else{
                    return false;
                }
                event = new TwoCylinder.IO.Event(evt,this.__view);
                step++;
            }while(!this.collides(event));
        }else{
            event = new TwoCylinder.IO.Event(evt,this.__view);
            if(!this.collides(event)){
                return false;
            }
        }
                
        return event;
    }
    /*
     * This function returns all bound listeners based on type
     */
    ,__getListenersByType : function(type){
        if(!type){
            return null;
        }
        if(!_.has(this, '__'+type+'Listeners')){
            this['__'+type+'Listeners'] = [];
        }
        return this['__'+type+'Listeners'];
    }
    
    /*
     * This function is used to bind a handler to a certain type of IO event
     */
    ,__on(type,callback){
        var array = this.__getListenersByType(type);
        array.push(this.__formatListener(callback));
    }
    /*
     * This function removes a passed binding
     */
    ,__off(type,callback){
        var array = this.__getListenersByType(type);
        for(var i=0; i<array.length; i++){
            if(array[i].callback === callback){
                delete array[i];
            }
        }
    }
    
    /*
     * The following are helper functions to make calling __on and __off more semantic
     */
    ,onDouble : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.DOUBLE,callback);
    }
    ,offDouble : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.DOUBLE,callback);
    }
    ,onLong : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.LONG,callback);
    }
    ,offLong : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.LONG,callback);
    }
    
    ,onTap : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.TAP,callback);
    }
    ,offTap : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.TAP,callback);
    }
    
    ,onDown : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.DOWN,callback);
    }
    ,offDown : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.DOWN,callback);
    }
    
    ,onMove : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.MOVE,callback);
    }
    ,offMove : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.MOVE,callback);
    }
    
    ,onUp : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.UP,callback);
    }
    ,offUp : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.UP,callback);
    }
    
    /*
     * This function can determine if this touch instance is being actively engaged
     */
    ,isDown : function(){
        return this.__isDown;
    }
});
