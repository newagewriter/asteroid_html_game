class Bonus extends Component {
    constructor(x, y, type, color, size) {
        super(size, size, color, x, y);
        this.type = type;
    }
}

class RocketBonus extends Bonus {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {RocketFactory} rocketFactory 
     */
    constructor(x, y, rocketFactory) {
        super(x, y, "rocket", "rgba(255, 0, 0, 0.2)", 30);
        if (rocketFactory.templateObject.width > rocketFactory.templateObject.height) {
            this.height = this.height * this.width / rocketFactory.templateObject.width;
        } else {
            this.width = this.width * this.heigh / rocketFactory.templateObject.height;
        }
        console.log("size:" + this.width + "; " + this.height);
        this.rocketFactory = rocketFactory;
    }

    update(canvas) {
        super.update(canvas);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.rocketFactory.getRocketImage(), this.x, this.y, this.width, this.height);
    }
}
   
class ShieldBonus extends Bonus {
    constructor(x, y) {
        super(x, y, "shield", "blue", 18);
        this.time = 6000;
        this.image = GameManager.imageLoader.getImage("assets/shield.png");
    }
}

var Factory = {
    create: function(type, x, y) {
        switch(type) {
            case "rocket":
                return new RocketBonus(x, y);
            case "shield":
                return new ShieldBonus(x, y);
        }
    }
};