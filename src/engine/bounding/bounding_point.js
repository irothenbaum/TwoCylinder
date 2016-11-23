// CircleProfiles need a center point and a radius
TwoCylinder.Engine.BoundingPoint = TwoCylinder.Engine.Bounding.extend({
    getCenter : function(){
        return { x : this.x, y : this.y };
    }
    ,setCenter : function(tuple){
        this.x = tuple.x;
        this.y = tuple.y;
    }
    ,getContainingRectangle : function(){
        return{
            origin_x : this.x
            ,origin_y : this.y
            ,width : 0
            ,height : 0
        };
    }
    ,collides : function(bounding){
        if(bounding instanceof TwoCylinder.Engine.BoundingBox){
            return TwoCylinder.Engine.Geometry.pointCollidesBox(this,bounding)
        }else if(bounding instanceof TwoCylinder.Enginer.BoudingCircle){
            return TwoCylinder.Engine.Geometry.pointCollidesCircle(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.BoundingPoint){
            return TwoCylinder.Engine.Geometry.pointCollidesPoint(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
        }
    }
});
