// RectangleProfiles need an origin x,y and a width and height
TwoCylinder.Engine.BoundingBox = TwoCylinder.Engine.Bounding.extend({
    getCenter : function(){
        return {
            x : this.origin_x + (this.width / 2)
            , y : this.origin_y + (this.height / 2)
        };
    }
    ,setCenter : function(tuple){
        this.origin_x = tuple.x - (this.width / 2);
        this.origin_y = tuple.y - (this.height / 2);
    }
    // TODO: This won't work properly with circles... Perhaps move it to the Geometry function and treat it like collisions
    ,setCenterWithinBounding : function(tuple, bounding){
        var containingBox = bounding.getContainingRectangle();
        var myBox = this.getContainingRectangle();
        
        
        var targetX = tuple.x;
        var targeyY = tuple.y;
        
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
    ,getContainingRectangle : function(){
        return {
            origin_x : this.origin_x
            ,origin_y : this.origin_y
            ,width : this.width
            ,height : this.height
        };
    }
    ,collides : function(bounding){
        if(bounding instanceof TwoCylinder.Engine.BoundingBox){
            return TwoCylinder.Engine.Geometry.boxCollidesBox(this,bounding)
        }else if(bounding instanceof TwoCylinder.Engine.BoundingCircle){
            return TwoCylinder.Engine.Geometry.boxCollidesCircle(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.BoundingPoint){
            return TwoCylinder.Engine.Geometry.boxCollidesPoint(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return TwoCylinder.Engine.Geometry.boxCollidesPoint(this, bounding);
        }
    }
});
