
class Component {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.transformMatrix = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
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
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}