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
        requestAnimationFrame(renderFrame);
        this.createPlayer();
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        this.loadMap();

    }

    stop() {
        this.started = false;
        cancelAnimationFrame(renderFrame);
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
        this.movePlayerIfNeeded();
        this.player.update();
        this.components.forEach(component => {
            //component.y += GAME_GRAVITY;
            component.update();
        });

        this.frameNo++;
    }

    draw() {
        if (this.bufferCtx) {
            this.drawBackground(this.bufferCanvas.getContext("2d"));
            this.map.draw(this.bufferCtx);
            this.player.draw(this.bufferCtx);
            this.components.forEach( component => {
                component.draw(this.bufferCtx);
            });

            this.drawInfoText(this.bufferCanvas);

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
    showInfoText(text) {
        this.infoText = text;
    }

    /**
     * Draw game an game component on the screen
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawInfoText(ctx) {
        if (this.infoText) {
            var centerX = (this.width - ctx.measureText(this.infoText).width ) / 2;
            var centerY = this.height / 2;
            ctx.font = "30px Consolas";
            ctx.fillStyle = "white";
            ctx.fillText(this.infoText, centerX, centerY);
            this.infoText = null;
        }
    }

    createPlayer() {
        this.player = new Player(this.width / 2, this.height - 100, 50, 60, 100);
        this.playerLife = new Component(10, this.height - 40, 100, 20, "red");
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
}

/**
 * 
 * @param {number} timestamp 
 */
function renderFrame(timestamp) {
    if (game.started) {
        game.update(timestamp);
        game.draw();
    
        requestAnimationFrame(this.renderFrame);
    }
}