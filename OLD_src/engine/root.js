/*
    This script contains helper objects and functions that can be used by all classes
*/

(function(){
    function x(){};
    
    /* 
     * This extend function was based off of Backbone's extend function because it's so beautiful
     * http://backbonejs.org/
     * It uses the Surrogate pattern to inherit objects 
     * The biggest difference is that this version maintains a complete inheritance chain
     * in conjunction with the _super function, we can simulate true OOP inheritance
     */
    x.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;
        
        // The constructor function for the new subclass is either defined by you
        // (the "initialize" property in your `extend` definition), or defaulted
        // by us to simply call the parent constructor.
        child = function(){
            if (protoProps && _.has(protoProps, 'initialize')) {
                return protoProps.initialize.apply(this, arguments);
            }else{
                return parent.apply(this, arguments);
            }
        };
        
        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function and add the prototype properties.
        child.prototype = _.create(parent.prototype, protoProps);
        child.prototype.constructor = child;
        
        // here we construct the complete inheritance chain for this new class 
        child.parents = [];
        if(parent.parents){
            for(var i=0; i<parent.parents.length; i++){
                child.parents.push(parent.parents[i]);
            }
        }
        
        // we don't want x, we want Root to be the origin class
        if(parent !== x){
            child.parents.push(parent);
        }

        return child;
    };
    
    
    TwoCylinder.Engine.Root = x.extend({
        _super : function(functionName){
            this.parentalCount = this.parentalCount ? this.parentalCount : 1;
            
            var thisParentPosition = this.constructor.parents.length - this.parentalCount;
            
            if(thisParentPosition >= 0 && this.constructor.parents[thisParentPosition].prototype[functionName]){
                this.parentalCount++;
                 var retVal = this.constructor.parents[thisParentPosition].prototype[functionName].apply(this,_.rest(arguments));
                 this.parentalCount = null;
                 return retVal;
            }else{
                this.parentalCount = null;
            }
        }
    });

})();