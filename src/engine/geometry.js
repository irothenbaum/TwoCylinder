// TODO:
// lineCollidesBox
// lineCollidesLine
// boxCollidesLine

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
        var point3 = {x:box.origin_x + box.width, y:box.origin_y + box.height};
        var point4 = {x:box.origin_x, y:box.origin_y + box.height};
        
        var line1 = [point1,point2];
        var line2 = [point2,point3];
        var line3 = [point3,point4];
        var line4 = [point4,point1];
        
        return 
            TwoCylinder.Engine.Geometry.pointCollidesBox(circle, box) 
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line1, circle, true)
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line2, circle, true) 
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line3, circle, true)  
            || TwoCylinder.Engine.Geometry.lineCollidesCircle(line4, circle, true);
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
    ,circleCollidesLine : function(circle,line, isSegment){
        return TwoCylinder.Engine.Geometry.lineCollidesCircle(line,cricle,isSegment);
    }
    ,circleCollidesPoint : function(circle, point){
        return TwoCylinder.Engine.Geometry.pointCollidesCircle(point, circle);
    }

    
/***************************************************
 * LINES
 ***************************************************/
    // This function returns an array of up to length 2 with points indicating at what points
    // the given circle is intersrected by the given line
    ,lineIntersectsCircle : function(line, circle, isSegment){
        var b = line[0];
        var a = line[1];
        
        // Calculate the euclidean distance between a & b
        var eDistAtoB = Math.sqrt( Math.pow(b.x-a.x, 2) + Math.pow(b.y-a.y, 2) );

        // compute the direction vector d from a to b
        var d = { x : (b.x-a.x)/eDistAtoB, y : (b.y-a.y)/eDistAtoB };

        // Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.

        // compute the value t of the closest point to the circle center (cx, cy)
        var t = (d.x * (circle.x-a.x)) + (d.y * (circle.y-a.y));

        // compute the coordinates of the point e on line and closest to c
        var e = {
            x : (t * d.x) + a.x
            ,y : (t * d.y) + a.y 
        }

        // Calculate the euclidean distance between circle & e
        eDistCtoE = Math.sqrt( Math.pow(e.x-circle.x, 2) + Math.pow(e.y-circle.y, 2) );

        var retVal = [];
        
        // test if the line intersects the circle
        if( eDistCtoE < circle.radius ) {
            // compute distance from t to circle intersection point
            var dt = Math.sqrt( Math.pow(circle.radius, 2) - Math.pow(eDistCtoE, 2));

            // compute first intersection point
            var f = { 
                x : ((t-dt) * d.x) + a.x
                ,y : ((t-dt) * d.y) + a.y
            };
            
            if(!isSegment || TwoCylinder.Engine.Geometry.lineCollidesPoint(line, f, true)){
                retVal.push(f);
            }

            // compute second intersection point
            var g = {
                x : ((t+dt) * d.x) + a.x
                ,y : ((t+dt) * d.y) + a.y
            };
            
            if(!isSegment || TwoCylinder.Engine.Geometry.lineCollidesPoint(line, g, true)){
                retVal.push(g);
            }
        } else if (parseInt(eDistCtoE) === parseInt(circle.radius)) {
            if(!isSegment || TwoCylinder.Engine.Geometry.lineCollidesPoint(line, e, true)){
                retVal.push(e);
            }
        } else {
            // do nothing, no intersection
        }
        
        return retVal;
    }
    
    // true IFF a line passes through or tangent to a given circle
    ,lineCollidesCircle : function(line, circle, isSegment){
        var intersects = TwoCylinder.Engine.Geometry.lineIntersectsCircle(line, circle, isSegment);
        return intersects.length > 0 || TwoCylinder.Engine.Geometry.pointCollidesCircle(line[0],circle);
    }
    
    ,lineCollidesPoint : function(line, point, isSegment){
        var angleToPoint1 = TwoCylinder.Engine.Geometry.angleToPoint(line[0],point);
        var angleToPoint2 = TwoCylinder.Engine.Geometry.angleToPoint(line[1],point);
        
        var retVal = angleToPoint1 == angleToPoint2;

        // if the angle is off, we swap the order of two of the points for one of the measurements
        // this simulates the 180 degree check
        if(!retVal){
            var angleToPoint2 = TwoCylinder.Engine.Geometry.angleToPoint(point, line[1]);
            var retVal = angleToPoint1 == angleToPoint2;
        }

        if(retVal && isSegment){
            var betweenPoints = TwoCylinder.Engine.Geometry.distanceToPoint(line[0],point) 
                + TwoCylinder.Engine.Geometry.distanceToPoint(line[1],point) 
                == TwoCylinder.Engine.Geometry.distanceToPoint(line[0],line[1]);
            
            retVal = betweenPoints;
        }
        
        return retVal;
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
    ,pointCollidesLine : function(point, line){
        return TwoCylinder.Engine.Geometry.lineCollidesPoint(line,point);
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