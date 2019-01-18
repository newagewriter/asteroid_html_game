class RocketFactory {
    /**
     * 
     * @param {string} rocketType 
     */
    constructor(rocketType) {
        this.rocketType = rocketType;
        /**
        * @type Rocket
        */
        this.templateObject = eval("new " + this.rocketType + "(-1, -1)");
    }

    create(x, y) {
        return eval("new " + this.rocketType + "(" + x + ", " + y + ")");
    }

    setRocketType(type) {
        this.rocketType = type;
    }

    getRocketSpeed() {
        return this.templateObject.rocketSpeed();
    }

    getRocketImage() {
        return this.templateObject.image;
    }
}

class Rocket extends CImage {
    constructor(width, height, rocketImage, x, y, hit) {
        super(width, height, rocketImage, x - width/2, y);
        this.hit = hit;
    }

    rocketSpeed() {
        return PLAY_SHOOT_PER_RENDER;
    }
}

class BaseRocket extends Rocket {
    constructor(x, y) {
        super(13, 19, "assets/rocket_missile.png", x, y, 30);
    }
}

class BigRocket extends Rocket {
    constructor(x, y) {
        super(20, 28, "assets/bigrocket_missile.png", x, y, 150);
    }

    rocketSpeed() {
        return 20;
    }
}

class LaserWave extends Rocket {
    constructor(x, y) {
        super(100, 28, "assets/laser_wave.png", x, y, 200);
    }

    
    rocketSpeed() {
        return 40;
    }
}