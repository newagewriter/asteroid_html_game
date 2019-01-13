var maps = [
    {
        level: 1,
        delay: 120,
        onNextFrame : function(game) {
            if (this.delay > 0) {
                game.showInfoText("Level " + this.level);
                this.delay--;
                return;
            }
            console.log("Level " + this.level);
            var createTime = 80;
            var count = 2;
            var asteroidLife = 100;
            if (game.frameNo == 1 || everyInterval(game.frameNo, createTime)) {
                createAsteroidsIn(game.canvas.width, ASTEROID_MAX_SIZE, count, asteroidLife);
            }
        },
        clear: function() {
            this.delay = 120;
        }
    },
    {
        level: 2,
        delay: 120,
        onNextFrame : function(game) {
            if (this.delay > 0) {
                game.showInfoText("Level " + this.level);
                game.setBackground("assets/background2.jpg", true, "horizontal");
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
        },
        clear: function() {
            this.delay = 120;
        }
    },
    {
        level: 3,
        delay: 120,
        onNextFrame : function(game) {
            if (this.delay > 0) {
                game.showInfoText("Level " + this.level);
                this.delay--;
                return;
            }
            console.log("level 2");
            var createTime = 70;
            var count = 3;
            var asteroidLife = 150;
            if (game.frameNo == 1 || everyInterval(game.frameNo, createTime)) {
                createAsteroidsIn(game.canvas.width, ASTEROID_MAX_SIZE, count, asteroidLife);
            }
        },
        clear: function() {
            this.delay = 120;
        }
    },
    {
        level: 4,
        delay: 120,
        onNextFrame : function(game) {
            if (this.delay > 0) {
                game.showInfoText("Level " + this.level);
                this.delay--;
                return;
            }
            console.log("level 2");
            var createTime = 60;
            var count = 4;
            var asteroidLife = 200;
            if (game.frameNo == 1 || everyInterval(game.frameNo, createTime)) {
                createAsteroidsIn(game.canvas.width, ASTEROID_MAX_SIZE, count, asteroidLife);
            }
        },
        clear: function() {
            this.delay = 120;
        }
    },
    {
        level: 5,
        delay: 120,
        onNextFrame : function(game) {
            if (this.delay > 0) {
                game.showInfoText("Level " + this.level);
                game.setBackground("assets/background3.jpg");
                this.delay--;
                return;
            }
            console.log("level 2");
            var createTime = 50;
            var count = 5;
            var asteroidLife = 250;
            if (game.frameNo == 1 || everyInterval(game.frameNo, createTime)) {
                createAsteroidsIn(game.canvas.width, ASTEROID_MAX_SIZE, count, asteroidLife);
            }
        },
        clear: function() {
            this.delay = 120;
        }
    }
];

