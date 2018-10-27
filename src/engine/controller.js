const Root = require('./root')

class Controller extends Root {
    constructor(options) {
        super(options)
        this.world = options.world
    }

    preStep (worldClock){
        return
    }
    step (worldClock){
        return
    }
    postStep (worldClock){
        return
    }
}

module.exports = Controller