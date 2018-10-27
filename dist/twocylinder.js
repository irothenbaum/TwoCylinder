(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("twocylinder", [], factory);
	else if(typeof exports === 'object')
		exports["twocylinder"] = factory();
	else
		root["twocylinder"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Vector = __webpack_require__(7);

Constants = {
  TAU: Math.PI * 2
};
Functions = {
  disjoinArray2FromArray1: function disjoinArray2FromArray1(array1, array2, onEachMatchCallback) {
    if (!array2.length) {
      return;
    }

    var i;
    var j;

    for (i = 0; i < array2.length; i++) {
      for (j = 0; j < array1.length; j++) {
        if (array1[j].__id === array2[i].__id) {
          if (typeof onEachMatchCallback === 'function') {
            onEachMatchCallback(array1[j]);
          }

          delete array1[j].__id;
          array1.splice(j, 1);
          break;
        }
      }
    }
  },
  clone: function clone(obj) {
    // TODO: Could this be improved? Taken from  https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  }
};
Geometry = {
  /***************************************************
   * BOXES
   ***************************************************/
  boxCollidesBox: function boxCollidesBox(box1, box2) {
    // both box1 and box 2 must have { x, y, width, height } properties
    // if any part of box1's X is within box2's
    var xOverlap = box1.origin_x <= box2.origin_x && box1.origin_x + box1.width > box2.origin_x || box2.origin_x <= box1.origin_x && box2.origin_x + box2.width > box1.origin_x;
    var yOverlap = box1.origin_y <= box2.origin_y && box1.origin_y + box1.height > box2.origin_y || box2.origin_y <= box1.origin_y && box2.origin_y + box2.height > box1.origin_y;
    return xOverlap && yOverlap;
  },
  boxCollidesCircle: function boxCollidesCircle(box, circle) {
    var point1 = {
      x: box.origin_x,
      y: box.origin_y
    };
    var point2 = {
      x: box.origin_x + box.width,
      y: box.origin_y
    };
    var point3 = {
      x: box.origin_x + box.width,
      y: box.origin_y + box.height
    };
    var point4 = {
      x: box.origin_x,
      y: box.origin_y + box.height
    };
    var line1 = [point1, point2];
    var line2 = [point2, point3];
    var line3 = [point3, point4];
    var line4 = [point4, point1];
    return Geometry.pointCollidesBox(circle, box) || Geometry.lineCollidesCircle(line1, circle, true) || Geometry.lineCollidesCircle(line2, circle, true) || Geometry.lineCollidesCircle(line3, circle, true) || Geometry.lineCollidesCircle(line4, circle, true);
  },
  boxCollidesPoint: function boxCollidesPoint(box, point) {
    return point.x >= box.origin_x && box.origin_x + box.width >= point.x && point.y >= box.origin_y && box.origin_y + box.height >= point.y;
  }
  /***************************************************
   * CIRCLES
   ***************************************************/
  ,
  circleCollidesCircle: function circleCollidesCircle(circle1, circle2) {
    return this.distanceToPoint(circle1, circle2) < circle1.radius + circle2.radius;
  },
  circleCollidesBox: function circleCollidesBox(circle, box) {
    return Geometry.boxCollidesCircle(box, circle);
  },
  circleCollidesLine: function circleCollidesLine(circle, line, isSegment) {
    return Geometry.lineCollidesCircle(line, cricle, isSegment);
  },
  circleCollidesPoint: function circleCollidesPoint(circle, point) {
    return Geometry.pointCollidesCircle(point, circle);
  }
  /***************************************************
   * LINES
   ***************************************************/
  // This function returns an array of up to length 2 with points indicating at what points
  // the given circle is intersected by the given line
  ,
  lineIntersectsCircle: function lineIntersectsCircle(line, circle, isSegment) {
    var b = line[0];
    var a = line[1]; // Calculate the euclidean distance between a & b

    var eDistAtoB = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)); // compute the direction vector d from a to b

    var d = {
      x: (b.x - a.x) / eDistAtoB,
      y: (b.y - a.y) / eDistAtoB // Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.
      // compute the value t of the closest point to the circle center (cx, cy)

    };
    var t = d.x * (circle.x - a.x) + d.y * (circle.y - a.y); // compute the coordinates of the point e on line and closest to c

    var e = {
      x: t * d.x + a.x,
      y: t * d.y + a.y // Calculate the euclidean distance between circle & e

    };
    var eDistCtoE = Math.sqrt(Math.pow(e.x - circle.x, 2) + Math.pow(e.y - circle.y, 2));
    var retVal = []; // test if the line intersects the circle

    if (eDistCtoE < circle.radius) {
      // compute distance from t to circle intersection point
      var dt = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(eDistCtoE, 2)); // compute first intersection point

      var f = {
        x: (t - dt) * d.x + a.x,
        y: (t - dt) * d.y + a.y
      };

      if (!isSegment || Geometry.lineCollidesPoint(line, f, true)) {
        retVal.push(f);
      } // compute second intersection point


      var g = {
        x: (t + dt) * d.x + a.x,
        y: (t + dt) * d.y + a.y
      };

      if (!isSegment || Geometry.lineCollidesPoint(line, g, true)) {
        retVal.push(g);
      }
    } else if (parseInt(eDistCtoE) === parseInt(circle.radius)) {
      if (!isSegment || Geometry.lineCollidesPoint(line, e, true)) {
        retVal.push(e);
      }
    } else {// do nothing, no intersection
    }

    return retVal;
  } // true IFF a line passes through or tangent to a given circle
  ,
  lineCollidesCircle: function lineCollidesCircle(line, circle, isSegment) {
    var intersects = Geometry.lineIntersectsCircle(line, circle, isSegment);
    return intersects.length > 0 || Geometry.pointCollidesCircle(line[0], circle);
  },
  lineCollidesPoint: function lineCollidesPoint(line, point, isSegment) {
    var angleToPoint1 = Geometry.angleToPoint(line[0], point);
    var angleToPoint2 = Geometry.angleToPoint(line[1], point);
    var retVal = angleToPoint1 === angleToPoint2; // if the angle is off, we swap the order of two of the points for one of the measurements
    // this simulates the 180 degree check

    if (!retVal) {
      angleToPoint2 = Geometry.angleToPoint(point, line[1]);
      retVal = angleToPoint1 === angleToPoint2;
    }

    if (retVal && isSegment) {
      retVal = Geometry.distanceToPoint(line[0], point) + Geometry.distanceToPoint(line[1], point) === Geometry.distanceToPoint(line[0], line[1]);
    }

    return retVal;
  }
  /***************************************************
   * POINTS
   ***************************************************/
  ,
  pointCollidesCircle: function pointCollidesCircle(point, circle) {
    return Geometry.distanceToPoint(point, circle) <= circle.radius;
  },
  pointCollidesBox: function pointCollidesBox(point, box) {
    return Geometry.boxCollidesPoint(box, point);
  },
  pointCollidesPoint: function pointCollidesPoint(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  },
  pointCollidesLine: function pointCollidesLine(point, line) {
    return Geometry.lineCollidesPoint(line, point);
  }
  /***************************************************
   * ANGLES AND DISTANCES
   ***************************************************/
  ,
  distanceToPoint: function distanceToPoint(point1, point2) {
    var x = point1.x - point2.x;
    var y = point1.y - point2.y;
    return Math.sqrt(x * x + y * y);
  },
  angleToPoint: function angleToPoint(point1, point2, inDegrees) {
    var radians = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    return inDegrees ? radians * 180 / Math.PI : radians;
  }
  /**
   * @param {{x:*. y:*}} point1
   * @param {{x:*. y:*}} point2
   * @returns {Vector}
   */
  ,
  pointToPoint: function pointToPoint(point1, point2) {
    return new Vector({
      speed: Geometry.distanceToPoint(point1, point2),
      direction: Geometry.angleToPoint(point1, point2)
    });
  }
  /**
   * @param {{x:*,y:*}} point1
   * @param {Vector} vector
   * @returns {{x: *, y: *}}
   */
  ,
  pointFromVector: function pointFromVector(point1, vector) {
    return {
      x: point1.x + Math.cos(vector.getDirection()) * vector.getSpeed(),
      y: point1.y + Math.sin(vector.getDirection()) * vector.getSpeed()
    };
  },
  getRandomDirection: function getRandomDirection() {
    return Math.random() * 2 * Math.PI;
  }
};
module.exports = {
  Geometry: Geometry,
  Functions: Functions,
  Constants: Constants
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Root = function Root() {
  _classCallCheck(this, Root);
};

module.exports = Root;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Root = __webpack_require__(1);

var Bounding = __webpack_require__(3);

var Generic =
/*#__PURE__*/
function (_Root) {
  _inherits(Generic, _Root);

  function Generic(options) {
    var _this;

    _classCallCheck(this, Generic);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Generic).call(this, options));

    _this.setBounding(options.bounding);

    return _this;
  }

  _createClass(Generic, [{
    key: "collides",
    value: function collides(bounding) {
      return this._bounding && this._bounding.collides(bounding);
    }
  }, {
    key: "getBounding",
    value: function getBounding() {
      return this._bounding;
    }
  }, {
    key: "setBounding",
    value: function setBounding(b) {
      if (!b && !(b instanceof Bounding)) {
        throw "All objects must have a true bounding";
      }

      return this._bounding = b;
    }
  }]);

  return Generic;
}(Root);

