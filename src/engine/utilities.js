const Vector = require('vector')

Constants = {
    TAU : Math.PI * 2
}

Functions = {
    disjoinArray2FromArray1(array1, array2, onEachMatchCallback) {
        if (!array2.length) {
            return
        }
        let i
        let j
        for (i=0; i<array2.length; i++) {
            for(j=0; j<array1.length; j++){
                if(array1[j].__id === array2[i].__id){
                    if (typeof onEachMatchCallback === 'function') {
                        onEachMatchCallback(array1[j])
                    }
                    delete array1[j].__id
                    array1.splice(j,1)
                    break
                }
            }
        }
    },
    clone (obj) {
        // TODO: Could this be improved? Taken from  https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
        return Object.assign( Object.create( Object.getPrototypeOf(obj)), obj)
    }
}

Geometry = {
    /***************************************************
     * BOXES
     ***************************************************/
    boxCollidesBox (box1, box2){
        // both box1 and box 2 must have { x, y, width, height } properties
        // if any part of box1's X is within box2's
        let xOverlap = (
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
        )
        let yOverlap = (
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
        )

        return xOverlap && yOverlap
    }
    ,boxCollidesCircle (box, circle) {
        let point1 = {x:box.origin_x, y:box.origin_y}
        let point2 = {x:box.origin_x + box.width, y:box.origin_y}
        let point3 = {x:box.origin_x + box.width, y:box.origin_y + box.height}
        let point4 = {x:box.origin_x, y:box.origin_y + box.height}

        let line1 = [point1,point2]
        let line2 = [point2,point3]
        let line3 = [point3,point4]
        let line4 = [point4,point1]

        return Geometry.pointCollidesBox(circle, box)
            || Geometry.lineCollidesCircle(line1, circle, true)
            || Geometry.lineCollidesCircle(line2, circle, true)
            || Geometry.lineCollidesCircle(line3, circle, true)
            || Geometry.lineCollidesCircle(line4, circle, true)
    }
    ,boxCollidesPoint (box, point){
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
        )
    }

    /***************************************************
     * CIRCLES
     ***************************************************/
    ,circleCollidesCircle (circle1, circle2){
        return this.distanceToPoint(circle1,circle2) < (circle1.radius + circle2.radius)
    }
    ,circleCollidesBox (circle, box){
        return Geometry.boxCollidesCircle(box,circle)
    }
    ,circleCollidesLine (circle,line, isSegment){
        return Geometry.lineCollidesCircle(line,cricle,isSegment)
    }
    ,circleCollidesPoint (circle, point){
        return Geometry.pointCollidesCircle(point, circle)
    }


    /***************************************************
     * LINES
     ***************************************************/
    // This function returns an array of up to length 2 with points indicating at what points
    // the given circle is intersected by the given line
    ,lineIntersectsCircle (line, circle, isSegment){
        let b = line[0]
        let a = line[1]

        // Calculate the euclidean distance between a & b
        let eDistAtoB = Math.sqrt( Math.pow(b.x-a.x, 2) + Math.pow(b.y-a.y, 2) )

        // compute the direction vector d from a to b
        let d = { x : (b.x-a.x)/eDistAtoB, y : (b.y-a.y)/eDistAtoB }

        // Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.

        // compute the value t of the closest point to the circle center (cx, cy)
        let t = (d.x * (circle.x-a.x)) + (d.y * (circle.y-a.y))

        // compute the coordinates of the point e on line and closest to c
        let e = {
            x : (t * d.x) + a.x,
            y : (t * d.y) + a.y
        }

        // Calculate the euclidean distance between circle & e
        let eDistCtoE = Math.sqrt( Math.pow(e.x-circle.x, 2) + Math.pow(e.y-circle.y, 2) )

        let retVal = []

        // test if the line intersects the circle
        if( eDistCtoE < circle.radius ) {
            // compute distance from t to circle intersection point
            let dt = Math.sqrt( Math.pow(circle.radius, 2) - Math.pow(eDistCtoE, 2))

            // compute first intersection point
            let f = {
                x : ((t-dt) * d.x) + a.x,
                y : ((t-dt) * d.y) + a.y
            }

            if(!isSegment || Geometry.lineCollidesPoint(line, f, true)){
                retVal.push(f)
            }

            // compute second intersection point
            let g = {
                x : ((t+dt) * d.x) + a.x,
                y : ((t+dt) * d.y) + a.y
            }

            if(!isSegment || Geometry.lineCollidesPoint(line, g, true)){
                retVal.push(g)
            }
        } else if (parseInt(eDistCtoE) === parseInt(circle.radius)) {
            if(!isSegment || Geometry.lineCollidesPoint(line, e, true)){
                retVal.push(e)
            }
        } else {
            // do nothing, no intersection
        }

        return retVal
    }

    // true IFF a line passes through or tangent to a given circle
    ,lineCollidesCircle (line, circle, isSegment){
        let intersects = Geometry.lineIntersectsCircle(line, circle, isSegment)
        return intersects.length > 0 || Geometry.pointCollidesCircle(line[0],circle)
    }

    ,lineCollidesPoint (line, point, isSegment){
        let angleToPoint1 = Geometry.angleToPoint(line[0],point)
        let angleToPoint2 = Geometry.angleToPoint(line[1],point)

        let retVal = angleToPoint1 === angleToPoint2

        // if the angle is off, we swap the order of two of the points for one of the measurements
        // this simulates the 180 degree check
        if(!retVal){
            angleToPoint2 = Geometry.angleToPoint(point, line[1])
            retVal = angleToPoint1 === angleToPoint2
        }

        if(retVal && isSegment){
            retVal = Geometry.distanceToPoint(line[0],point) + Geometry.distanceToPoint(line[1],point)
                === Geometry.distanceToPoint(line[0],line[1])
        }

        return retVal
    }


    /***************************************************
     * POINTS
     ***************************************************/
    ,pointCollidesCircle (point, circle){
        return Geometry.distanceToPoint(point,circle) <= circle.radius
    }
    ,pointCollidesBox (point, box){
        return Geometry.boxCollidesPoint(box, point)
    }
    ,pointCollidesPoint (point1, point2){
        return (
            ( point1.x === point2.x )
            &&
            ( point1.y === point2.y )
        )
    }
    ,pointCollidesLine (point, line){
        return Geometry.lineCollidesPoint(line,point)
    }

    /***************************************************
     * ANGLES AND DISTANCES
     ***************************************************/
    ,distanceToPoint (point1, point2){
        let x = point1.x - point2.x
        let y = point1.y - point2.y

        return Math.sqrt( x*x + y*y )
    }
    ,angleToPoint (point1, point2, inDegrees){
        let radians = Math.atan2(point2.y - point1.y, point2.x - point1.x)
        return inDegrees ? ( radians * 180 / Math.PI ) : radians
    }
    /**
     * @param {{x:*. y:*}} point1
     * @param {{x:*. y:*}} point2
     * @returns {Vector}
     */
    ,pointToPoint (point1, point2){
        return new Vector({
            speed : Geometry.distanceToPoint(point1,point2),
            direction : Geometry.angleToPoint(point1,point2)
        })
    }
    /**
     * @param {{x:*,y:*}} point1
     * @param {Vector} vector
     * @returns {{x: *, y: *}}
     */
    ,pointFromVector (point1, vector){
        return {
            x : point1.x + Math.cos(vector.getDirection()) * vector.getSpeed(),
            y : point1.y + Math.sin(vector.getDirection()) * vector.getSpeed()
        }
    }
    ,getRandomDirection () {
        return Math.random() * 2 * Math.PI
    }
}

module.exports = {
    Geometry,
    Functions,
    Constants
}