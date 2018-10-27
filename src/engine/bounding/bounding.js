/*
    Profiles are used to remove the ambiguity with determining bounding box
*/

const Root = require('../root')

class Bounding extends Root {
    constructor (options){
        super(options)
        this.rotation = 0;
        Object.entries(options).forEach((tuple) => {
            this[tuple[0]] = tuple[1]
        })
    }
    getCenter (){
        return { x : null, y : null };
    }
    setCenter (tuple){
        return null;
    }
    setCenterWithinContainer (tuple,bounding){
        // if not implemented, just set the center normal style
        return this.setCenter(tuple);
    }
    getContainingRectangle (){
        return { origin_x : null, origin_y : null, width : null, height : null};
    }
    getRotation (){
        return null;
    }
    setRotation (r){
        this.rotation = r;
    }
    updateBounding (key, value){
        if(typeof key === 'object'){
            Object.entries(key).forEach((tuple) => {
                this.updateBounding(...tuple)
            })
        }else{
            this[key] = value
        }
        return this;
    }
    collides (bounding){
        return false;
    }
}

module.exports = Bounding