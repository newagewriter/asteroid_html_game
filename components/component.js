class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height,
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
    constructor(width, height, imageSource, x, y) {
        super(width, height, imageSource, x, y)
        this.lockUpdate = false;
        var self = this;
        this.lockUpdate = true;
        this.image = new Image();
        this.image.src = imageSource;

        this.image.onload = function() {
            self.lockUpdate = false;     
        }
    }
    update(canvas) {
        if (this.lockUpdate) {
            return;
        }
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class CBackground extends CImage {
    constructor(width, height, background, x, y) {
        super(width, height, background, x, y)
    }
    update(canvas) {
        if (this.lockUpdate) {
            return;
        }
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

    newPos() {
        super.newPos()
        if (this.x == -(this.width)) {
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

class Player extends CImage {

    constructor(width, height, background, x, y) {
        super(width, height, background, x, y)
        this.rockets = [];
        this.shootSeries = 5;
        this.shootSound = new Sound("assets/sounds/shoot.mp3")
        // this.gravity = 0.05;
        // this.gravitySpeed = 0;
        // this.bounce = 0.5;
    }

    newPos() {
        // this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY; 
        this.hitBottom();
        this.hitTop();
    }

    attachTo(game) {
        this.game = game
    }

    hitBottom() {
        if (this.game) {
            var rockbottom = this.game.canvas.height - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            }
        }
    }
    hitTop() {
        if (this.game) {
            var rockTop = 0;
            if (this.y < rockTop) {
                this.y = rockTop;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            }
        }
    }
    shoot() {
        if (this.shootSeries % 5 == 0) {
            this.rockets.push(new Rocket(10, 13, "assets/rocket_missile.png", this.x + (this.width/2), this.y))
            this.shootSound.stop()
            this.shootSound.play()
        }
        this.shootSeries++;
    }

    shootRelease() {
        this.shootSeries = 5;
    }

    update(canvas) {
        super.update(canvas)
        this.rockets.forEach(function(val, index, array) {
            val.y -= 5;
            val.update(canvas)
        })
    }
}

class Asteroid extends CImage {
    constructor(width, height, image, x, y) {
        super(width, height, image, x, y)
        this.life = 100;
    }
    hitTest(otherobj) {
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if (hitWithPoint(otherleft, othertop)) {
            return true
        }
        if (hitWithPoint(otherright, othertop)) {
            return true
        }
        if (hitWithPoint(otherleft, otherbottom)) {
            return true
        }
        if (hitWithPoint(otherright, otherbottom)) {
            return true
        }
        return false
    }

    hitWithPoint(x, y) {
        var xCenter = this.x + (this.x + this.width) / 2
        var yCenter = this.y + (this.y + this.height) / 2
        var a = Math.abs(x - xCenter)
        var b = Math.abs(y - yCenter)
        var r = xCenter - this.x
        if (r <=  + Math.sqrt(a*a + b*b)) {
            return true
        }
    }
}

class Rocket extends CImage {
    update(canvas) {
        super.update(canvas)
    }
}