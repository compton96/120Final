class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprite
        
    }

    create() {

        //this.p1 = new Player(this, roadCenter[roadPosition], 600);

        //Define keyboard keys

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
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Space to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {

        //check key input for restart
        if (this.gameOver) {
            //Check if they beat high score
            if (parseInt(this.clockDisplay.text) > highScore) {
                highScore = this.clockDisplay.text;
                console.log("New Highscore: " + highScore);
                localStorage.setItem("highScore", highScore);
            }
            this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Space to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.resetSettings();
                this.scene.restart(this.p1Score);
            } else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                bgMusic.destroy();
                bgMusic = null;
                this.resetSettings();
                this.scene.start("menuScene");
            }
        }

        if (!this.gameOver) {
            //update sprites here if you want them to pause on game over
            // this.p1.update();

            if (parseInt(this.clockDisplay.text) > highScore) {
                highScore = this.clockDisplay.text;
                console.log("New Highscore: " + highScore);
                localStorage.setItem("highScore", highScore);
                this.highestScore.setText("Current Highscore: " + localStorage.getItem("highScore"));
            }

            //Update timer text
            this.clockDisplay.setText(Math.floor(this.clock.getElapsedSeconds()));
        }
    }
}
