class Shape {
    /**
     * 
     * @param {Shape} shape 
     */
    hitTest(shape) {
        return this.intersect(shape);
    }

    /**
     * 
     * @param {Shape} shape 
     */
    intersect(shape) {
        throw "Overide this method to implement it";
    }
}

class Rectangle extends Shape {
    /**
     * 
     * @param {number} x 
     * @param {numbere} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * 
     * @param {Shape} shape 
     */
    intersect(shape) {
        // console.log("shape:" + " x= " + shape.x + " y= " + shape.y);
        // console.log(" width= " + shape.width + " height= " + shape.height);
        // console.log("shape2:" + " x= " + this.x + " y= " + this.y);
        // console.log(" width= " + this.width + " height= " + this.height);
        if (this.contains(shape.x, shape.y) || 
            this.contains(shape.x, shape.y + shape.height) ||
            this.contains(shape.x + shape.width, shape.y) ||
            this.contains(shape.x + shape.width, shape.y + shape.height)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    contains(x, y) {
        return this.x < x && (this.x + this.width) > x && 
            this.y < y && (this.y + this.height) > y;
    }
}