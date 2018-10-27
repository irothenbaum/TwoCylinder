/*
    This script contains helper objects and functions that can be used by all classes
*/

TwoCylinder.Engine.Generic = TwoCylinder.Engine.Root.extend({
    initialize : function(options){
        this.setBounding(options.bounding);
    }
    ,collides : function(bounding){
        return this._bounding && this._bounding.collides(bounding);
    }
    ,getBounding : function(){
        return this._bounding;
    }
    ,setBounding : function(b){
        if(!b && ! (b instanceof TwoCylinder.Engine.Bounding)){
            throw "All objects must have a true bounding";
        }
        return this._bounding = b;
    }
});
