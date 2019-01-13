const PLAYER_IMG_SOURCE = "assets/player.png";
const PLAYER_SPEED = 10;
const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 50; 

const ASTERIOD_COUNT_PER_TIME = 3;
const ASTERIOD_SPEED = 5;
const ASTEROID_MAX_SIZE = 100;
const ASTEROID_MIN_SIZE = 50;
const GAME_WIDTH = 700;
const GAME_HEIGHT = 920;
const SCORE_BY_FRAME = 1;
const DEFEATE_ASTEROID_POINTS = 20;
const MAP_CHANGE_SCORE = 1000;

var userScores = [];
var player;
var userName = "Unknown";
var asteroids = [];
var bonuses = [];
var keys = [];
var myScore;
var mySound = null;
var mapIndex = 0;

var renderCallback = {
    onUpdate : function() {
        checkIfPlayerGrabBunus()
        
        if (checkIfPlayerDestroy()) {
            mySound.setSource("bounce.mp3");
            mySound.play();
            gameOver();
            return;
        }
        
        myGameArea.score += SCORE_BY_FRAME;
        movePlayerIfNeeded(player);
        myScore.text = "SCORE: " + myGameArea.score;
        myScore.update(myGameArea.canvas);
        player.update(myGameArea.canvas);
        
        if (myGameArea.score > MAP_CHANGE_SCORE * (mapIndex + 1) && myGameArea.hasNextMap()) {
            console.log("change level");
            mapIndex++;
            myGameArea.nextLevel();
            asteroids = [];
        }
    },
    onKeyDown : function(event) {
        keys = (keys || []);
        keys[event.keyCode] = true;
    },
    onKeyUp : function(event) {
        keys[event.keyCode] = false;
    }
};

function startGame() {
    asteroids = [];
    keys = [];
    bonuses = [];
    userName = document.getElementById("userName").value;
    document.getElementById("startScreen").style.display = "none";
    var screen = document.getElementById("endScreen");
    screen.style.display = "none";
    myGameArea = new GameArea(GAME_WIDTH, GAME_HEIGHT);
    player = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_IMG_SOURCE, (myGameArea.width - PLAYER_WIDTH) / 2, myGameArea.height - 20);
    myScore = new CText("30px", "Consolas", "white", 40, 40, "text");
    if (mySound == null)
        mySound = new Sound("bounce.mp3");
    mapIndex = 0;
    myGameArea.setBackground("assets/space.jpg");
    myGameArea.start(player, maps, renderCallback);
}

function gameOver() {
    var ctx = myGameArea.canvas.getContext("2d");
    var textSize = 60;
    var endText = "Game Over";
    ctx.font = textSize + "px Consolas";
    ctx.fillStyle = this.color;
    var centerX = (myGameArea.width - ctx.measureText(endText).width ) / 2;
    var centerY = myGameArea.height / 2;
    ctx.strokeText(endText, centerX, centerY);
    myGameArea.stop();
    player.detached(myGameArea);
        
    var screen = document.getElementById("endScreen");
    screen.style.display = "block";
    document.getElementById("yourScore").innerHTML = myGameArea.score;
    userScores.push({
        score: myGameArea.score,
        userName: userName
    });
    userScores = userScores.sort((x1, x2) => x2.score - x1.score )
    var list = document.getElementById("lastScores");
    while( list.firstChild ) {
        list.removeChild( list.firstChild );
    }
    userScores.forEach(function(value, index, array) {
        var newLi = document.createElement("li");
        newLi.innerHTML = value.userName + " : " + value.score;
        if (value.userName == userName && value.score == myGameArea.score) {
            newLi.id = "actualScore";
        }
        list.appendChild(newLi);
    });
}

    function movePlayerIfNeeded(player) {
            player.speedX = 0;
            player.speedY = 0;
            moveByKeys(keys)
            player.newPos();
    }

    function moveByKeys() {
        var b = 0
        if (keys && keys[37]) {
            move("left"); ++b;
        }
        if (keys && keys[39]) {
            move("right"); ++b;
        }
        if (keys && keys[38]) {
            move("up"); ++b; 
        }
        if (keys && keys[40]) {
            move("down"); ++b; 
        }
        if (keys && keys[32]) {
            player.shoot();
        }
        if (b == 0) {
            clearmove();
        }
    }

    function move(dir) {
        player.image.src = PLAYER_IMG_SOURCE;
        if (dir == "up") {player.speedY = -PLAYER_SPEED; }
        if (dir == "down") {player.speedY = PLAYER_SPEED; }
        if (dir == "left") {player.speedX = -PLAYER_SPEED; }
        if (dir == "right") {player.speedX = PLAYER_SPEED; }
    }

    function clearmove() {
        player.image.src = PLAYER_IMG_SOURCE;
        player.speedX = 0;
        player.speedY = 0;
    }

    function createAsteroidsIn(x, maxSize, count, life) {
        var w = myGameArea.canvas.width - maxSize;
        // TODO detect why game stoped when add more tha one asteriods in the same time
        for (i = 0; i < count; ++i) {
            y = 0;
            x = Math.floor(Math.random() * w);
            height = Math.floor(Math.random()*(maxSize - ASTEROID_MIN_SIZE + 1)) + ASTEROID_MIN_SIZE;
            asteroids.push(new Asteroid(height, height, "assets/asteroid.png", x, y, life));
        }
    }

function everyInterval(frameNo, targetFrame) {
    return (frameNo / targetFrame) % 1 == 0; 
}

function checkIfPlayerGrabBunus() {
    bonuses = bonuses.filter(item => {
        var result = true;
        item.y += 1;
        item.update(myGameArea.canvas);
        if (player.hitTest(item)) {
            player.setBonus(item);
            result = false;
        }
        return result;
    });
}

function checkIfPlayerDestroy() {
    var playerDestroyed = false;
    asteroids = asteroids.filter(asteroid => {
        if (asteroid.y > myGameArea.height) {
            return false;
        }
        if (player.hitTest(asteroid)) {
            if (player.shieldBonus != null) {
                asteroid.life = 0;
            } else {
                playerDestroyed = true;
                return false;
            }
        } 
        player.rockets = player.rockets.filter(val => {
            var result = true;
            if (val.hitTest(asteroid)) {
                asteroid.life -= val.hit;
                result = false;
            }
            return result && val.y > 0;
        });

        if (asteroid.life <= 0) {
            mySound.setSource("assets/sounds/defeate.mp3");
            mySound.play();
            myGameArea.score += DEFEATE_ASTEROID_POINTS;
            var rand = Math.floor(Math.random() * 10);
            if (rand == 1) {
                bonuses.push(new RocketBonus(asteroid.x, asteroid.y));
            } else if (rand == 2) {
                bonuses.push(new ShieldBonus(asteroid.x, asteroid.y));
            }
            return false;
        } else {
            asteroid.y += ASTERIOD_SPEED;
            asteroid.update(myGameArea.canvas);
            return true;
        }
    });

    return playerDestroyed;
}