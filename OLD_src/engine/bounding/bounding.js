/*
    Profiles are used to remove the ambiguity with determining bounding box
*/

TwoCylinder.Engine.Bounding = TwoCylinder.Engine.Root.extend({
    initialize : function(options){
        this._properties = [];
        this.rotation = 0;
        
        var that = this;
        _.each(options, function(v,k){
            that._properties.push(k);
        });
        
        this.updateBounding(options);
    }
    ,getCenter : function(){
        return { x : null, y : null };
    }
    ,setCenter : function(tuple){
        return null;
    }
    ,setCenterWithinContainer : function(tuple,bounding){
        // if not implemented, just set the center normal style
        return this.setCenter(tuple);
    }
    ,getContainingRectangle : function(){
        return { origin_x : null, origin_y : null, width : null, height : null};
    }
    ,getRotation : function(){
        return null;
    }
    ,setRotation : function(r){
        this.rotation = r;
    }
    ,updateBounding : function(key, value){
        if(typeof(key) == 'object'){
            var that = this;
            _.each(key, function(v, k){
                if(~_.indexOf(that._properties,k)){
                    that[k] = v; 
                }
            });
        }else{
            if(~_.indexOf(this._properties,key)){
                this[key] = value; 
            }
        }
        return this;
    }
    ,collides : function(bounding){
        return false;
    }
});
