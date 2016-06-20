# TwoCylinder

TwoCylinder is a lightweight 2D game engine for the web browser. It uses native JavaScript and the HTML5 canvas to build virtual 2 dimensional worlds.

### Current Version
0.0.0

### Key Features

  - point, line, circle, and box collision checking
  - multiple view rendering
  - multiple touch (and mouse) handling
  - built in, and extensible, core classes
      - ( Entity, Appearance, Bounding, Touch, and View )
  - exmaple mini-game provided

### Runtime Dependencies

* [underscore] - A functional javascript library

### Development

Want to contribute? Great!

You can view and extend the source code by checking out files in the `src` directory. Any new files need just be added to the `Gruntfile.js` to be included in the distribution.

Please base all pull requests off the `develop` branch.

### Development Dependencies

* [Grunt-concat] - used to compile the source code into the distribution file.
* [Grunt] - used to run grunt-concat


**Please refer to the package.json file for the most up-to-date dependencies

   [underscore]: <http://underscorejs.org/>
   [grunt]: <http://gruntjs.com>
   [grunt-concat]: <https://github.com/gruntjs/grunt-contrib-concat>
