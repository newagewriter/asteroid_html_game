class CImage extends Component {
    /**
     * 
     * @param {number} x
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} imageSource 
     */
    constructor(x, y, width, height, imageSource) {
        super(x, y, width, height, "rgba(0, 0, 0, 0)");
        this.lockUpdate = false;
        var self = this;
        this.lockUpdate = true;
        var loadCallback = function() {
            self.lockUpdate = false;     
        };
        this.image = GameManager.imageLoader.getImage(imageSource, loadCallback);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        if (this.lockUpdate) {
            return;
        }
        context.save();
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;
        var direction = 1;
        if ((this.rotation > 115 && this.rotation <= 225)) {
            x = -this.x;
            y = -this.y;
            direction = -1;
        }
        context.translate(this.x + width/2, this.y + height/2);
        context.rotate(this.rotation * Math.PI/180);
        context.drawImage(this.image, -direction*width/2, -direction*height/2, direction*width, direction*height);
        context.restore();
        
    }
}