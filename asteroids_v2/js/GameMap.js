const ASTEROID_CREATE_FRAME = 100; 

const ASTEROID_SIZE = 100;
const ASTEROID_MIN_SIZE = 50;

class GameMap {
    constructor() {
        /**
         * @type Asteroid[]
         */
        this.asteroids = [];

    }

    /**
     * 
     * @param {Game} game 
     * @param {number} currentFrame 
     */
    update(game, currentFrame) {
        if (currentFrame % ASTEROID_CREATE_FRAME == 0) {
            this.createAsteroids(game, ASTEROID_SIZE, 2, 100);
        }
        console.log("asteroids count:" + this.asteroids.length);
        this.asteroids = this.asteroids.filter(item => {
            item.update();
            if (item.y > game.height) {
                return false;
            }
            if (game.colisionManager.hitTest(game.player, item)) {
                console.log("hit");
                game.player.hit(5);
                return false;
            }

            return true;
        });
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        this.asteroids.forEach(item => {
            item.draw(context);
        });
    }

    createAsteroids(game, maxSize, count, life) {
        var w = game.canvas.width - maxSize;
        for (var i = 0; i < count; ++i) {
            var y = 0;
            var x = Math.floor(Math.random() * w);
            var height = Math.floor(Math.random()*(maxSize - ASTEROID_MIN_SIZE + 1)) + ASTEROID_MIN_SIZE;
            var factor = height / maxSize;
            this.asteroids.push(new Asteroid(x, y, Math.floor(height * 1.3), height, "assets/asteroid.png", life + life * factor));
        }
    }
}