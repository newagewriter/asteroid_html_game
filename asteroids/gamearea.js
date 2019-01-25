const SCORE_BY_FRAME = 0.1;

class GameArea { 
    constructor(width, height) {
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
        requestAnimationFrame(this.onGameUpdate);
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

    onGameUpdate() {
        this.clear();
        if (this.background != null) {
            if (this.orientation == "vertical") {
                this.background.speedY = 1;
                this.background.speedX = 0;
            } else {
                this.background.speedX = -1;
                this.background.speedY = 0;
            }
            
            this.background.newPos();
            this.background.update(this.canvas);
        }
        this.updateCurrentMap();
        if (this.listener != null) {
            this.listener.onUpdate();
        }
        if (this.infoText) {
            var ctx = this.canvas.getContext("2d");
            var centerX = (this.width - ctx.measureText(this.infoText).width ) / 2;
            var centerY = this.height / 2;
            ctx.font = "30px Consolas";
            ctx.fillStyle = "white";
            ctx.fillText(this.infoText, centerX, centerY);
        }
        this.score += SCORE_BY_FRAME;
        this.scoreView.text = "SCORE: " + Math.floor(this.score);
        this.scoreView.update(this.canvas);
        this.frameNo++;
        this.infoText = null;
    }

    showInfoText(text) {
        this.infoText = text;
    }

    playSound(sound) {
        this.sound.setSource(sound);
        this.sound.play();
    }
}