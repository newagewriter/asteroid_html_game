const GAME_GRAVITY = 3;
const PLAYER_SPEED = 5;

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACE = 32;

class Game {
    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        console.log("game create");
        /**
         * @type Component[]
         */
        this.components = [];
        /**
         * @type HTMLCanvasElement
         */
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");

        /**
         * @type HTMLCanvasElement
         */
        this.bufferCanvas = document.createElement("canvas");
        this.bufferCanvas.width = width;
        this.bufferCanvas.height = height;
        this.bufferCtx = this.bufferCanvas.getContext("2d");
        this.score = 0;
        this.started = false;
        /**
         * @type Player
         */
        this.player = null;
        this.keys = [];
        /**
         * @type GameMap
         */
        this.map = null;
        /**
         * @type ColisionManager
         */
        this.colisionManager = new ColisionManager();
    }

    /**
     * 
     * @param {HTMLDivElement} gameDiv
     */
    start(gameDiv) {
        this.started = true;
        this.frameNo = 0;
        gameDiv.appendChild(this.canvas);
        requestAnimationFrame(this.renderFrame.bind(this));
        this.createPlayer();
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        this.loadMap();

    }

    stop() {
        this.started = false;
        cancelAnimationFrame(this.renderFrame);
        this.canvas.parentElement.removeChild(this.canvas);
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    /**
     * 
     * @param {Component} component 
     */
    addComponent(component) {
        this.components.push(component);
    }

    /**
     * 
     * @param {number} timestamp 
     */
    update(timestamp) {
        this.map.update(this, this.frameNo);
        if (this.player) {
            this.movePlayerIfNeeded();
            this.player.update();
            if (this.player.life <= 0) {
                this.playerLife = null;
                this.gameOver();
            }
            if (this.playerLife)  {
                this.playerLife.shape.width = this.player.life;
            }
        }
        
        this.components.forEach(component => {
            //component.y += GAME_GRAVITY;
            component.update();
        });

        this.frameNo++;
    }

    draw() {
        if (this.bufferCtx) {
            this.drawBackground(this.bufferCtx);
            this.map.draw(this.bufferCtx);
            if (this.player)
                this.player.draw(this.bufferCtx);
            this.components.forEach( component => {
                component.draw(this.bufferCtx);
            });

            this.drawInfoText(this.bufferCtx);

            if (this.playerLife)  {
                this.playerLife.draw(this.bufferCtx);
            }  
            this.ctx.drawImage(this.bufferCanvas, 0, 0, this.canvas.width, this.canvas.height);  
        }
    }

    /**
     * Draw game background
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawBackground(ctx) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
        ctx.restore();
    }

    /**
     * Method set info text that will be display in next frame
     * @param {string} text 
     */
    showInfoText(text, time = 0) {
        var date = new Date();
        this.textTime = date.getTime() + time;
        this.infoText = text;
    }

    /**
     * Draw game an game component on the screen
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawInfoText(ctx) {
        if (this.infoText) {
            ctx.font = "30px Consolas";
            var textWidth = ctx.measureText(this.infoText).width;
            console.log("text length:" + textWidth);
            console.log("WIDTH:" + this.width);
            var centerX = (this.width - textWidth) / 2;
            var centerY = this.height / 2;
            ctx.fillStyle = "white";
            ctx.fillText(this.infoText, centerX, centerY);
            var date = new Date();
            if (this.textTime < date.getTime()) {
                this.infoText = null;
            }
        }
    }

    createPlayer() {
        this.player = new Player(this.width / 2, this.height - 100, 50, 60, 100);
        /**
         * @type Component
         */
        this.playerLife = new Component(10, this.height - 40, this.player.life, 20, "red");
    }

    loadMap() {
        this.map = new GameMap(); 
    }

    /**
     * 
     * @param {Event} event 
     */
    onKeyDown(event) {
        game.keys[event.keyCode] = true;
    }

    onKeyUp(event) {
        game.keys[event.keyCode] = false;
    }

    movePlayerIfNeeded() {
        this.player.speedX = 0;
        this.player.speedY = 0;
        if (this.keys[KEY_LEFT]) {
            this.player.speedX -= PLAYER_SPEED;
        } 
        if (this.keys[KEY_RIGHT]) {
            this.player.speedX += PLAYER_SPEED;
        }
        // if (this.keys[KEY_UP]) {
        //     this.player.speedY -= PLAYER_SPEED;
        // }
        // if (this.keys[KEY_DOWN]) {
        //     this.player.speedY += PLAYER_SPEED;
        // }
    }

    gameOver() {
        this.showInfoText("Game Over", 3000);
        this.started = false;
        this.map.clear();
        var game = this;
        game.player = null;
        setTimeout(() => game.stop(), 3000);
    }
    /**
     * 
     * @param {number} timestamp 
     */
    renderFrame(timestamp) {
        if (this.started) {
            this.update(timestamp);
            this.draw();
        
            requestAnimationFrame(this.renderFrame.bind(this));
        }
   }
}