class Asteroid extends CImage {
    constructor(width, height, image, x, y, life) {
        super(width, height, image, x, y);
        this.life = life;
    }
    hitTest(otherobj) {
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if (hitWithPoint(otherleft, othertop)) {
            return true;
        }
        if (hitWithPoint(otherright, othertop)) {
            return true;
        }
        if (hitWithPoint(otherleft, otherbottom)) {
            return true;
        }
        if (hitWithPoint(otherright, otherbottom)) {
            return true;
        }
        return false;
    }

    hitWithPoint(x, y) {
        var xCenter = this.x + (this.x + this.width) / 2;
        var yCenter = this.y + (this.y + this.height) / 2;
        var a = Math.abs(x - xCenter);
        var b = Math.abs(y - yCenter);
        var r = xCenter - this.x;
        if (r <=  + Math.sqrt(a*a + b*b)) {
            return true;
        }
    }
    /**
     * @override
     * @param {HTMLCanvasElement} canvas 
     */
    update(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.shadowColor = 'rgba(255, 50, 0, 0.5)';
        ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 30;
        super.update(canvas);
        ctx.restore();
    }
}