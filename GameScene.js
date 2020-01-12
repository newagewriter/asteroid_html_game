let INFINITY = -1;

class GameScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);
        this.asteriods = this.physics.add.group("asteriods");
        var s1 = this.physics.add.sprite(100, 200, "asteroid");
        this.asteriods.add(s1);
        s1.play("asteroid_anim");
        s1.setVelocity(0, 100);
        
        
        this.title = this.add.text(config.width/2, 20, "Asteroids", {font: "42px Arial", fill: "#22ff11"});
        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.setCollideWorldBounds(true);
        
        this.player.play("ship_anim");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.background.tilePositionY -= 0.8;
        this.checkPlayerControl();
        this.checkAsteroidsPosition();
    }

    checkPlayerControl() {
        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }
    }
    
    checkAsteroidsPosition() {
        this.asteriods.children.iterate(function(child) {
            if (child.y >= config.height) {
                child.y = -50;
            }
        });
    }

    resetAsteroid(asteroid) {
        
    }
}