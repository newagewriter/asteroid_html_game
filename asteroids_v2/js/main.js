/**
 * @type Game
 */
var game = null;
/**
 * @type CImage
 */
var revertImage = null;

function startGame() {
    game = new Game(700, 850);
    var gameDiv = document.getElementById("gameScreen");
    game.addComponent(new Component(20, 40, 100, 100, "white"));
    game.addComponent(new Component(60, 80, 100, 100, "blue"));
    game.addComponent(new CImage(60, 80, 100, 110, "assets/player.png"));
    revertImage = new CImage(250, 80, 100, 120, "assets/player.png");
    revertImage.setRotation(45, true);
    game.addComponent(revertImage);
    game.start(gameDiv);
}

function stopGame() {
    game.stop();
}

function changeRotation() {
    if (revertImage) {
        /**
         * @type HTMLInputElement
         */
        var rotation = document.getElementById("rotate");
        console.log(rotation.value);
        revertImage.setRotation(Number.parseInt(rotation.value));
    }
}