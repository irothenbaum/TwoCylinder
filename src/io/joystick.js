/*
    This script handles drawing the joystick appearance
*/
TwoCylinder.IO.Joystick = TwoCylinder.IO.Touch.extend({
    initialize : function(options){
        this._defaultRadius = 40;
        options.tap_distance = 0;
        options.bounding = new TwoCylinder.Engine.BoundingCircle({
            x : options.x
            ,y : options.y
            ,radius : this._defaultRadius
        });
        this._super('initialize',options);
        
        this.__isHeld = false;
        
        this.__pullRatio = 1.8;
        
        // the operate function is what we will pass joystick motions to
        this.__operateFunction = null;
        
        this.__appearance = new TwoCylinder.Sprites.Joystick();
        
        var that = this;
        
        this._previousEvent = null;
        
        this.onDown(function(evt){
            that._previousEvent = evt; //initialize evt
            
            // we link to itself so that the joystick draws properly
            that._previousEvent.linkEvent(evt);
            
            that.getBounding().updateBounding({
                radius : 4 * that._defaultRadius
            });
            
            if(typeof(that.__operateFunction) == 'function'){
                if (evt.velocity) {
                    evt.velocity.setSpeed(0);
                }
                that.__operateFunction(evt);
            }
        });
        
        this.onUp(function(evt){
            that.getBounding().updateBounding({
                radius : that._defaultRadius
            });
            delete that._previousEvent;
            
            if(typeof(that.__operateFunction) == 'function'){
                if (evt.velocity) {
                    evt.velocity.setSpeed(0);
                }
                that.__operateFunction(evt);
            }
        });
        
        this.onMove(function(evt){
            if(that.isDown()){
                evt.linkEvent(that.__lastDown);
                if(typeof(that.__operateFunction) == 'function'){
                    //want to make the max speed the distance we allow the joystick to move
                    if (evt.velocity) {
                        evt.velocity.setSpeed(Math.min(evt.velocity.getSpeed(), that._defaultRadius / that.__pullRatio));
                    }
                    that.__operateFunction(evt);
                }
                that._previousEvent = evt;
            }
        });
    }
    ,onOperate : function(callback){
        this.__operateFunction = callback;
    }
    ,offOperate : function(){
        delete this.__operateFunction; 
    }
    ,getDrawOptions : function(){
        var options = {
            stick : this.getBounding().getCenter()
            ,operating : this.isDown()
        };
        
        if(this._previousEvent && this._previousEvent.velocity){
            var vector = _.clone(this._previousEvent.velocity);
            vector.setSpeed(Math.min(this._defaultRadius / this.__pullRatio, this._previousEvent.velocity.getSpeed()));
            options.stick = TwoCylinder.Engine.Geometry.pointFromVector(options.stick, vector);
        }
        
        return options;
    }
}); 