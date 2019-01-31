class Player extends CImage {
    constructor(x, y, width, height, life = 100) {
        super(x, y, width, height, "assets/player.png");
        this.life = life;
    }

    hit(power) {
        this.life -= power;
    }
}