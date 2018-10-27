// CircleProfiles need a center point and a radius

const Bounding = require('bounding')
const Geometry = require('../utilities').Geometry
const BoundingBox = require('bounding_box')
const BoundingPoint = require('bounding_point')

class BoundingCircle extends Bounding {
    getCenter (){
        return { x : this.x, y : this.y };
    }
    setCenter (tuple){
        this.x = tuple.x;
        this.y = tuple.y;
    }
    getContainingRectangle (){
        return{
            origin_x : this.x - this.radius
            ,origin_y : this.y - this.radius
            ,width : 2 * this.radius
            ,height : 2 * this.radius
        }
    }
    collides (bounding){
        if(bounding instanceof BoundingBox){
            return Geometry.circleCollidesBox(this,bounding)
        }else if(bounding instanceof BoundingCircle){
            return Geometry.circleCollidesCircle(this,bounding);
        }else if(bounding instanceof BoundingPoint){
            return Geometry.circleCollidesPoint(this,bounding);
        }else if(bounding instanceof Bounding){
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return Geometry.circleCollidesPoint(this, bounding);
        }
    }
}

module.exports = BoundingCircle