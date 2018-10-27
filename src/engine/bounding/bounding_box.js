// RectangleProfiles need an origin x,y and a width and height
const Bounding = require('./bounding')
const Geometry = require('../utilities').Geometry
const BoundingCircle = require('./bounding_circle')
const BoundingPoint = require('./bounding_point')

class BoundingBox extends Bounding {
    getCenter (){
        return {
            x : this.origin_x + (this.width / 2)
            , y : this.origin_y + (this.height / 2)
        };
    }
    setCenter (tuple){
        this.origin_x = tuple.x - (this.width / 2);
        this.origin_y = tuple.y - (this.height / 2);
    }
    // TODO: This won't work properly with circles... Perhaps move it to the Geometry function and treat it like collisions
    setCenterWithinBounding (tuple, bounding){
        let containingBox = bounding.getContainingRectangle();
        let myBox = this.getContainingRectangle();
        
        
        let targetX = tuple.x;
        let targetY = tuple.y;
        
        if(containingBox.width < myBox.width){
            targetX = bounding.getCenter().x;
        }else{
            // to center within we take the min between x and the containingbox edge - 1/2 my width
            targetX = Math.min(tuple.x, containingBox.origin_x + containingBox.width - (myBox.width/2) );
            // then max it with the same on the other end
            targetX = Math.max(targetX, containingBox.origin_x + (myBox.width/2));
            // this ensures, when centered, our left and right edges do not cross the containingBox borders 
        }
        
        // Then, do it again for height
        
        if(containingBox.height < myBox.height){
            targetY = bounding.getCenter().y;
        }else{
            // to center within we take the min between x and the containingbox edge - 1/2 my width
            targetY = Math.min(tuple.y, containingBox.origin_y + containingBox.height - (myBox.height/2) );
            // then max it with the same on the other end
            targetY = Math.max(targetY, containingBox.origin_y + (myBox.height/2));
            // this ensures, when centered, our left and right edges do not cross the containingBox borders
        }
        
        this.setCenter({ x : targetX , y : targetY });
    }

    getContainingRectangle (){
        return {
            origin_x : this.origin_x
            ,origin_y : this.origin_y
            ,width : this.width
            ,height : this.height
        };
    }

    collides (bounding){
        if(bounding instanceof BoundingBox){
            return Geometry.boxCollidesBox(this,bounding)
        }else if(bounding instanceof BoundingCircle){
            return Geometry.boxCollidesCircle(this,bounding);
        }else if(bounding instanceof BoundingPoint){
            return Geometry.boxCollidesPoint(this,bounding);
        }else if(bounding instanceof Bounding){
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return Geometry.boxCollidesPoint(this, bounding);
        }
    }
}

module.exports = BoundingBox