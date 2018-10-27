// CircleProfiles need a center point and a radius

const Bounding = require('bounding')
const Geometry = require('../utilities').Geometry
const BoundingBox = require('bounding_box')
const BoundingCircle = require('bounding_circle')

class BoundingPoint extends Bounding {
    getCenter (){
        return { x : this.x, y : this.y };
    }
    setCenter (tuple){
        this.x = tuple.x
        this.y = tuple.y
    }
    getContainingRectangle (){
        return{
            origin_x : this.x
            ,origin_y : this.y
            ,width : 0
            ,height : 0
        }
    }
    collides (bounding){
        if(bounding instanceof BoundingBox){
            return Geometry.pointCollidesBox(this,bounding)
        }else if(bounding instanceof BoundingCircle){
            return Geometry.pointCollidesCircle(this,bounding)
        }else if(bounding instanceof BoundingPoint){
            return Geometry.pointCollidesPoint(this,bounding)
        }else if(bounding instanceof Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this)
        }else{ // treat bounding like a tuple
            return Geometry.circleCollidesPoint(this, bounding)
        }
    }
}


module.exports = BoundingPoint