module.exports = Generic;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    Profiles are used to remove the ambiguity with determining bounding box
*/
var Root = __webpack_require__(1);

var Bounding =
/*#__PURE__*/
function (_Root) {
  _inherits(Bounding, _Root);

  function Bounding(options) {
    var _this;

    _classCallCheck(this, Bounding);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bounding).call(this, options));
    _this.rotation = 0;
    Object.entries(options).forEach(function (tuple) {
      _this[tuple[0]] = tuple[1];
    });
    return _this;
  }

  _createClass(Bounding, [{
    key: "getCenter",
    value: function getCenter() {
      return {
        x: null,
        y: null
      };
    }
  }, {
    key: "setCenter",
    value: function setCenter(tuple) {
      return null;
    }
  }, {
    key: "setCenterWithinContainer",
    value: function setCenterWithinContainer(tuple, bounding) {
      // if not implemented, just set the center normal style
      return this.setCenter(tuple);
    }
  }, {
    key: "getContainingRectangle",
    value: function getContainingRectangle() {
      return {
        origin_x: null,
        origin_y: null,
        width: null,
        height: null
      };
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      return null;
    }
  }, {
    key: "setRotation",
    value: function setRotation(r) {
      this.rotation = r;
    }
  }, {
    key: "updateBounding",
    value: function updateBounding(key, value) {
      var _this2 = this;

      if (_typeof(key) === 'object') {
        Object.entries(key).forEach(function (tuple) {
          _this2.updateBounding.apply(_this2, _toConsumableArray(tuple));
        });
      } else {
        this[key] = value;
      }

      return this;
    }
  }, {
    key: "collides",
    value: function collides(bounding) {
      return false;
    }
  }]);

  return Bounding;
}(Root);

module.exports = Bounding;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// CircleProfiles need a center point and a radius
var Bounding = __webpack_require__(3);

var Geometry = __webpack_require__(0).Geometry;

var BoundingBox = __webpack_require__(6);

var BoundingCircle = __webpack_require__(5);

var BoundingPoint =
/*#__PURE__*/
function (_Bounding) {
  _inherits(BoundingPoint, _Bounding);

  function BoundingPoint() {
    _classCallCheck(this, BoundingPoint);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoundingPoint).apply(this, arguments));
  }

  _createClass(BoundingPoint, [{
    key: "getCenter",
    value: function getCenter() {
      return {
        x: this.x,
        y: this.y
      };
    }
  }, {
    key: "setCenter",
    value: function setCenter(tuple) {
      this.x = tuple.x;
      this.y = tuple.y;
    }
  }, {
    key: "getContainingRectangle",
    value: function getContainingRectangle() {
      return {
        origin_x: this.x,
        origin_y: this.y,
        width: 0,
        height: 0
      };
    }
  }, {
    key: "collides",
    value: function collides(bounding) {
      if (bounding instanceof BoundingBox) {
        return Geometry.pointCollidesBox(this, bounding);
      } else if (bounding instanceof BoundingCircle) {
        return Geometry.pointCollidesCircle(this, bounding);
      } else if (bounding instanceof BoundingPoint) {
        return Geometry.pointCollidesPoint(this, bounding);
      } else if (bounding instanceof Bounding) {
        // if it's not a rectangle, circle, or point, it could be a new type of bounding
        // in which case we let it handle the collision checking
        return bounding.collides(this);
      } else {
        // treat bounding like a tuple
        return Geometry.circleCollidesPoint(this, bounding);
      }
    }
  }]);

  return BoundingPoint;
}(Bounding);

module.exports = BoundingPoint;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// CircleProfiles need a center point and a radius
var Bounding = __webpack_require__(3);

var Geometry = __webpack_require__(0).Geometry;

var BoundingBox = __webpack_require__(6);

var BoundingPoint = __webpack_require__(4);

var BoundingCircle =
/*#__PURE__*/
function (_Bounding) {
  _inherits(BoundingCircle, _Bounding);

  function BoundingCircle() {
    _classCallCheck(this, BoundingCircle);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoundingCircle).apply(this, arguments));
  }

  _createClass(BoundingCircle, [{
    key: "getCenter",
    value: function getCenter() {
      return {
        x: this.x,
        y: this.y
      };
    }
  }, {
    key: "setCenter",
    value: function setCenter(tuple) {
      this.x = tuple.x;
      this.y = tuple.y;
    }
  }, {
    key: "getContainingRectangle",
    value: function getContainingRectangle() {
      return {
        origin_x: this.x - this.radius,
        origin_y: this.y - this.radius,
        width: 2 * this.radius,
        height: 2 * this.radius
      };
    }
  }, {
    key: "collides",
    value: function collides(bounding) {
      if (bounding instanceof BoundingBox) {
        return Geometry.circleCollidesBox(this, bounding);
      } else if (bounding instanceof BoundingCircle) {
        return Geometry.circleCollidesCircle(this, bounding);
      } else if (bounding instanceof BoundingPoint) {
        return Geometry.circleCollidesPoint(this, bounding);
      } else if (bounding instanceof Bounding) {
        // if it's not a rectangle, circle, or point, it could be a new type of bounding
        // in which case we let it handle the collision checking
        return bounding.collides(this);
      } else {
        // treat bounding like a tuple
        return Geometry.circleCollidesPoint(this, bounding);
      }
    }
  }]);

  return BoundingCircle;
}(Bounding);

module.exports = BoundingCircle;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// RectangleProfiles need an origin x,y and a width and height
var Bounding = __webpack_require__(3);

var Geometry = __webpack_require__(0).Geometry;

var BoundingCircle = __webpack_require__(5);

var BoundingPoint = __webpack_require__(4);

var BoundingBox =
/*#__PURE__*/
function (_Bounding) {
  _inherits(BoundingBox, _Bounding);

  function BoundingBox() {
    _classCallCheck(this, BoundingBox);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoundingBox).apply(this, arguments));
  }

  _createClass(BoundingBox, [{
    key: "getCenter",
    value: function getCenter() {
      return {
        x: this.origin_x + this.width / 2,
        y: this.origin_y + this.height / 2
      };
    }
  }, {
    key: "setCenter",
    value: function setCenter(tuple) {
      this.origin_x = tuple.x - this.width / 2;
      this.origin_y = tuple.y - this.height / 2;
    } // TODO: This won't work properly with circles... Perhaps move it to the Geometry function and treat it like collisions

  }, {
    key: "setCenterWithinBounding",
    value: function setCenterWithinBounding(tuple, bounding) {
      var containingBox = bounding.getContainingRectangle();
      var myBox = this.getContainingRectangle();
      var targetX = tuple.x;
      var targetY = tuple.y;

      if (containingBox.width < myBox.width) {
        targetX = bounding.getCenter().x;
      } else {
        // to center within we take the min between x and the containingbox edge - 1/2 my width
        targetX = Math.min(tuple.x, containingBox.origin_x + containingBox.width - myBox.width / 2); // then max it with the same on the other end

        targetX = Math.max(targetX, containingBox.origin_x + myBox.width / 2); // this ensures, when centered, our left and right edges do not cross the containingBox borders 
      } // Then, do it again for height


      if (containingBox.height < myBox.height) {
        targetY = bounding.getCenter().y;
      } else {
        // to center within we take the min between x and the containingbox edge - 1/2 my width
        targetY = Math.min(tuple.y, containingBox.origin_y + containingBox.height - myBox.height / 2); // then max it with the same on the other end

        targetY = Math.max(targetY, containingBox.origin_y + myBox.height / 2); // this ensures, when centered, our left and right edges do not cross the containingBox borders
      }

      this.setCenter({
        x: targetX,
        y: targetY
      });
    }
  }, {
    key: "getContainingRectangle",
    value: function getContainingRectangle() {
      return {
        origin_x: this.origin_x,
        origin_y: this.origin_y,
        width: this.width,
        height: this.height
      };
    }
  }, {
    key: "collides",
    value: function collides(bounding) {
      if (bounding instanceof BoundingBox) {
        return Geometry.boxCollidesBox(this, bounding);
      } else if (bounding instanceof BoundingCircle) {
        return Geometry.boxCollidesCircle(this, bounding);
      } else if (bounding instanceof BoundingPoint) {
        return Geometry.boxCollidesPoint(this, bounding);
      } else if (bounding instanceof Bounding) {
        // if it's not a rectangle, circle, or point, it could be a new type of bounding
        // in which case we let it handle the collision checking
        return bounding.collides(this);
      } else {
        // treat bounding like a tuple
        return Geometry.boxCollidesPoint(this, bounding);
      }
    }
  }]);

  return BoundingBox;
}(Bounding);

