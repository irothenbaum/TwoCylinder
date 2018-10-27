const Bounding = require('./engine/bounding/bounding')
const BoundingPoint = require('./engine/bounding/bounding_point')
const BoundingCircle = require('./engine/bounding/bounding_circle')
const BoundingBox = require('./engine/bounding/bounding_box')

const Appearance = require('./engine/appearance')
const Background = require('./engine/background')
const Entity = require('./engine/entity')
const Game = require('./engine/game')
const Generic = require('./engine/generic')
const Particle = require('./engine/particle')
const ParticleEmitter = require('./engine/particle_emitter')
const Root = require('./engine/root')
const Vector = require('./engine/vector')
const World = require('./engine/world')

let EngineContainer = {
    Bounding,
    BoundingBox,
    BoundingCircle,
    BoundingPoint,
    Appearance,
    Background,
    Entity,
    Game,
    Generic,
    ParticleEmitter,
    Particle,
    Root,
    World,
    Vector
}

const {
    Functions,
    Geometry,
    Constants
} = require('./engine/utilities')

let UtilitiesContainer = {
    Functions,
    Constants,
    Geometry,
}

const Event = require('./io/event')
const Touch = require('./io/touch')
const Joystick = require('./io/joystick')

let IOContainer = {
    Event,
    Touch,
    Joystick
}


const JoystickSprite = require('./sprites/joystick')
let SpritesContainer = {
    Josystick: JoystickSprite
}

TwoCylinder = {
    Engine: EngineContainer,
    IO: IOContainer,
    Sprites: SpritesContainer,
    Utilities: UtilitiesContainer
};

module.exports = TwoCylinder