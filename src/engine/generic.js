const Root = require('./root')
const Bounding = require ('./bounding/bounding')

class Generic extends Root {

    constructor (options) {
        super (options)
        this.setBoundingBox(options.bounding)
    }

    collides (bounding) {
        return this._bounding && this._bounding.collides(bounding)
    }

    getBounding () {
        return this._bounding
    }

    setBounding (b) {
        if(!b && ! (b instanceof Bounding)){
            throw "All objects must have a true bounding"
        }
        return this._bounding = b
    }
}

module.exports = Generic