module.exports = BoundingBox;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
 This script defines the Vector object
 */
var Root = __webpack_require__(1);

var Constants = __webpack_require__(0).Constants;

var Vector =
/*#__PURE__*/
function (_Root) {
  _inherits(Vector, _Root);

  function Vector(options) {
    var _this;

    _classCallCheck(this, Vector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Vector).call(this, options));
    options = Object.assign({
      direction: 0,
      speed: 0
    }, options);
    _this.__direction = options.direction;
    _this.__speed = options.speed;
    return _this;
  } // ------------------------------------
  // GETTERS / SETTERS
  // ------------------------------------


  _createClass(Vector, [{
    key: "getDirection",
    value: function getDirection() {
      return this.__direction;
    }
  }, {
    key: "getSpeed",
    value: function getSpeed() {
      return this.__speed;
    }
  }, {
    key: "setDirection",
    value: function setDirection(dir) {
      this.__direction = dir;
    }
  }, {
    key: "setSpeed",
    value: function setSpeed(speed) {
      this.__speed = speed;
    } // ------------------------------------
    // CONVENIENCE FUNCTIONS
    // ------------------------------------

  }, {
    key: "rotateTowards",
    value: function rotateTowards(dir, friction) {
      var currentDirection = this.getDirection();
      var directionDiff = (dir + Constants.TAU - currentDirection) % Constants.TAU;
      friction = friction ? friction : 1;

      if (directionDiff <= Math.PI) {
        this.setDirection(currentDirection + directionDiff / friction);
      } else {
        this.setDirection(currentDirection - (directionDiff - Math.PI) / friction);
      }
    }
  }]);

  return Vector;
}(Root);

module.exports = Vector;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    This script defines an appearance.
    Appearances are attached to instances and define how that instance should be drawn in the world
*/
var Generic = __webpack_require__(2);

var Appearance =
/*#__PURE__*/
function (_Generic) {
  _inherits(Appearance, _Generic);

  function Appearance(options) {
    _classCallCheck(this, Appearance);

    return _possibleConstructorReturn(this, _getPrototypeOf(Appearance).call(this, options));
  }

  _createClass(Appearance, [{
    key: "draw",
    value: function draw(canvas, x, y, rotation, scale, entity) {
      var context = canvas.getContext('2d');
      context.beginPath();
      context.arc(x, y, 20, 0, 2 * Math.PI, false);
      context.fillStyle = 'grey';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#333333';
      context.stroke();
    }
  }]);

  return Appearance;
}(Generic);

module.exports = Appearance;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    Backgrounds are objects that control how the game background should appear. 
    At most, there should be one per world. 
*/
var Root = __webpack_require__(1);

var Background =
/*#__PURE__*/
function (_Root) {
  _inherits(Background, _Root);

  function Background(options) {
    var _this;

    _classCallCheck(this, Background);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Background).call(this, options));
    options = Object.assign({
      color: 'transparent'
    }, options);
    _this._color = options.color;
    return _this;
  }

  _createClass(Background, [{
    key: "draw",
    value: function draw(view) {
      var canvas = view.getCanvas();
      var containingRectangle = view.getBounding().getContainingRectangle();
      var context = canvas.getContext('2d');
      context.beginPath();
      context.fillStyle = this._color;
      context.fillRect(0, 0, containingRectangle.width, containingRectangle.height);
      context.fill();
      context.stroke();
    }
  }]);

  return Background;
}(Root);

module.exports = Background;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    This script creates a basic user interface
*/
var BoundingPoint = __webpack_require__(4);

var Geometry = __webpack_require__(0).Geometry;

var Event =
/*#__PURE__*/
function (_BoundingPoint) {
  _inherits(Event, _BoundingPoint);

  _createClass(Event, null, [{
    key: "EVENT_TYPES",
    get: function get() {
      return {
        TAP: 'tap',
        DOUBLE: 'doubletap',
        LONG: 'longtap',
        MOVE: 'mousemove',
        UP: 'mouseup',
        DOWN: 'mousedown'
      };
    }
  }]);

  function Event(evt, view) {
    var _this;

    _classCallCheck(this, Event);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Event).call(this, evt, view)); // -----------------------------------------------------
    // This part was taken from Stack Overflow
    // http://stackoverflow.com/questions/8389156

    var el = evt.target,
        x = 0,
        y = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    } // -----------------------------------------------------


    _this._super('initialize', {
      x: evt.clientX - x,
      y: evt.clientY - y
    });

    if (view) {
      _this.world_x = _this.x + view.getBounding().origin_x;
      _this.world_y = _this.y + view.getBounding().origin_y;
      var rect = view.getCanvas().getBoundingClientRect();
      _this.device_x = _this.x + rect.left;
      _this.device_y = _this.y + rect.top;
    }

    _this.timestamp = Date.now();
    return _this;
  }

  _createClass(Event, [{
    key: "linkEvent",
    value: function linkEvent(evt) {
      // we want them to only link events
      if (evt instanceof Event) {
        this.linked_event = evt;
        this.velocity = Geometry.pointToPoint(this.linked_event, this);
      }

      return this;
    }
  }, {
    key: "setType",
    value: function setType(eventType) {
      if (Event.EVENT_TYPES.values().indexOf(eventType) === -1) {
        throw "Invalid event type";
      }

      this.type = eventType;
      return this;
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.type ? this.type : null;
    }
  }]);

  return Event;
}(BoundingPoint);

module.exports = Event;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/*
    This script creates a basic user interface
*/
var Event = __webpack_require__(10);

var Geometry = __webpack_require__(0).Geometry;

var Generic = __webpack_require__(2);

