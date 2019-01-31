
class Component {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     */
    constructor(x, y, width, height, color) {
        /**
         * @type Rectangle
         */
        this.shape = new Rectangle(x, y, width, height);
        this.color = color;
        this.transformMatrix = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    /**
     * 
     * @param {number} rotation 
     * @param {boolean} animate
     */
    setRotation(rotation, animate) {
        this.rotation = rotation;
    }

    update() {
        this.shape.x += this.speedX;
        this.shape.y += this.speedY;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        context.save();
        context.rotate(this.rotation);
        context.translate(this.translateX, this.translateY);
        context.fillStyle = this.color;
        context.fillRect(this.getX(), this.getY(), this.width(), this.height());
        context.restore();
    }

    getX() {
        return this.shape.x;
    }

    getY() {
        return this.shape.y;
    }

    width() {
        return this.shape.width;
    }

    height() {
        return this.shape.height;
    }
}