/*
    This script contains the user object
*/
class player extends TwoCylinder.Engine.Entity {
    constructor (options) {
        options = Object.assign({
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : options.x || 0
                ,y : options.y || 0
                ,radius : 20
            })
            ,appearance :  new MyGame.Sprites.Player(options)
        } ,options);

        super(options)
        this.__shooterDelay = 100;
        this.__canShoot = true;
        this.__isShooting = false;
        this.__shootingDirection = 0;
        this.__shooterTimeOut = null;
    }
    setShooting (status){
        this.__isShooting = status;
    }
    isShooting (){
        return this.__isShooting;
    }
    setShootingDirection (angle){
        this.__shootingDirection = angle;
    }
    step (clock){
        this._super('step',clock);
        if(this.__isShooting){
            this.shoot();
        }
    }
    shoot (){
        if(this.__canShoot){
            this.__canShoot = false;
            window.game.getWorld().addInstance(new window.MyGame.Entities.Bullet({
                x : this.getBounding().x
                ,y : this.getBounding().y
                ,direction : this.__shootingDirection
            }));
            
            var that = this;
            this.__shooterTimeOut = setTimeout(function(){
                that.__canShoot = true;
            }, this.__shooterDelay);
        }
    }
}

MyGame.Entities.Player = player