var Touch =
/*#__PURE__*/
function (_Generic) {
  _inherits(Touch, _Generic);

  function Touch(options) {
    var _this;

    _classCallCheck(this, Touch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Touch).call(this, options));
    _this.__view = options.view; //by default the touch location is the full canvas

    options = Object.assign({
      bounding: _this.__view.getBounding(),
      double: 300,
      tap: 300,
      tap_distance: 20
    }, options);

    _this.setBounding(options.bounding);

    _this._doubleTapThreshold = options.double;
    _this._tapThreshold = options.tap;
    _this._tapDistanceThreshold = options.tap_distance;
    _this._longTapCancel = 2 * _this._tapThreshold; // absolute touch boxes are bound to the world which means the calculate touching
    // via worldy coordinate systems as opposed to the view's relative coordinates [default]

    if (options.absolute) {
      _this.__boundToWorld = true;
    } // these events store the last events -- TODO : Maybe make them arrays? Store the trailing events?


    _this._lastUp = null;
    _this._lastDown = null;
    _this._lastMove = null; // create a listener for each type of event

    Event.EVENT_TYPES.forEach(function (val) {
      _this.__getListenersByType.call(_assertThisInitialized(_assertThisInitialized(_this)), val);
    }); // id is set by the view when the touch object is inserted

    _this.__id = null; // key is used to track touch listeners

    _this.__key = 0; // used to check if the touch is currently down

    _this.__isDown = false; // What follows are the browser event binding calls

    var that = _assertThisInitialized(_assertThisInitialized(_this));

    _this.__view.getCanvas().addEventListener('mousedown', function (evt) {
      that._handleDown.apply(that, arguments);
    }, false);

    _this.__view.getCanvas().addEventListener('touchstart', function (evt) {
      evt.preventDefault();

      that._handleDown.apply(that, arguments);
    }, false);

    _this.__view.getCanvas().addEventListener('mouseup', function (evt) {
      that._handleUp.apply(that, arguments);
    }, false);

    _this.__view.getCanvas().addEventListener('touchend', function (evt) {
      evt.preventDefault();

      that._handleUp.apply(that, arguments);
    }, false);

    _this.__view.getCanvas().addEventListener('mousemove', function (evt) {
      that._handleMove.apply(that, arguments);
    }, false);

    _this.__view.getCanvas().addEventListener('touchmove', function (evt) {
      evt.preventDefault();

      that._handleMove.apply(that, arguments);
    }, false);

    return _this;
  }
  /*
   * If this touch has an appearance, we draw it
   */


  _createClass(Touch, [{
    key: "draw",
    value: function draw() {
      if (this.getAppearance()) {
        this.getAppearance().draw(this.__view.getCanvas(), this.getBounding().getCenter().x, this.getBounding().getCenter().y, this.__view.getRotation(), this.__view.getScale(), this);
      }
    }
    /*
     * Appearance will be important for extended objects wishing to give the touch zones a visual represenation
     */

  }, {
    key: "setAppearance",
    value: function setAppearance(app) {
      this.__appearance = app;
    }
  }, {
    key: "getAppearance",
    value: function getAppearance(app) {
      return this.__appearance;
    }
    /*
     * These function receive a browser event and determin whether or not
     * to fire an IO event to listeners based on collision type, location, and touch state
     * They are also responsible with properly formatting the IO event (determining if it's
     * a single tap, double tap, move, etc...)
     */

  }, {
    key: "_handleDown",
    value: function _handleDown(evt) {
      var event = this.__formatTouchEvent(evt);

      if (!event) {
        return;
      }

      event.setType(Event.EVENT_TYPES.DOWN);
      this.__isDown = true;
      this.__lastDown = event;

      this.__fireEvent(event);
    }
  }, {
    key: "_handleUp",
    value: function _handleUp(evt) {
      var event = this.__formatTouchEvent(evt);

      if (!event) {
        return;
      }

      if (!this.isDown()) {
        return;
      } // found is used to determine if we've already assigned a type to this event before checking for others
      // it's really just a helper variable so we can avoid deeply nested if / else ifs


      var found = false; // first we check for DOUBLE tap

      if (this.__lastUp && this.__lastUp.type == Event.EVENT_TYPES.TAP && this.__lastUp.timestamp - event.timestamp <= this._doubleTapThreshold) {
        event.setType(Event.EVENT_TYPES.DOUBLE);
        found = true;
      } // next we check for LONG tap


      if (!found && this.__lastDown && Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold) {
        var lastDownDiff = event.timestamp - this.__lastDown.timestamp;

        if (lastDownDiff <= this._tapThreshold) {
          event.setType(Event.EVENT_TYPES.TAP);
          found = true;
        } else if (lastDownDiff <= this._longTapCancel) {
          event.setType(Event.EVENT_TYPES.LONG);
          found = true;
        } else {// do nothing, we're cancelling the long click
        }
      } // at this point, it must be the end of a move, so we give it a default


      if (!found) {
        event.setType(Event.EVENT_TYPES.UP);
      }

      event.linkEvent(this.__lastDown);
      this.__lastUp = event;

      this.__fireEvent(event);

      this.__isDown = false;
    }
  }, {
    key: "_handleMove",
    value: function _handleMove(evt) {
      if (!this.isDown()) {
        return;
      }

      var event = this.__formatTouchEvent(evt);

      if (!event) {
        return;
      }

      if (event.timestamp - this.__lastDown.timestamp <= this._longTapCancel && Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold) {
        // if they haven't moved their finger enough and we're within the longtap threshold
        return;
      }

      event.setType(Event.EVENT_TYPES.MOVE);
      event.linkEvent(this.__lastMove);
      this.__lastMove = event;

      this.__fireEvent(event);
    }
    /*
     * This function takes an IO Event and fires it to all bound listeners of its type
     */

  }, {
    key: "__fireEvent",
    value: function __fireEvent(event) {
      var handlers = this.__getListenersByType(event.getType());

      if (handlers.length) {
        for (var i = 0; i < handlers.length; i++) {
          handlers[i].callback(event);
        }
      }
    }
    /*
     * This function will be used to queue previous events to  store a history rather than just
     * the last one (lastMove, lastUp, lastDown)
     */

  }, {
    key: "__queueHistory",
    value: function __queueHistory(group, event) {
      group[0] = group[0].toUpperCase();
      this['__last' + group].push(event);
      this['__last' + group].shift();
      return null;
    }
    /*
     * This function might be uneeded? It basically adds all listeners to an array so we can
     * potentially more easily track them (by key)
     */

  }, {
    key: "__formatListener",
    value: function __formatListener(callback) {
      return {
        key: ++this.__key,
        callback: callback
      };
    }
    /*
     * This function takes a browser event (mouse or touch) and converts it into a TwoCylinder IO event
     * IFF it registered a collision with this touch space else it returns false 
     */

  }, {
    key: "__formatTouchEvent",
    value: function __formatTouchEvent(evt) {
      //TODO: I'm not sure if this.collides will work for views that are not origin_x = 0, origin_y = 0
      // BECAUSE, I think the event's x and y is relative to the device and the touch instance is relative
      // to the world view (I THINK)
      // changed Touches is used for multitouch... ?
      // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
      var touches = evt.changedTouches ? evt.changedTouches : [];

      if (touches.length) {
        var _event = false;
        var step = 0;

        do {
          if (step < touches.length) {
            evt.clientX = touches[step].clientX;
            evt.clientY = touches[step].clientY;
          } else {
            return false;
          }

          _event = new Event(evt, this.__view);
          step++;
        } while (!this.collides(_event));
      } else {
        event = new Event(evt, this.__view);

        if (!this.collides(event)) {
          return false;
        }
      }

      return event;
    }
    /*
     * WARNING: A bit of reflection here. Be careful...
     * This function returns all bound listeners based on type
     */

  }, {
    key: "__getListenersByType",
    value: function __getListenersByType(type) {
      if (!type) {
        return null;
      }

      var prop = '__' + type + 'Listeners';

      if (!this[prop]) {
        this[prop] = [];
      }

      return this[prop];
    }
    /*
     * This function is used to bind a handler to a certain type of IO event
     */

  }, {
    key: "__on",
    value: function __on(type, callback) {
      var array = this.__getListenersByType(type);

      array.push(this.__formatListener(callback));
    }
    /*
     * This function removes a passed binding
     */

  }, {
    key: "__off",
    value: function __off(type, callback) {
      var array = this.__getListenersByType(type);

      for (var i = 0; i < array.length; i++) {
        if (array[i].callback === callback) {
          delete array[i];
        }
      }
    }
    /*
     * The following are helper functions to make calling __on and __off more semantic
     */

  }, {
    key: "onDouble",
    value: function onDouble(callback) {
      this.__on(Event.EVENT_TYPES.DOUBLE, callback);
    }
  }, {
    key: "offDouble",
    value: function offDouble(callback) {
      this.__off(Event.EVENT_TYPES.DOUBLE, callback);
    }
  }, {
    key: "onLong",
    value: function onLong(callback) {
      this.__on(Event.EVENT_TYPES.LONG, callback);
    }
  }, {
    key: "offLong",
    value: function offLong(callback) {
      this.__off(Event.EVENT_TYPES.LONG, callback);
    }
  }, {
    key: "onTap",
    value: function onTap(callback) {
      this.__on(Event.EVENT_TYPES.TAP, callback);
    }
  }, {
    key: "offTap",
    value: function offTap(callback) {
      this.__off(Event.EVENT_TYPES.TAP, callback);
    }
  }, {
    key: "onDown",
    value: function onDown(callback) {
      this.__on(Event.EVENT_TYPES.DOWN, callback);
    }
  }, {
    key: "offDown",
    value: function offDown(callback) {
      this.__off(Event.EVENT_TYPES.DOWN, callback);
    }
  }, {
    key: "onMove",
    value: function onMove(callback) {
      this.__on(Event.EVENT_TYPES.MOVE, callback);
    }
  }, {
    key: "offMove",
    value: function offMove(callback) {
      this.__off(Event.EVENT_TYPES.MOVE, callback);
    }
  }, {
    key: "onUp",
    value: function onUp(callback) {
      this.__on(Event.EVENT_TYPES.UP, callback);
    }
  }, {
    key: "offUp",
    value: function offUp(callback) {
      this.__off(Event.EVENT_TYPES.UP, callback);
    }
    /*
     * This function can determine if this touch instance is being actively engaged
     */

  }, {
    key: "isDown",
    value: function isDown() {
      return this.__isDown;
    }
  }]);

  return Touch;
}(Generic);

