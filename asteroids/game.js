const { remote } = include('electron');
include('./extension');
const PLAYER_IMG_SOURCE = "assets/player.png";
const PLAYER_IMG_SOURCE_LEFT = "assets/player_left.png";
const PLAYER_IMG_SOURCE_RIGHT = "assets/player_right.png";
const PLAYER_SPEED = 6;
const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 50;
const GAME_FPS = 60;

const GAME_WIDTH = 700;
const GAME_HEIGHT = 900;
const MAP_CHANGE_SCORE = 1000;

var userScores = [];
/**
 * @type Player
 */
var player;
var userName = "Unknown";
var keys = [];
var mySound = null;
var mapIndex = 0;
var muted = false;

/**
 * @type GameArea
 */
var myGameArea = null;

var renderCallback = {
    onUpdate : function() {
        checkIfPlayerGrabBunus(myGameArea.currentMap());
        
        if (checkIfPlayerDestroy(myGameArea.currentMap())) {
            mySound.setSource("bounce.mp3");
            mySound.play();
            gameOver();
            return;
        }
        
        movePlayerIfNeeded(player);
        player.update(myGameArea.canvas);
        
        if (myGameArea.score > MAP_CHANGE_SCORE * (mapIndex + 1) && myGameArea.hasNextMap()) {
            console.log("change level");
            mapIndex++;
            myGameArea.nextLevel();
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
    keys = [];
    userName = document.getElementById("userName").value;
    document.getElementById("startScreen").style.display = "none";
    var screen = document.getElementById("endScreen");
    screen.style.display = "none";
    myGameArea = new GameArea(GAME_WIDTH, GAME_HEIGHT);
    player = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_IMG_SOURCE, (myGameArea.width - PLAYER_WIDTH) / 2, myGameArea.height - 20);
    if (mySound == null)
        mySound = new Sound("bounce.mp3");
    mapIndex = 0;
    myGameArea.setBackground("assets/space.jpg");
    myGameArea.start(player, maps, renderCallback);
    prepareRender();
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
    cancelAnimationFrame(onRender);
        
    var screen = document.getElementById("endScreen");
    screen.style.display = "block";
    document.getElementById("yourScore").innerHTML = Math.floor(myGameArea.score);
    userScores.push({
        score: Math.floor(myGameArea.score),
        userName: userName
    });
    userScores = userScores.sort((x1, x2) => x2.score - x1.score );
    var list = document.getElementById("lastScores");
    while( list.firstChild ) {
        list.removeChild( list.firstChild );
    }
    userScores.forEach(value => {
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
    moveByKeys(keys);
    player.newPos();
}

function moveByKeys() {
    var b = 0;
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
    if (dir == "left") {
        player.image.src = PLAYER_IMG_SOURCE_LEFT;
        player.speedX = -PLAYER_SPEED; 
    }
    if (dir == "right") {
        player.image.src = PLAYER_IMG_SOURCE_RIGHT;
        player.speedX = PLAYER_SPEED; 
    }
}

function clearmove() {
    player.image.src = PLAYER_IMG_SOURCE;
    player.speedX = 0;
    player.speedY = 0;
}

function checkIfPlayerGrabBunus(map) {
    map.bonuses = map.bonuses.filter(item => {
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
/**
 * 
 * @param {GameMap} currentMap 
 */
function checkIfPlayerDestroy(currentMap) {
    var playerDestroyed = false;
    currentMap.asteroids = currentMap.asteroids.filter(asteroid => {
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
        return true;
    });
    currentMap.enemies.forEach(enemy => {
        enemy.rockets = enemy.rockets.filter(val => {
            var result = true;
            if (val.hitTest(player)) {
                playerDestroyed = true;
                return false;
            }
            return result && val.y > 0;
        });
        player.rockets = player.rockets.filter(val => {
            var result = true;
            if (val.hitTest(enemy)) {
                enemy.life -= val.hit;
                result = false;
            }
            return result && val.y > 0;
        });
        return true;
    });

    return playerDestroyed;
}

function openDevTools() {
    remote.app.openDevTools();
}

function muteSound() {
    muted = !muted;
    var elems = document.querySelectorAll("video, audio");
    elems.forEach(item => {
        
        item.muted = muted;
    });
    if (muted) {
        document.getElementById("mute_sound_img").src = "assets/mute_sound.jpg";
    } else {
        document.getElementById("mute_sound_img").src = "assets/sound.jpg";
    }
}

function prepareRender() {
    requestAnimationFrame(onRender);
}

function onRender(time) {
    myGameArea.onGameUpdate();
    requestAnimationFrame(onRender);
}