class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        this.load.image('background', "assets/space.jpg");
        this.load.spritesheet("ship", "assets/player_sprite.png", {
            frameWidth: 48,
            frameHeight: 64
        });
        this.load.spritesheet("asteroid", 'assets/asteroid_sprite.png', {frameWidth: 96, frameHeight: 96});
    }

    create() {
        this.anims.create({
            key: "ship_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: INFINITY
        });
        this.anims.create({
            key: "asteroid_anim",
            frames: this.anims.generateFrameNumbers("asteroid"),
            frameRate: 10,
            repeat: INFINITY
        });
        this.scene.start("playGame");
    }
}