module.exports = Touch;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    This script handles drawing the joystick appearance
*/
var Appearance = __webpack_require__(8);

var BoundingCircle = __webpack_require__(5);

var Joystick =
/*#__PURE__*/
function (_Appearance) {
  _inherits(Joystick, _Appearance);

  function Joystick() {
    _classCallCheck(this, Joystick);

    var options = {
      bounding: new BoundingCircle({
        x: 0,
        y: 0,
        radius: 20
      })
    };
    return _possibleConstructorReturn(this, _getPrototypeOf(Joystick).call(this, options));
  }

  _createClass(Joystick, [{
    key: "draw",
    value: function draw(canvas, x, y, rotation, scale, joystick) {
      var options = joystick.getDrawOptions();
      var context = canvas.getContext('2d'); // if the joystick is being operated, we draw the binding circle

      if (options.operating) {
        context.beginPath();
        context.arc(x, y, 160, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(0,255,0,0.1)';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = 'rgba(0,255,0,0.3)';
        context.stroke();
      }

      context.beginPath();
      context.arc(x, y, 20, 0, 2 * Math.PI, false);
      context.fillStyle = '#000000';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#303030';
      context.stroke();
      context.beginPath();
      context.lineWidth = 18;
      context.strokeStyle = '#333333';
      context.lineCap = 'round';
      context.moveTo(options.stick.x, options.stick.y);
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.arc(options.stick.x, options.stick.y, 18, 0, 2 * Math.PI, false);
      context.fillStyle = '#dd2222';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#aa1111';
      context.stroke();
      context.beginPath();
      context.arc(options.stick.x + 6, options.stick.y - 6, 4, 0, 2 * Math.PI, false);
      context.fillStyle = '#ffcccc';
      context.fill();
    }
  }]);

  return Joystick;
}(Appearance);

module.exports = Joystick;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var Bounding = __webpack_require__(3);

var BoundingPoint = __webpack_require__(4);

var BoundingCircle = __webpack_require__(5);

var BoundingBox = __webpack_require__(6);

var Appearance = __webpack_require__(8);

var Background = __webpack_require__(9);

var Controller = __webpack_require__(14);

var Entity = __webpack_require__(15);

var Game = __webpack_require__(16);

var Generic = __webpack_require__(2);

var Particle = __webpack_require__(17);

var ParticleEmitter = __webpack_require__(18);

var Root = __webpack_require__(1);

var Vector = __webpack_require__(7);

var View = __webpack_require__(19);

var World = __webpack_require__(20);

var EngineContainer = {
  Bounding: Bounding,
  BoundingBox: BoundingBox,
  BoundingCircle: BoundingCircle,
  BoundingPoint: BoundingPoint,
  Appearance: Appearance,
  Controller: Controller,
  Background: Background,
  Entity: Entity,
  Game: Game,
  Generic: Generic,
  ParticleEmitter: ParticleEmitter,
  Particle: Particle,
  Root: Root,
  World: World,
  View: View,
  Vector: Vector
};

var _require = __webpack_require__(0),
    Functions = _require.Functions,
    Geometry = _require.Geometry,
    Constants = _require.Constants;

var UtilitiesContainer = {
  Functions: Functions,
  Constants: Constants,
  Geometry: Geometry
};

var Event = __webpack_require__(10);

var Touch = __webpack_require__(11);

var Joystick = __webpack_require__(21);

var IOContainer = {
  Event: Event,
  Touch: Touch,
  Joystick: Joystick
};

var JoystickSprite = __webpack_require__(12);

var SpritesContainer = {
  Josystick: JoystickSprite
};
TwoCylinder = {
  Engine: EngineContainer,
  IO: IOContainer,
  Sprites: SpritesContainer,
  Utilities: UtilitiesContainer
};
module.exports = TwoCylinder;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Root = __webpack_require__(1);

var Controller =
/*#__PURE__*/
function (_Root) {
  _inherits(Controller, _Root);

  function Controller(options) {
    var _this;

    _classCallCheck(this, Controller);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Controller).call(this, options));
    _this.world = options.world;
    return _this;
  }

  _createClass(Controller, [{
    key: "preStep",
    value: function preStep(worldClock) {
      return;
    }
  }, {
    key: "step",
    value: function step(worldClock) {
      return;
    }
  }, {
    key: "postStep",
    value: function postStep(worldClock) {
      return;
    }
  }]);

  return Controller;
}(Root);

module.exports = Controller;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Generic = __webpack_require__(2);

var Appearance = __webpack_require__(8);

var Vector = __webpack_require__(7);

var BoundingPoint = __webpack_require__(4);

