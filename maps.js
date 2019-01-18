const ASTERIOD_SPEED = 5;
const DEFEATE_ASTEROID_POINTS = 20;
const ASTEROID_MAX_SIZE = 100;
const ASTEROID_MIN_SIZE = 50;

class GameMap {
    constructor(config) {
        this.delay = 120;
        /**
         * @type Asteroid[]
         */
        this.asteroids = [];
        /**
         * @type Bonus[]
         */
        this.bonuses = [];
        Object.assign(this, config);
    }

    createAsteroidsIn(game, maxSize, count, life) {
        var w = game.canvas.width - maxSize;
        for (var i = 0; i < count; ++i) {
            var y = 0;
            var x = Math.floor(Math.random() * w);
            var height = Math.floor(Math.random()*(maxSize - ASTEROID_MIN_SIZE + 1)) + ASTEROID_MIN_SIZE;
            var factor = height / maxSize;
            this.asteroids.push(new Asteroid(Math.floor(height * 1.3), height, "assets/asteroid.png", x, y, life + life * factor));
        }
    }
    
    clear() {
        this.delay = 120;
        this.asteroids = [];
        this.bonuses = [];
    }

    /**
     * 
     * @param {GameArea} game 
     */
    onNextFrame(game) {
        if (this.delay > 0) {
            game.showInfoText("Level " + this.level);
            this.delay--;
            return;
        }
        console.log("Level " + this.level);
        if (game.frameNo == 1 || everyInterval(game.frameNo, this.createTime)) {
            this.createAsteroidsIn(game, ASTEROID_MAX_SIZE, this.count, this.asteroidLife);
        }
        this.asteroids = this.asteroids.filter(asteroid => {
            if (asteroid.y > game.height) {
                return false;
            }
            if (asteroid.life <= 0) {
                game.playSound("assets/sounds/defeate.mp3");
                game.score += DEFEATE_ASTEROID_POINTS;
                var rand = Math.floor(Math.random() * 10);
                if (rand == 1) {
                    this.bonuses.push(new RocketBonus(asteroid.x, asteroid.y, randomRocket()));
                } else if (rand == 2) {
                    this.bonuses.push(new ShieldBonus(asteroid.x, asteroid.y));
                }
                return false;
            } else {
                asteroid.y += ASTERIOD_SPEED;
                asteroid.update(game.canvas);
                return true;
            }
        });
    }
}

var maps = [new GameMap({
        level: 1,
        bonusesType: ["shield", "rocket"],
        createTime: 80,
        count: 2,
        asteroidLife: 100
    }),
    new GameMap({
        level: 2,
        bonusesType: ["shield", "rocket"],
        asteroids: [],
        createTime: 80,
        count: 2,
        asteroidLife: 150
    }),
    new GameMap({
        level: 3,
        bonusesType: ["shield", "rocket"],
        asteroids: [],
        createTime: 70,
        count: 3,
        asteroidLife: 150
    }),
    new GameMap({
        level: 4,
        bonusesType: ["shield", "rocket"],
        asteroids: [],
        createTime: 60,
        count: 4,
        asteroidLife: 200
    }),
    new GameMap({
        level: 5,
        bonusesType: ["rocket"],
        asteroids: [],
        createTime: 50,
        count: 5,
        asteroidLife: 250
    })
];

function everyInterval(frameNo, targetFrame) {
    return (frameNo / targetFrame) % 1 == 0; 
}

function randomRocket() {
    var rand = Math.floor(Math.random() * 3);
    switch (rand) {
        case 0:
            return new RocketFactory("BigRocket");
        case 1:
            return new RocketFactory("LaserWave");

        default:
            return new RocketFactory("BaseRocket");
    }
}

