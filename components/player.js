/**
 * Player class
 */
class Player extends CImage {

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {string} image 
     */
    constructor(width, height, image) {
        super(width, height, image, 0, 0);
        this.rockets = [];
        this.shootSeries = 5;
        this.rocketFactory = new RocketFactory("BaseRocket");
        this.shootBonus = null;
        this.shieldBonus = null;
        this.shadowBlur = 10;
        this.direction = 1;
        this.shadowY = 0;
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
        this.x = (game.width - this.width) / 2;
        this.y = game.height - 20;
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
            this.rockets.push(this.rocketFactory.create(this.x + (this.width/2), this.y));
            this.shootSound.stop();
            this.shootSound.play();
        }
        this.shootSeries++;
    }

    shootRelease() {
        this.shootSeries = this.rocketFactory.getRocketSpeed();
    }

    setBonus(bonus) {
        if (bonus.type == "rocket") {
            this.rocketFactory = bonus.rocketFactory;
        } else {
            this.shieldBonus = bonus;
        }
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    update(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.shadowColor = 'red';
        ctx.shadowOffsetX = this.shadowY - this.speedX/2;
		ctx.shadowOffsetY = 20;
        ctx.shadowBlur = this.shadowBlur;
        this.nextBlur();
        super.update(canvas);
        ctx.restore();
        if (this.shieldBonus != null) {
            this.shieldBonus.time -= 1000 / this.game.fps;
            if (this.shieldBonus.time <= 0) {
                this.shieldBonus = null;
            } else {
                ctx.drawImage(this.shieldBonus.image, this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            }
        }
        if (this.shootBonus != null) {
            this.shootBonus.time -= 1000 / this.game.fps;
            if (this.shootBonus.time <= 0) {
                this.shootBonus = null;
            }
        }
        
        this.rockets.forEach(function(val, index, array) {
            val.y -= 5;
            val.update(canvas);
        });
    }

    nextBlur() {
        this.shadowBlur += this.direction;
        if (this.shadowBlur == 30) {
            this.direction = -1;
        } 
        if (this.shadowBlur <= 10) {
            this.direction = 1;
        }
    }
}