var Entity =
/*#__PURE__*/
function (_Generic) {
  _inherits(Entity, _Generic);

  function Entity(options) {
    var _this;

    _classCallCheck(this, Entity);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Entity).call(this, options)); // -------------------------------

    _this.__appearance = null;
    options = Object.assign({
      velocity: null // Vector :: the instance's velocity vector
      ,
      rotation: 0 // float :: the instance's this.__appearance rotation
      ,
      rotation_lag: 20 // int :: the number of steps it will take to turnTowards a target direction

    }, options);

    if (options.appearance) {
      _this.setAppearance(options.appearance);
    }

    _this._velocity = options.velocity;
    _this._rotationLag = options.rotation_lag;
    _this._rotation = options.rotation;
    _this._collisionGroup = 'ENTITY'; // -------------------------------
    // id is set by the world when it's inserted

    _this.__id = null;
    _this.__collisionGroupListening = {};
    _this.__visible = true; // boolean  :: is this instance visible

    return _this;
  } // draw is called by a view.
  // the view passes a callback function which is called IFF this instance is to be drawn
  // passed to that function is important information that will be forwarded to the Instance's this.__appearance


  _createClass(Entity, [{
    key: "draw",
    value: function draw(view, center_x, center_y) {
      this.getAppearance().draw(view.getCanvas(), center_x, center_y, view.getRotation() * this._rotation, // TODO: this is probably wrong? haven't tested
      view.getScale(), this);
    }
  }, {
    key: "preStep",
    value: function preStep(worldClock) {
      return;
    }
  }, {
    key: "step",
    value: function step(worldClock) {
      if (this.getSpeed()) {
        this.getBounding().setCenter({
          x: this.getBounding().getCenter().x + this.getSpeed() * Math.cos(this.getDirection()),
          y: this.getBounding().getCenter().y + this.getSpeed() * Math.sin(this.getDirection())
        });

        if (this.getAppearance()) {
          this.getAppearance().getBounding().setCenter(this.getBounding().getCenter());
        }
      }
    }
  }, {
    key: "postStep",
    value: function postStep(worldClock) {
      return;
    }
    /****************************************************************************
     COLLISIONS AND COLLISION CHECKING
     ****************************************************************************/
    // this will return what collision group this entity belongs to

  }, {
    key: "getCollisionGroup",
    value: function getCollisionGroup() {
      return this._collisionGroup;
    }
  }, {
    key: "getCollidableGroups",
    value: function getCollidableGroups() {
      return Object.keys(this.__collisionGroupListening);
    } // this function passes an other instance and signifies a collision has occurred
    // this instance then determines if it should react to the collision or not

  }, {
    key: "handleCollidedWith",
    value: function handleCollidedWith(other) {
      var collisionFunction = this.objectIsCollidable(other);

      if (collisionFunction) {
        collisionFunction.apply(this, [other]);
      }
    }
  }, {
    key: "groupIsCollidable",
    value: function groupIsCollidable(group) {
      var retVal = false;

      if (this.__collisionGroupListening[other]) {
        retVal = this.__collisionGroupListening[other];
      }

      return retVal;
    } // this function will return the collision function for a passed Entity instance
    // or false IFF there is no corresponding collision function

  }, {
    key: "objectIsCollidable",
    value: function objectIsCollidable(other) {
      var retVal = false;

      if (other instanceof Entity) {
        return this.groupIsCollidable(other.getCollisionGroup());
      }

      return retVal;
    } // this will return true IFF this object is listening for collisions

  }, {
    key: "hasCollisionChecking",
    value: function hasCollisionChecking() {
      return this.__collisionGroupListening.hasOwnProperty;
    } // ----------------------
    // this collision function handles collisions between this instance and instances of a specified Group

  }, {
    key: "onCollideGroup",
    value: function onCollideGroup(group, callback) {
      this.__collisionGroupListening[group] = callback;
    }
  }, {
    key: "offCollideGroup",
    value: function offCollideGroup(group) {
      delete this.__collisionGroupListening[group];
    }
    /****************************************************************************
     GETERS AND SETTERS
     ****************************************************************************/

  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.getBounding().getCenter();
    }
    /**
     * tuple can either be a boundingPoint, tuple (x & y) or just x (in which case y is y)
     */

  }, {
    key: "setPosition",
    value: function setPosition(tuple, y) {
      if (tuple instanceof BoundingPoint) {
        this.getBounding().updateBounding(tuple.getCenter());
      } else if (_typeof(tuple) === 'object') {
        this.getBounding().updateBounding({
          x: tuple.x,
          y: tuple.y
        });
      } else {
        this.getBounding().updateBounding(tuple, y);
      }
    } // ----------------------

    /**
     * app is an Appearance object
     * when setting an this.__appearance object, you can also change the collision box by passing new collision dimensions
     * "box" can either be a tuple (width & height) or just width in which case h is height
     */

  }, {
    key: "setAppearance",
    value: function setAppearance(app) {
      if (!(app instanceof Appearance)) {
        throw "Appearance must be a instance of Appearance";
      }

      this.__appearance = app;
    } // This function defines how to draw this instance

  }, {
    key: "getAppearance",
    value: function getAppearance() {
      return this.__appearance;
    } // ----------------------

  }, {
    key: "getDirection",
    value: function getDirection() {
      return this.getVelocity().getDirection();
    }
  }, {
    key: "rotateTowards",
    value: function rotateTowards(dir) {
      this.getVelocity().rotateTowards(dir, this._rotationLag);
    }
  }, {
    key: "setDirection",
    value: function setDirection(dir) {
      this.getVelocity().setDirection(dir);
      return this.getDirection();
    }
  }, {
    key: "getSpeed",
    value: function getSpeed() {
      return this.getVelocity().getSpeed();
    }
  }, {
    key: "setSpeed",
    value: function setSpeed(speed) {
      this.getVelocity().setSpeed(speed);
    }
  }, {
    key: "setVelocity",
    value: function setVelocity(velocity) {
      this._velocity = velocity;
    }
  }, {
    key: "getVelocity",
    value: function getVelocity() {
      if (!this._velocity) {
        this._velocity = new Vector();
      }

      return this._velocity;
    } // ----------------------

  }, {
    key: "getVisible",
    value: function getVisible() {
      return this.isVisible();
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      // must be in the world, visible, and with an appearance
      return this.__id && this.__visible && !!this.__appearance;
    }
  }, {
    key: "setVisible",
    value: function setVisible(vis) {
      this.__visible = vis;
    }
  }]);

  return Entity;
}(Generic);

module.exports = Entity;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Root = __webpack_require__(1);

var Game =
/*#__PURE__*/
function (_Root) {
  _inherits(Game, _Root);

  function Game() {
    var _this;

    _classCallCheck(this, Game);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this));
    _this.__world = undefined;
    return _this;
  }

  _createClass(Game, [{
    key: "start",
    value: function start() {
      return this.getWorld().start();
    }
  }, {
    key: "exit",
    value: function exit() {
      return this.getWorld().exit();
    }
  }, {
    key: "setWorld",
    value: function setWorld(w) {
      this.__world = w;
    }
  }, {
    key: "getWorld",
    value: function getWorld() {
      return this.__world;
    }
  }]);

  return Game;
}(Root);

module.exports = Game;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
 This script defines the particle object
 */
var Root = __webpack_require__(1);

var Particle =
/*#__PURE__*/
function (_Root) {
  _inherits(Particle, _Root);

  function Particle(options) {
    var _this;

    _classCallCheck(this, Particle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Particle).call(this, options));
    options = Object.assign({}, options);
    _this.__id = options.id;
    _this.__emitter = options.emitter;
    return _this;
  } // This function is responsible for moving the particle or otherwise tracking its lifecycle


  _createClass(Particle, [{
    key: "step",
    value: function step(clock) {
      return null;
    }
  }, {
    key: "draw",
    value: function draw(canvas, x, y, rotation, scale, emitter) {
      var context = canvas.getContext('2d');
      context.beginPath();
      context.arc(x, y, 20, 0, 2 * Math.PI, false);
      context.fillStyle = 'grey';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#333333';
      context.stroke();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.__emitter.removeParticle(this);
    }
  }]);

  return Particle;
}(Root);

module.exports = Particle;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Functions = __webpack_require__(0).Functions;

var Generic = __webpack_require__(2);

var ParticleEmitter =
/*#__PURE__*/
function (_Generic) {
  _inherits(ParticleEmitter, _Generic);

  function ParticleEmitter(options) {
    var _this;

    _classCallCheck(this, ParticleEmitter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ParticleEmitter).call(this, options)); // -------------------------------

    _this.__particles = [];
    _this.__toRemove = []; // by default, newly created emitters do not emit until told to

    _this.__isEmitting = false; // an internal id counter

    _this.__particleKey = 0; // id is set by the world when it's inserted

    _this.__id = null;
    return _this;
  } // an emitter drawing basically just calls draw on all its particles
  // particles are like appearances, but without bounding boxes - they just get drawn if the emitter is in
  // collision with the view


  _createClass(ParticleEmitter, [{
    key: "draw",
    value: function draw(view, center_x, center_y) {
      var _this2 = this;

      this.getParticles().forEach(function (p) {
        p.draw(view.getCanvas(), center_x, center_y, view.getRotation() * _this2._rotation, view.getScale(), _this2);
      });
    }
  }, {
    key: "step",
    value: function step(clock) {
      this.getParticles().forEach(function (p) {
        p.step(clock);
      });

      this.__removeParticles();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.__particles = [];
    }
  }, {
    key: "setIsEmitting",
    value: function setIsEmitting(isEmitting) {
      this.__isEmitting = isEmitting;
    }
  }, {
    key: "getIsEmitting",
    value: function getIsEmitting() {
      return this.__isEmitting;
    }
    /****************************************************************************
     PARTICLES
     ****************************************************************************/

  }, {
    key: "getParticles",
    value: function getParticles() {
      return this.__particles;
    }
  }, {
    key: "removeParticle",
    value: function removeParticle(particle) {
      this.__toRemove.push(particle);
    }
  }, {
    key: "__removeParticles",
    value: function __removeParticles(particle) {
      Functions.disjoinArray2FromArray1(this.__particles, this.__toRemove);
      this.__toRemove = [];
    }
    /**
     * It may be advantageous for particle emitters to emit particles one at a time
     * rather than repeatedly. In that case, this function can be used
     * @param {function} particleType
     * @param {object} options
     */

  }, {
    key: "emitParticle",
    value: function emitParticle(particleType, options) {
      var newParticle;
      options = Object.assign({
        id: ++this.__particleKey,
        emitter: this
      }, options);
      newParticle = new particleType(options);

      this.__particles.push(newParticle);

      return newParticle;
    }
  }]);

  return ParticleEmitter;
}(Generic);

module.exports = ParticleEmitter;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    This script defines a this.__world's view.
    Views are attached to this.__worlds and help determine which instances should be drawn to the this.__canvas and where
*/
var Generic = __webpack_require__(2);

