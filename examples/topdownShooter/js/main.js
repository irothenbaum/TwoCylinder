/*
    This script handles the base configuration of the game
*/

window.MyGame = {
    Entities : {}
    ,Sprites : {}
};

MyGame.Game = TwoCylinder.Engine.Game.extend({
    initialize : function(){
        _.bindAll(this,'createControls');
        var world = new TwoCylinder.Engine.World({fps:30, width:2000,height:2000});
        var canvas = document.getElementById('world');
        this.viewport = new TwoCylinder.Engine.View({
            canvas : canvas
            ,bounding : new TwoCylinder.Engine.BoundingBox({
                width : parseInt(window.getComputedStyle(canvas).width)
                ,height : parseInt(window.getComputedStyle(canvas).height)
                ,origin_x : 0
                ,origin_y : 0
            })
        });
        world.addView(this.viewport);
        world.setBackground(new TwoCylinder.Engine.Background({color:'#691E3E'}));
        
        this.setWorld(world);
        
        this.createPlayer();
        this.createControls();
        
        for(var i=0; i<200; i++){
            world.addInstance(
                new MyGame.Entities.Enemy({
                    x:parseInt(world.getBounding().width*Math.random())
                    ,y:parseInt(world.getBounding().height*Math.random())
                })
            );
        }
        
        this.viewport.followInstance(this.player);
    }
    ,createPlayer : function(){
        this.player = new MyGame.Entities.Player({x:200,y:100});
        this.getWorld().addInstance(this.player);
    }
    ,createControls : function(){
        var that = this;
        
        // create the Move Stick
        this.joystickMove = new TwoCylinder.IO.Joystick({
            x: 150
            ,y: this.viewport.getBounding().height - 150
            ,view : this.viewport
        });
        
        this.joystickMove.onOperate(function(event){
            var velocity = _.clone(event.velocity);
            velocity.setSpeed(velocity.getSpeed()/3);
            that.player.setVelocity(velocity);
        });
        
        // create the Shoot stick
        this.joystickShoot = new TwoCylinder.IO.Joystick({
            x: this.viewport.getBounding().width - 150
            ,y: this.viewport.getBounding().height - 150
            ,view : this.viewport
        });
        
        this.joystickShoot.onOperate(function(event){
            if(event.velocity.getSpeed() < 10) {
                that.player.setShooting(false);
                return;
            }else if(!that.player.isShooting()){
                that.player.setShooting(true);
            }
            that.player.setShootingDirection(event.velocity.getDirection());
        });
        
        
        this.viewport.addIO(this.joystickMove);
        this.viewport.addIO(this.joystickShoot);
    }
});
