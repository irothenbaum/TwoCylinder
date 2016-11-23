// CircleProfiles need a center point and a radius
TwoCylinder.Engine.BoundingCircle = TwoCylinder.Engine.Bounding.extend({
    getCenter : function(){
        return { x : this.x, y : this.y };
    }
    ,setCenter : function(tuple){
        this.x = tuple.x;
        this.y = tuple.y;
    }
    ,getContainingRectangle : function(){
        return{
            origin_x : this.x - radius
            ,origin_y : this.y - radiuis
            ,width : 2 * this.radius
            ,height : 2 * this.radius
        };
    }
    ,collides : function(bounding){
        if(bounding instanceof TwoCylinder.Engine.BoundingBox){
            return TwoCylinder.Engine.Geometry.circleCollidesBox(this,bounding)
        }else if(bounding instanceof TwoCylinder.Engine.BoundingCircle){
            return TwoCylinder.Engine.Geometry.circleCollidesCircle(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.BoundingPoint){
            return TwoCylinder.Engine.Geometry.circleCollidesPoint(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
        }
    }
});
