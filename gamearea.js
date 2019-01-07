class GameArea {
    constructor(width, height) {
        this.fps = 60;
        this.score = 0;
        this.keyDownCallback = function (e) {
            renderCallback.onKeyDown(e)
        }
        this.keyUpCallback = function (e) {
            renderCallback.onKeyUp(e)
        }
        this.width = width
        this.height = height
        this.canvas = document.createElement("canvas")
        this.canvas.width = width;
        this.canvas.height = height;
        this.frameNo = 0;
        this.context = this.canvas.getContext("2d");
    }

    start(player, map, renderCallback) {
        this.map = map
        player.attachTo(this)
        this.listener = renderCallback
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(this.onGameUpdate, 1000/this.fps, this);
        window.addEventListener("keydown", this.keyDownCallback)
        window.addEventListener("keyup", this.keyUpCallback)
        // window.addEventListener("mousemove", function (e) {
        //     myGameArea.x = e.pageX;
        //     myGameArea.y = e.pageY;
        // })
        // window.addEventListener('touchmove', function (e) {
        //     myGameArea.x = e.touches[0].screenX;
        //     myGameArea.y = e.touches[0].screenY;
        // })
    }

    setLevel(map) {
        this.map = map;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop() {
        window.removeEventListener("keydown", this.keyDownCallback)
        window.removeEventListener("keyup", this.keyUpCallback)
        clearInterval(this.interval);
        this.listener = null;
        document.body.removeChild(this.canvas);
    }

    setBackground(src, duplicated) {
        if (duplicated) {
            this.background = new CBackground(this.canvas.width, this.canvas.height, src, 0, 0)
        } else {
            this.background = new CImage(this.canvas.width, this.canvas.height, src, 0, 0)
        }
    }

    onGameUpdate(game) {
        game.clear();
        if (game.background != null) {
            game.background.speedX = -1;
            game.background.newPos();
            game.background.update(game.canvas)
        }
        this.map.onNextFrame(game)
        if (game.listener != null) {
            game.listener.onUpdate()
        }
        game.frameNo++;
    }
}