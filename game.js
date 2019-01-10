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

var userScores = [];
var player;
var userName = "Unknown";
var asteroids = [];
var bonuses = [];
var keys = [];
var myScore;
var mySound = null;

var map = {
    onNextFrame : function(game) {
        console.log("level 1");
        var createTime = 80;
        var count = 2;
        var asteroidLife = 100;
        console.log("check that is the time to create asteroid");
        if (game.frameNo == 1 || everyInterval(game.frameNo, createTime)) {
            createAsteroidsIn(game.canvas.width, ASTEROID_MAX_SIZE, count, asteroidLife);
        }
    }
};
var map2 = {
    delay: 120,
    onNextFrame : function(game) {
        console.log("delay...." + this.delay);
        if (this.delay > 0) {
            this.delay--;
            return;
        }
        console.log("level 2");
        var createTime = 80;
        var count = 2;
        var asteroidLife = 150;
        if (game.frameNo == 1 || everyInterval(game.frameNo, createTime)) {
            createAsteroidsIn(game.canvas.width, ASTEROID_MAX_SIZE, count, asteroidLife);
        }
    }
};

var renderCallback = {
    onUpdate : function() {
        console.log("asteriod size:" + asteroids.length);
        console.log("rockets size:" + player.rockets.length);
        console.log("bonuses size:" + bonuses.length);
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

        if (playerDestroyed) {
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
        if (myGameArea.map == map && myGameArea.score > 1000) {
            myGameArea.setLevel(map2);
            asteroids = [];
        }
    },
    onKeyDown : function(event) {
        keys = (keys || []);
        keys[event.keyCode] = true;
    },
    onKeyUp : function(event) {
        keys[event.keyCode] = false;
            //accelerate(0.05);
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
    myScore = new CText("30px", "Consolas", "black", 40, 40, "text");
    if (mySound == null)
        mySound = new Sound("bounce.mp3");
    myGameArea.setBackground("background.jpg", true);
    myGameArea.start(player, map, renderCallback);
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
        // if (myGameArea.x && myGameArea.y) {
            //     player.x = myGameArea.x;
            //     player.y = myGameArea.y;
            // }
            player.speedX = 0;
            player.speedY = 0;
            moveByKeys(keys)
            player.newPos();
            // if (myGameArea.x && myGameArea.y) {
            //     player.x = myGameArea.x;
            //     player.y = myGameArea.y;
            // }
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
            //accelerate(-0.2)
            
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
            asteroids.push(new Asteroid(height, height, "asteroid.png", x, y, life));
        }
    }

    // function accelerate(gravity) {
    //     player.gravity = gravity
    // }
function everyInterval(frameNo, targetFrame) {
    return (frameNo / targetFrame) % 1 == 0; 
}