class Enemy extends CImage {

    constructor(width, height, image, life, x, y) {
        super(width, height, image, x, y);
        this.rockets = [];
        this.shootSeries = 5;
        this.life = life;
        this.rocketFactory = new RocketFactory("BaseRocket");
        this.shootBonus = null;
        this.shieldBonus = null;
    }

    newPos() {
        this.x += this.speedX;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.game && this.x > (this.game.width - this.width)) {
            this.x = this.game.width - this.width;
        }
        this.y += this.speedY; 
        this.hitBottom();
        this.hitTop();
    }

    attachTo(game) {
        this.game = game;
        this.shootSound = new Sound("assets/sounds/shoot.mp3");
    }

    detached(game) {
        this.game = null;
        this.shootSound.stop();
        this.shootSound.clean();
        this.rockets = [];
        this.bonus = null;
    }

    hitBottom() {
        if (this.game) {
            var rockbottom = this.game.canvas.height - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            }
        }
    }
    hitTop() {
        if (this.game) {
            var rockTop = 0;
            if (this.y < rockTop) {
                this.y = rockTop;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            }
        }
    }
    shoot() {
        if (this.shootSeries % this.rocketFactory.getRocketSpeed() == 0) {
            this.rockets.push(this.rocketFactory.create(this.x + (this.width/2), this.y + this.height));
            this.shootSound.stop();
            this.shootSound.play();
        }
        this.shootSeries++;
    }

    shootRelease() {
        this.shootSeries = this.rocketFactory.getRocketSpeed();
    }

    update(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(1, -1);
        var y = this.y;
        this.y = (this.y + this.height) * - 1;
        super.update(canvas);
        
        this.rockets.forEach(function(val, index, array) {
            val.y += 5;
            var ry = val.y;
            val.y = (val.y + val.height) * -1;
            val.update(canvas);
            val.y = ry;
        });
        ctx.restore();
        this.y = y;
    }
}
