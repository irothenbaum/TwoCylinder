/*
    This script handles the base configuration of the game
*/

window.MyGame = {
    Entities : {}
    ,Sprites : {}
};

var myGame;
var viewport;
var player;

function initGame() {
    myGame = new TwoCylinder.Engine.Game()
    var world = new TwoCylinder.Engine.World({fps: 30, width: 2000, height: 2000});
    var canvas = document.getElementById('world');
    viewport = new TwoCylinder.Engine.View({
        canvas: canvas
        , bounding: new TwoCylinder.Engine.BoundingBox({
            width: parseInt(window.getComputedStyle(canvas).width)
            , height: parseInt(window.getComputedStyle(canvas).height)
            , origin_x: 0
            , origin_y: 0
        })
    });
    world.addView(viewport);
    world.setBackground(new TwoCylinder.Engine.Background({color: '#691E3E'}));

    myGame.setWorld(world);

    createPlayer();
    createControls();

    for (var i = 0; i < 200; i++) {
        world.addInstance(
            new MyGame.Entities.Enemy({
                x: parseInt(world.getBounding().width * Math.random())
                , y: parseInt(world.getBounding().height * Math.random())
            })
        );
    }

    viewport.followInstance(player);
}

function createPlayer (){
    player = new MyGame.Entities.Player({x:200,y:100});
    myGame.getWorld().addInstance(player);
}

function createControls(){
    // create the Move Stick
    var joystickMove = new TwoCylinder.IO.Joystick({
        x: 150
        ,y: viewport.getBounding().height - 150
        ,view : viewport
    });

    joystickMove.onOperate(function(event){
        var velocity = _.clone(event.velocity);
        velocity.setSpeed(velocity.getSpeed()/3);
        player.setVelocity(velocity);
    });

    // create the Shoot stick
    var joystickShoot = new TwoCylinder.IO.Joystick({
        x: viewport.getBounding().width - 150
        ,y: viewport.getBounding().height - 150
        ,view : viewport
    });

    joystickShoot.onOperate(function(event){
        if(event.velocity.getSpeed() < 10) {
            player.setShooting(false);
            return;
        }else if(!player.isShooting()){
            player.setShooting(true);
        }
        player.setShootingDirection(event.velocity.getDirection());
    });


    viewport.addIO(joystickMove);
    viewport.addIO(joystickShoot);
}
