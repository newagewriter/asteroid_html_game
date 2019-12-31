const PLAY_SHOOT_PER_RENDER = 10;

class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    update(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    hitTest(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
        crash = false;
        }
        return crash;
    }
}

class CImage extends Component {
    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {string} imageSource 
     * @param {number} x
     * @param {number} y 
     */
    constructor(width, height, imageSource, x, y) {
        super(width, height, "rgba(0, 0, 0, 0)", x, y);
        this.lockUpdate = false;
        var self = this;
        this.lockUpdate = true;
        var loadCallback = function() {
            self.lockUpdate = false;     
        }
        this.image = GameManager.imageLoader.getImage(imageSource, loadCallback);
        
    }
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    update(canvas) {
        if (this.lockUpdate) {
            return;
        }
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class CBackground extends CImage {
    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {String} background 
     * @param {number} x 
     * @param {number} y 
     * @param {String} orientation 
     */
    constructor(width, height, background, x, y, orientation) {
        super(width, height, background, x, y);
        this.orientation = orientation || "vertical";
    }
    update(canvas) {
        if (this.lockUpdate) {
            return;
        }
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.orientation == "vertical") {
            ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
        } else {
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }

    newPos() {
        super.newPos();
        if (this.y >= this.height) {
            this.y = 0;
        }
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }
}

class CText extends Component {
    constructor(fontSize, fontName, background, x, y) {
        super(0, 0, background, x, y)
        this.fontSize = fontSize;
        this.fontName = fontName;
    }
    update(canvas) {
        var ctx = canvas.getContext("2d");
        if (this.lockUpdate) {
            return;
        }
    
        ctx.font = this.fontSize + " " + this.fontName;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);        
    }
}