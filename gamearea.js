const SCORE_BY_FRAME = 0.1;

class GameArea { 
    constructor(width, height) {
        this.fps = 60;
        this.score = 0;
        this.keyDownCallback = function (e) {
            renderCallback.onKeyDown(e);
        };
        this.keyUpCallback = function (e) {
            renderCallback.onKeyUp(e);
        };
        /**
         * @type GameMap[]
         */
        this.maps = [];
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.frameNo = 0;
        this.context = this.canvas.getContext("2d");
        this.infoText = null;
        this.orientation = "vertical";
        this.scoreView = new CText("30px", "Consolas", "white", 40, 40, "text");
        this.sound  = new Sound("bounce.mp3");
    }

    start(player, maps, renderCallback) {
        this.maps = maps;
        this.currentIndex = 0;
        this.maps[this.currentIndex].clear();
        player.attachTo(this);
        this.listener = renderCallback;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(this.onGameUpdate, Math.floor(1000 /  this.fps), this);
        window.addEventListener("keydown", this.keyDownCallback);
        window.addEventListener("keyup", this.keyUpCallback);
    }

    currentMap() {
        return this.maps[this.currentIndex];
    }

    hasNextMap() {
        return this.maps != null && this.currentIndex + 1 < this.maps.length;
    }

    nextLevel() {
        if (this.hasNextMap()) {
            this.currentIndex++;
            this.maps[this.currentIndex].clear();
        }
    }

    updateCurrentMap() {
        if (this.maps[this.currentIndex]) {
            this.maps[this.currentIndex].onNextFrame(this);
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop() {
        window.removeEventListener("keydown", this.keyDownCallback);
        window.removeEventListener("keyup", this.keyUpCallback);
        clearInterval(this.interval);
        this.listener = null;
        document.body.removeChild(this.canvas);
        this.sound.stop();
        this.sound.clean();
    }

    setBackground(src, wide, orientation) {
        this.orientation = orientation || "vertical";
        var width = this.canvas.width;
        var height = this.canvas.height;
        if (wide) {
            if (orientation == "vertical") {
                height *= 2;
            } else {
                width *= 3;
            }
        }
        this.background = new CBackground(width, height, src, 0, 0, orientation);
    }

    onGameUpdate(game) {
        game.clear();
        if (game.background != null) {
            if (game.orientation == "vertical") {
                game.background.speedY = 1;
                game.background.speedX = 0;
            } else {
                game.background.speedX = -1;
                game.background.speedY = 0;
            }
            
            game.background.newPos();
            game.background.update(game.canvas);
        }
        game.updateCurrentMap();
        if (game.listener != null) {
            game.listener.onUpdate();
        }
        if (game.infoText) {
            var ctx = game.canvas.getContext("2d");
            var centerX = (game.width - ctx.measureText(game.infoText).width ) / 2;
            var centerY = game.height / 2;
            ctx.font = "30px Consolas";
            ctx.fillStyle = "white";
            ctx.fillText(game.infoText, centerX, centerY);
        }
        game.score += SCORE_BY_FRAME;
        game.scoreView.text = "SCORE: " + Math.floor(game.score);
        game.scoreView.update(game.canvas);
        game.frameNo++;
        game.infoText = null;
    }

    showInfoText(text) {
        this.infoText = text;
    }

    playSound(sound) {
        this.sound.setSource(sound);
        this.sound.play();
    }
}