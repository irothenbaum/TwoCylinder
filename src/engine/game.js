const Root = require('./root')

class Game extends Root {
    constructor() {
        super()
        this.__world = undefined;
    }

    start() {
        return this.getWorld().start();
    }

    exit() {
        return this.getWorld().exit();
    }

    setWorld(w) {
        this.__world = w;
    }

    getWorld() {
        return this.__world;
    }
}

module.exports = Game