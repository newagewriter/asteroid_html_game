class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Shape {
    /**
     * 
     * @param {Point[]} vertices 
     */
    constructor(vertices) {
        this.vertices = vertices;
        /**
         * 
         * @param {Point[]} vs 
         * @param {Function} expr 
         * @returns {Point}
         */
        var vFilter = function(vs, expr) {
            var result = vs[0];
            vs.forEach(v => {
                result = expr(result, v);
            });
            return result;
        };
        this.left = vFilter(vertices, (v1, v2) => v1.x < v2.x ? v1 : v2).x;
        this.top = vFilter(vertices, (v1, v2) => v1.y < v2.y ? v1 : v2).y;
        this.rigth = vFilter(vertices, (v1, v2) => v1.x > v2.x ? v1 : v2).x;
        this.bottom = vFilter(vertices, (v1, v2) => v1.y > v2.y ? v1 : v2).y;
    }
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
        var result = false;
        var i = 0;
        while (!result && shape.vertices.length > i) {
            var v = shape.vertices[i++];
            result = this.contains(v);
        }
        return result;
    }

    /**
     * 
     * @param {Point} pt 
     */
    contains(pt) {
        return this.vertices.contains(pt);
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
        super([
            new Point(x, y),
            new Point(x + width, y),
            new Point(x, y + height),
            new Point(x + width, y + height)
        ]);
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
        // if (shape.constructor.name == "Rectangle") {
            return Math.max(this.left, shape.left) < Math.min(this.rigth, shape.rigth) &&
                Math.max(this.top, shape.top) < Math.min(this.bottom, shape.bottom);
        // } else {
        //     return super.intersect(shape);
        // }
    }

    /**
     * 
     * @param {Point} pt
     */
    contains(pt) {
        return this.x <= pt.x && (this.x + this.width) >= pt.x && 
            this.y <= pt.y && (this.y + this.height) >= pt.y;
    }
}

class Triangle extends Shape {
    constructor(v1, v2, v3) {
        super([v1, v2, v3]);
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    /**
     * 
     * @param {Shape} shape 
     */
    intersect(shape) {
        if (shape.constructor.name == "Rectangle") {
            return Math.max(this.left, shape.left) < Math.min(this.rigth, shape.rigth) &&
                Math.max(this.top, shape.top) < Math.min(this.bottom, shape.bottom);
        } else {
            return super.intersect(shape);
        }
    }

    /**
     * 
     * @param {Point} pt 
     */
    contains(pt) {
        var d1 = this.sign(pt, this.v1, this.v2);
        var d2 = this.sign(pt, this.v2, this.v3);
        var d3 = this.sign(pt, this.v3, this.v1);

        var has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        var has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2 
     * @param {Point} p3 
     */
    sign (p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3. y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
}