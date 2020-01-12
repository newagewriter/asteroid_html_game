
let gameSettings = {
    playerSpeed: 200
};

var config = {
    type: Phaser.AUTO,
    width: 600, 
    height: 800,
    backgroundColor: 0x000000,
    scene: [Menu, GameScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    gameSettings: gameSettings
};

var game = new Phaser.Game(config);