var Functions = __webpack_require__(0).Functions;

var View =
/*#__PURE__*/
function (_Generic) {
  _inherits(View, _Generic);

  function View(options) {
    var _this;

    _classCallCheck(this, View);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(View).call(this, options));
    _this.__canvas = options.canvas;
    _this._rotation = options.rotation || 0;
    _this._scale = options.scale || 1;
    _this._resolution = options.resolution || 1;
    _this.__canvas.width = _this.getBounding().width * _this._resolution;
    _this.__canvas.height = _this.getBounding().height * _this._resolution;
    _this.__canvas.style.width = _this.getBounding().width + "px";
    _this.__canvas.style.height = _this.getBounding().height + "px";
    _this.__followInstance = false;
    _this.__ios = [];
    _this.__toRemoveIOs = [];
    _this.__ioKey = 0; // id is set by the world when it's inserted

    _this.__id = null;
    return _this;
  }

  _createClass(View, [{
    key: "clearCanvas",
    value: function clearCanvas() {
      this.__canvas.getContext('2d').clearRect(0, 0, this.__canvas.width, this.__canvas.height);
    }
  }, {
    key: "draw",
    value: function draw(time) {
      var i;
      var instances;
      var particles;
      var ios;
      var that = this; // before we draw, we want to re-center on our tracked instance if we have one

      if (this.__followInstance) {
        this.getBounding().setCenterWithinBounding(this.__followInstance.getBounding().getCenter(), this.__world.getBounding());
      } // prepare to draw


      this.clearCanvas(); // first draw the world's background

      this.__world.getBackground().draw(this); // get all instances and loop through them


      this.__world.getInstances().forEach(function (inst) {
        // skip invisible instances
        if (!inst.isVisible()) {
          return;
        } // if this instance's appearance is inside this view box
        // NOTE: we check the appearance's bounding because it may be desirable for the calculated collision box
        // to be different from what is considered visible. for example, if the appearance draws shadows
        // those shadows might not be collidable with other entities, but should be included in
        // determining whether or not to draw the entity to a view.


        if (that.collides(inst.getAppearance().getBounding())) {
          //then we draw the instance and pass the view so it can reference the view's
          //transitions and transformation (rotation, scale, etc)
          inst.draw(that, inst.getBounding().getCenter().x - that.getBounding().getContainingRectangle().origin_x, inst.getBounding().getCenter().y - that.getBounding().getContainingRectangle().origin_y);
        }
      }); // Draw each particle emitter


      this.__world.getParticleEmitters().forEach(function (part) {
        if (that.collides(part.getBounding())) {
          part.draw(that, part.getBounding().getCenter().x - that.getBounding().getContainingRectangle().origin_x, part.getBounding().getCenter().y - that.getBounding().getContainingRectangle().origin_y);
        }
      }); // check if any IOs have been removed


      this.__removeIOs(); //now we loop through the IO handlers for this view


      this.getIOs().forEach(function (io) {
        io.draw();
      });
    }
    /****************************************************************************
    GETTER AND SETTER FUNCTIONS
    ****************************************************************************/

  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this.__canvas;
    }
  }, {
    key: "getWorld",
    value: function getWorld() {
      return this.__world;
    }
  }, {
    key: "setWorld",
    value: function setWorld(world) {
      this.__world = world;
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      return this._rotation;
    }
  }, {
    key: "setRotation",
    value: function setRotation(r) {
      this._rotation = r;
    }
  }, {
    key: "getScale",
    value: function getScale() {
      return this._scale;
    }
  }, {
    key: "setScale",
    value: function setScale(s) {
      this._scale = s;
    }
    /****************************************************************************
    IO FUNCTIONS
    ****************************************************************************/

  }, {
    key: "removeIO",
    value: function removeIO(io) {
      if (io.__id) {
        this.__toRemoveIOs.push(io);
      }

      return io;
    }
  }, {
    key: "__removeIOs",
    value: function __removeIOs() {
      Functions.disjoinArray2FromArray1(this.__ios, this.__toRemoveIOs);
      this.__toRemoveIOs = [];
    }
  }, {
    key: "addIO",
    value: function addIO(io) {
      if (io.__id) {
        throw "IO already added";
      }

      io.__id = ++this.__ioKey;

      this.__ios.push(io);

      return io;
    }
  }, {
    key: "getIOs",
    value: function getIOs() {
      return this.__ios;
    } // this gets the mouse position by world, view, and device OR any one of them as an x,y tuple

  }, {
    key: "getMousePosition",
    value: function getMousePosition(evt) {
      return new TwoCylinder.IO.Event(evt, this);
    }
  }, {
    key: "followInstance",
    value: function followInstance(instance) {
      if (instance) {
        this.__followInstance = instance;
      } else {
        this.__followInstance = false;
      }
    }
  }]);

  return View;
}(Generic);

module.exports = View;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Generic = __webpack_require__(2);

var Background = __webpack_require__(9);

var BoundingBox = __webpack_require__(6);

var Functions = __webpack_require__(0).Functions;

