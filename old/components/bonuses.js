class Bonus extends Component {
    constructor(x, y, type, color, time) {
        super(18, 18, color, x, y);
        this.time = time;
        this.type = type;
    }
}

class RocketBonus extends Bonus {
    constructor(x, y) {
        super(x, y, "rocket", "red", 10000);
    }
}

class ShieldBonus extends Bonus {
    constructor(x, y) {
        super(x, y, "shield", "blue", 10000);
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