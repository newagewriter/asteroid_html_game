const GAME_GRAVITY = 3;

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
    }

    stop() {
        this.started = false;
        cancelAnimationFrame(renderFrame);
        this.canvas.parentElement.removeChild(this.canvas);
    }

    /**
     * 
     * @param {Component} component 
     */
    addComponent(component) {
        this.components.push(component);
    }

    update() {
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
            this.player.draw(this.bufferCtx);
            this.components.forEach( component => {
                console.log("draw component");
                component.draw(this.bufferCtx);
            });

            this.ctx.drawImage(this.bufferCanvas, 0, 0, this.canvas.width, this.canvas.height);

            this.drawInfoText(this.bufferCanvas);
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
        this.player = new Player(this.width / 2, this.height - 100, 50, 60);
    }
}

/**
 * 
 * @param {number} timestamp 
 */
function renderFrame(timestamp) {
    if (game.started) {
        game.update();
        game.draw();
    
        requestAnimationFrame(this.renderFrame);
    }
}