var World =
/*#__PURE__*/
function (_Generic) {
  _inherits(World, _Generic);

  function World(options) {
    var _this;

    _classCallCheck(this, World);

    options.bounding = new BoundingBox({
      origin_x: 0,
      origin_y: 0,
      width: options.width,
      height: options.height
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(World).call(this, options));
    _this._fps = options.fps || 30;
    _this.__instances = [];
    _this.__particleEmitters = [];
    _this.__controllers = [];
    _this.__views = [];
    _this.__toRemoveParticleEmitters = [];
    _this.__toRemoveInstances = [];
    _this.__toRemoveControllers = [];
    _this.__toRemoveViews = [];
    _this.__collisionGroups = {};
    _this.__background = options.background || new Background();
    _this.__instanceKey = 0;
    _this.__viewKey = 0;
    _this.__emitterKey = 0;
    _this.__controllerKey = 0;
    _this.__clock = 0;
    return _this;
  } //TODO: Needs to somehow sync touch events up with the game clock


  _createClass(World, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      this.__intervalId = setInterval(function () {
        try {
          _this2.loop.apply(_this2, []);
        } catch (e) {
          _this2.exit(e);
        }
      }, 1000 / this._fps);
    }
  }, {
    key: "__preStep",
    value: function __preStep(time) {
      // we have each instance perform a frame step.
      this.__instances.forEach(function (inst) {
        inst.preStep(time);
      }); // we have each instance perform a frame step.


      this.__controllers.forEach(function (cont) {
        cont.preStep(time);
      });
    }
  }, {
    key: "__postStep",
    value: function __postStep(time) {
      // we have each instance perform a frame step.
      this.__instances.forEach(function (inst) {
        inst.postStep(time);
      }); // we have each instance perform a frame step.


      this.__controllers.forEach(function (cont) {
        cont.postStep(time);
      });

      this.__removeControllers();

      this.__removeParticleEmitters();

      this.__removeViews();

      this.__removeInstances();
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this3 = this;

      this.__preStep(++this.__clock); // we have each instance perform a frame step.


      this.__controllers.forEach(function (cont) {
        cont.step(_this3.__clock);
      }); // we have each instance perform a frame step.


      this.__particleEmitters.forEach(function (part) {
        part.step(_this3.__clock);
      }); // we have each instance perform a frame step.


      this.__instances.forEach(function (inst) {
        inst.step(_this3.__clock);
      }); // check for collisions


      this.__instances.forEach(function (me) {
        if (me.hasCollisionChecking()) {
          var myCollisionGroups = me.getCollidableGroups();
          myCollisionGroups.forEach(function (group) {
            // if there are instances that match the groups im listening for
            if (_this3.__collisionGroups[group] && _this3.__collisionGroups[group].length) {
              // for each of those matching instance types,
              _this3.__collisionGroups[group].forEach(function (other) {
                // if they're not me, and I collide with them
                if (me.__id !== other.__id && me.collides(other.getBounding())) {
                  me.handleCollidedWith(other);
                }
              });
            }
          });
        }
      }); // draw the views


      this.__views.forEach(function (view) {
        view.draw(_this3.__clock);
      });

      this.__postStep(this.__clock);
    }
  }, {
    key: "exit",
    value: function exit() {
      clearInterval(this.__intervalId); //TODO: handle exit
    }
    /****************************************************************************
     INSTANCE FUNCTIONS
     ****************************************************************************/

  }, {
    key: "removeInstance",
    value: function removeInstance(instance) {
      if (instance.__id) {
        // we add their id to the array of instances to remove
        this.__toRemoveInstances.push(instance);
      }

      return instance;
    }
  }, {
    key: "__removeInstances",
    value: function __removeInstances() {
      if (!this.__toRemoveInstances.length) {
        return;
      }

      Functions.disjoinArray2FromArray1(this.__instances, this.__toRemoveInstances, this.__removeFromCollisionGroup);
      this.__toRemoveInstances = [];
    }
  }, {
    key: "addInstance",
    value: function addInstance(instance) {
      if (instance.__id) {
        throw "Instance already added";
      }

      instance.__id = ++this.__instanceKey; // add it to the big list

      this.__instances.push(instance); // also add it according to its collision group


      this.__addToCollisionGroup(instance);

      return instance;
    }
  }, {
    key: "getInstances",
    value: function getInstances() {
      return this.__instances;
    }
    /****************************************************************************
     VIEW FUNCTIONS
     ****************************************************************************/

  }, {
    key: "addView",
    value: function addView(view) {
      if (view.__id) {
        throw "View already added";
      }

      view.__id = ++this.__viewKey;
      view.setWorld(this);

      this.__views.push(view);

      return view;
    }
  }, {
    key: "getViews",
    value: function getViews() {
      return this.__views;
    }
  }, {
    key: "__removeViews",
    value: function __removeViews() {
      if (!this.__toRemoveViews.length) {
        return;
      }

      Functions.disjoinArray2FromArray1(this.__views, this.__toRemoveViews);
      this.__toRemoveViews = [];
    }
  }, {
    key: "removeView",
    value: function removeView(view) {
      if (view.__id) {
        // we add them to the array of views to remove
        this.__toRemoveViews.push(view);
      }

      return view;
    }
    /****************************************************************************
     PARTICLE FUNCTIONS
     ****************************************************************************/

  }, {
    key: "addParticleEmitter",
    value: function addParticleEmitter(emitter) {
      if (emitter.__id) {
        throw "Emitter already added";
      }

      emitter.__id = ++this.__emitterKey;

      this.__particleEmitters.push(emitter);

      return emitter;
    }
  }, {
    key: "removeParticleEmitter",
    value: function removeParticleEmitter(emitter) {
      if (emitter.__id) {
        // we add their id to the array of emitters to remove
        this.__toRemoveParticleEmitters.push(emitter);
      }

      return emitter;
    }
  }, {
    key: "__removeParticleEmitters",
    value: function __removeParticleEmitters() {
      if (!this.__toRemoveParticleEmitters.length) {
        return;
      }

      Functions.disjoinArray2FromArray1(this.__particleEmitters, this.__toRemoveParticleEmitters);
      this.__toRemoveParticleEmitters = [];
    }
  }, {
    key: "getParticleEmitters",
    value: function getParticleEmitters() {
      return this.__particleEmitters;
    }
    /****************************************************************************
     PARTICLE FUNCTIONS
     ****************************************************************************/

  }, {
    key: "addController",
    value: function addController(controller) {
      if (controller.__id) {
        throw "Emitter already added";
      }

      controller.__id = ++this.__controllerKey;

      this.__controllers.push(controller);

      return controller;
    }
  }, {
    key: "removeController",
    value: function removeController(controller) {
      if (controller.__id) {
        // we add their id to the array of emitters to remove
        this.__toRemoveControllers.push(controller);
      }

      return controller;
    }
  }, {
    key: "__removeControllers",
    value: function __removeControllers() {
      if (!this.__toRemoveControllers.length) {
        return;
      }

      Functions.disjoinArray2FromArray1(this.__controllers, this.__toRemoveControllers);
      this.__toRemoveControllers = [];
    }
  }, {
    key: "getControllers",
    value: function getControllers() {
      return this.__controllers;
    }
    /****************************************************************************
     BACKGROUND FUNCTIONS
     ****************************************************************************/

  }, {
    key: "setBackground",
    value: function setBackground(background) {
      this.__background = background;
    }
  }, {
    key: "getBackground",
    value: function getBackground() {
      return this.__background;
    }
    /****************************************************************************
     HELPER FUNCTIONS
     ****************************************************************************/

  }, {
    key: "__addToCollisionGroup",
    value: function __addToCollisionGroup(instance) {
      var group = instance.getCollisionGroup();

      if (!this.__collisionGroups[group]) {
        this.__collisionGroups[group] = [];
      }

      this.__collisionGroups[group].push(instance);
    }
  }, {
    key: "__removeFromCollisionGroup",
    value: function __removeFromCollisionGroup(instance) {
      var i;
      var group = instance.getCollisionGroup();

      if (!this.__collisionGroups[group]) {
        throw "Collision Group does not exist";
      }

      for (i = 0; i < this.__collisionGroups[group].length; i++) {
        if (this.__collisionGroups[group][i].__id === instance.__id) {
          this.__collisionGroups[group].splice(i, 1);

          break;
        }
      }
    }
  }]);

  return World;
}(Generic);

module.exports = World;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
    This script handles drawing the joystick appearance
*/
var Touch = __webpack_require__(11);

var BoundingCircle = __webpack_require__(5);

var _require = __webpack_require__(0),
    Geometry = _require.Geometry,
    Functions = _require.Functions;

var JoystickSprite = __webpack_require__(12);

var Joystick =
/*#__PURE__*/
function (_Touch) {
  _inherits(Joystick, _Touch);

  function Joystick(options) {
    var _this;

    _classCallCheck(this, Joystick);

    var defaultRadius = 40;
    options.tap_distance = 0;
    options.bounding = new BoundingCircle({
      x: options.x,
      y: options.y,
      radius: defaultRadius
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Joystick).call(this, options));
    _this._defaultRadius = defaultRadius;
    _this.__isHeld = false;
    _this.__pullRatio = 1.8; // the operate function is what we will pass joystick motions to

    _this.__operateFunction = null;
    _this.__appearance = new JoystickSprite();
    _this._previousEvent = null;

    _this.onDown(function (evt) {
      _this._previousEvent = evt; //initialize evt
      // we link to itself so that the joystick draws properly

      _this._previousEvent.linkEvent(evt);

      _this.getBounding().updateBounding({
        radius: 4 * _this._defaultRadius
      });

      if (typeof _this.__operateFunction === 'function') {
        if (evt.velocity) {
          evt.velocity.setSpeed(0);
        }

        _this.__operateFunction(evt);
      }
    });

    _this.onUp(function (evt) {
      _this.getBounding().updateBounding({
        radius: _this._defaultRadius
      });

      delete _this._previousEvent;

      if (typeof _this.__operateFunction === 'function') {
        if (evt.velocity) {
          evt.velocity.setSpeed(0);
        }

        _this.__operateFunction(evt);
      }
    });

    _this.onMove(function (evt) {
      if (_this.isDown()) {
        evt.linkEvent(_this.__lastDown);

        if (typeof _this.__operateFunction === 'function') {
          //want to make the max speed the distance we allow the joystick to move
          if (evt.velocity) {
            evt.velocity.setSpeed(Math.min(evt.velocity.getSpeed(), _this._defaultRadius / _this.__pullRatio));
          }

          _this.__operateFunction(evt);
        }

        _this._previousEvent = evt;
      }
    });

    return _this;
  }

  _createClass(Joystick, [{
    key: "onOperate",
    value: function onOperate(callback) {
      this.__operateFunction = callback;
    }
  }, {
    key: "offOperate",
    value: function offOperate() {
      delete this.__operateFunction;
    }
  }, {
    key: "getDrawOptions",
    value: function getDrawOptions() {
      var options = {
        stick: this.getBounding().getCenter(),
        operating: this.isDown()
      };

      if (this._previousEvent && this._previousEvent.velocity) {
        var vector = Functions.clone(this._previousEvent.velocity);
        vector.setSpeed(Math.min(this._defaultRadius / this.__pullRatio, this._previousEvent.velocity.getSpeed()));
        options.stick = Geometry.pointFromVector(options.stick, vector);
      }

      return options;
    }
  }]);

  return Joystick;
}(Touch);

module.exports = Joystick;

/***/ })
/******/ ]);
});
//# sourceMappingURL=twocylinder.js.map