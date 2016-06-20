// TODO:
// lineCollidesBox
// lineCollidesLine
// lineCollidesPoint
// boxCollidesLine
// pointCollidesLine

TwoCylinder.Engine.Geometry = {
/***************************************************
 * BOXES
 ***************************************************/
    boxCollidesBox : function(box1, box2){
        // both box1 and box 2 must have { x, y, width, height } properties
        // if any part of box1's X is within box2's
        var xOverlap = (
            ( 
                ( box1.origin_x <= box2.origin_x )
                && 
                ( (box1.origin_x + box1.width) > box2.origin_x )
            )
            ||
            ( 
                ( box2.origin_x <= box1.origin_x )
                && 
                ( (box2.origin_x + box2.width) > box1.origin_x )
            )
        );
        var yOverlap = (
            ( 
                ( box1.origin_y <= box2.origin_y ) 
                && 
                ( (box1.origin_y + box1.height) > box2.origin_y )
            )
            ||
            ( 
                ( box2.origin_y <= box1.origin_y )
                && 
                ( (box2.origin_y + box2.height) > box1.origin_y )
            )
        );
        
        return xOverlap && yOverlap;
    }
    ,boxCollidesCircle : function(box, circle){
        // Gonna give a shit attempt at implementing this http://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
        var point1 = {x:box.origin_x, y:box.origin_y};
        var point2 = {x:box.origin_x + box.width, y:box.origin_y};
        var point3 = {x:box.origin_x + box.width, y:box.origin_y+box.height};
        var point4 = {x:box.origin_x, y:box.origin_y+box.height};
        
        var line1 = {x1 : point1.x, y1:point1.y, x2:point2.x,y2:point2.y};
        var line2 = {x1 : point2.x, y1:point2.y, x2:point3.x,y2:point3.y};
        var line3 = {x1 : point3.x, y1:point3.y, x2:point4.x,y2:point4.y};
        var line4 = {x1 : point4.x, y1:point4.y, x2:point1.x,y2:point1.y};
        
        var retVal = 
            TwoCylinder.Engine.Geometry.pointCollidesBox(circle, box)
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line1, circle)
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line2, circle)
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line3, circle)
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line4, circle);
        return retVal;
    }
    ,boxCollidesPoint : function(box, point){
        return (
            (
                ( point.x >= box.origin_x ) 
                && 
                ( (box.origin_x + box.width) >= point.x )
            )
            &&
            (
                ( point.y >= box.origin_y ) 
                && 
                ( (box.origin_y + box.height) >= point.y )
            )
        );
    }
    
/***************************************************
 * CIRCLES
 ***************************************************/
    ,circleCollidesCircle : function(circle1, circle2){
        return this.distanceToPoint(circle1,circle2) < (circle1.radius + circle2.radius);
    }
    ,circleCollidesBox : function(circle, box){
        return TwoCylinder.Engine.Geometry.boxCollidesCircle(box,circle);
    }
    ,circleCollidesLine : function(circle,line){
        return TwoCylinder.Enginer.Geometry.lineCollidesCircle(line,cricle);
    }
    ,circleCollidesPoint : function(circle, point){
        return TwoCylinder.Engine.Geometry.pointCollidesCircle(point, circle);
    }

    
/***************************************************
 * LINES
 ***************************************************/
    ,lineCollidesCircle : function(line, circle){
        // Gonna give a shit attempt at implementing this http://mathworld.wolfram.com/Circle-LineIntersection.html
        var dx = line.x2 - line.x1;
        var dy = line.y2 - line.y1;
        var dr = Math.sqrt((dx*dx) + (dy*dy));
        var r2 = circle.radius * circle.radius;
        var D = (line.x1*line.y2) - (line.x2-line.y1);
        
        var incidence = r2 * ( dr * dr ) - ( D*D );
        
        return incidence > 0;
    }
    
    
/***************************************************
 * POINTS
 ***************************************************/
    ,pointCollidesCircle : function(point, circle){
        return TwoCylinder.Engine.Geometry.distanceToPoint(point,circle) <= circle.radius;
    }
    ,pointCollidesBox : function(point, box){
        return TwoCylinder.Engine.Geometry.boxCollidesPoint(box, point);
    }
    ,pointCollidesPoint : function(point1, point2){
        return ( 
                ( point1.x == point2.x ) 
                && 
                ( point1.y == point2.y ) 
        );
    }
    
/***************************************************
 * ANGLES AND DISTANCES
 ***************************************************/
    ,distanceToPoint : function(point1, point2){
        var x = point1.x - point2.x;
        var y = point1.y - point2.y;

        return Math.sqrt( x*x + y*y );
    }
    ,angleToPoint : function(point1, point2, inDegrees){
        var radians = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        return inDegrees ? ( radians * 180 / Math.PI ) : radians;
    }
    ,pointToPoint : function(point1, point2, inDegrees){
        return {
            distance : TwoCylinder.Engine.Geometry.distanceToPoint(point1,point2,inDegrees)
            ,angle : TwoCylinder.Engine.Geometry.angleToPoint(point1,point2,inDegrees)
        };
    }
    ,pointFromAngle : function(point1, angle, distance, inDegrees){
        return{
            x : point1.x + Math.cos(angle) * distance
            ,y : point1.y + Math.sin(angle) * distance
        };
    }
};