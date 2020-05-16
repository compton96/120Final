class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprite
        this.load.image('player', './assets/place.jpg');
        this.load.image('playerTurnLeft', './assets/NOSinGameLeftTurn.png');
        this.load.image('playerTurnRight', './assets/NOSinGameRightTurn.png');
        this.load.image('redCar', './assets/NOScarRed.png');
        this.load.image('blueCar', './assets/NOScarBlue.png');
        this.load.image('yellowCar', './assets/NOScarYellow.png');
        this.load.image('enemy', './assets/barrelVan1.png');
        // this.load.image('enemy2', './assets/starfield.png');
        this.load.image('background', './assets/tempRoad.png');
        this.load.audio('bgMusic', './assets/ToccataTechno.mp3');
        this.load.audio('explosion', './assets/explosion.mp3');
        // this.load.image('spear', './assets/starfield.png');
        this.load.image('barrel', './assets/barrel1.png');
        // this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.atlas('barrelAtlas', './assets/barrel_roll.png', './assets/barrel_roll_atlas.json');
        this.load.atlas('vanAtlas', './assets/van.png', './assets/van_atlas.json');
    }

    create() {


        this.background = this.add.tileSprite(0, 0, (game.config.width) / 1.75, game.config.height, "background").setOrigin(0, 0);
        //Define keyboard keys
        this.p1 = new Player(this, 500, 600);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        scoreConfig.fixedWidth = 0;
        this.clockDisplay = this.add.text(game.config.width / 2, 42, "Time: " + this.game.settings.gameTimer, scoreConfig);
        this.highestScore = this.add.text(game.config.width / 2, 42 + 64, "Current Highscore: " + localStorage.getItem("highScore"), scoreConfig).setOrigin(0.5);
        //game over flag
        this.gameOver = false;

        //play clock
        // scoreConfig.fixedWidth = 0;
        // this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        //     this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", scoreConfig).setOrigin(0.5);
        //     this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Space to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
        //     this.gameOver = true;
        // }, null, this);
    }

    update() {


        //keep saturation state between worlds

        //Input from WASD
        if (Phaser.Input.Keyboard.JustDown(keyA)) {
            this.globalColor = colorRED;
            this.globalColor.s = sat;
            this.p1.setTint(this.globalColor.color);  // replace color value
        }
        else if (Phaser.Input.Keyboard.JustDown(keyD)) {
            this.globalColor = colorBLUE;
            this.globalColor.s = sat;
            this.p1.setTint(this.globalColor.color);  // replace color value
        }

        if (keyW.isDown) {
            if (sat <.99)
            {
                sat+=.01;
                this.globalColor.s+=.01
            }
            this.p1.setTint(this.globalColor.color);
            console.log(sat);
        }
        else if (keyS.isDown) {
            if (sat >0.01)
            {
                sat-=.01;
                this.globalColor.s-=.01
            }
            this.p1.setTint(this.globalColor.color);
            console.log(sat);
        }
        //check key input for restart
        // if (this.gameOver) {
        //     //Check if they beat high score
        //     if (parseInt(this.clockDisplay.text) > highScore) {
        //         highScore = this.clockDisplay.text;
        //         console.log("New Highscore: " + highScore);
        //         localStorage.setItem("highScore", highScore);
        //     }
        //     this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", scoreConfig).setOrigin(0.5);
        //     this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Space to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
        //     if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
        //         this.resetSettings();
        //         this.scene.restart(this.p1Score);
        //     } else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        //         bgMusic.destroy();
        //         bgMusic = null;
        //         this.resetSettings();
        //         this.scene.start("menuScene");
        //     }
        // }

        if (!this.gameOver) {
            //update sprites here if you want them to pause on game over
            this.p1.update();

            if (parseInt(this.clockDisplay.text) > highScore) {
                highScore = this.clockDisplay.text;
                console.log("New Highscore: " + highScore);
                localStorage.setItem("highScore", highScore);
                this.highestScore.setText("Current Highscore: " + localStorage.getItem("highScore"));
            }

            //Update timer text
            //this.clockDisplay.setText(Math.floor(this.clock.getElapsedSeconds()));
        }
    }
}
