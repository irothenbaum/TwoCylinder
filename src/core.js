(function (root, factory) {
    if(typeof module === "object" && module.exports){
        module.exports = factory(require("_"));
    } else if(typeof define === "function" && define.amd){
        define("TwoCylinder",["_"], factory);
    } else {
        root["TwoCylinder"] = factory(root._);
    }
}(this, function(_) {
    return new function(){
        var TwoCylinder = this;
        
        this.Engine = {};
        this.Entities = {};
        this.IO = {};
        this.Sprites = {};
        
        /*
         * Library files go here
         */
    };
}));

