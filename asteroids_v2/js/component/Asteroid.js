const ASTEROID_SPEED = 5; 

class Asteroid extends CImage {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} imageSource 
     * @param {number} life 
     */
    constructor(x, y, width, height, imageSource, life) {
        super(x, y, width, height, imageSource);
        this.life = life;
        this.speedY = ASTEROID_SPEED;
    }
}