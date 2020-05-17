class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;
    }

    preload() {
        //load images/tile sprite
        this.load.tilemapTiledJSON("testTilemap", "./assets/testTileset.json"); //Tiled JSON file
        this.load.image("tilemapImage", "./assets/colored_packed.png");
        this.load.image('player', './assets/NOSinGame.png'); //Player
        this.load.image('background', './assets/tempRoad.png');
        this.load.audio('bgMusic', './assets/ToccataTechno.mp3');
        this.load.atlas('barrelAtlas', './assets/barrel_roll.png', './assets/barrel_roll_atlas.json');
    }

    create() {
        //Add a tilemap
        const tilemap = this.add.tilemap("testTilemap");
        //Add a tile set to the tilemap
        const tileset = tilemap.addTilesetImage("testTileset","tilemapImage");
        //Create static layers
        const backgroundLayer = tilemap.createStaticLayer("Background", tileset, 0, 0).setScrollFactor(0.25);
        const groundLayer = tilemap.createStaticLayer("Ground", tileset, 0, 0);
        const sceneryLayer = tilemap.createStaticLayer("Scenery", tileset, 0, 0);

        //Set up Tilemap Collision
        groundLayer.setCollisionByProperty({hasCollision: true});

        //Define a render debug so we can see the Tilemap's collision bounds
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null, //Color of non-colliding tiles
        //     collidingLineColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });

        const p1Spawn = tilemap.findObject("Objects", obj => obj.name ==="PlayerSpawn");

        //Define keyboard keys
        this.p1 = new Player(this, p1Spawn.x, p1Spawn.y);

        //Set gravity
        this.physics.world.gravity.y = 2000;
        //Set world bounds to tilemap dimensions
        this.physics.world.bounds.setTo(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

        //Create colliders
        this.physics.add.collider(this.p1, groundLayer, ()=> {
            this.p1.isJumping = false;
        });
        
        //Set up camera to follow player
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
        this.cameras.main.startFollow(this.p1, true, 0.25, 0.25);

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
        //this.clockDisplay = this.add.text(game.config.width / 2, 42, "Time: " + this.game.settings.gameTimer, scoreConfig);
        //this.highestScore = this.add.text(game.config.width / 2, 42 + 64, "Current Highscore: " + localStorage.getItem("highScore"), scoreConfig).setOrigin(0.5);
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

    update(time, delta) {

        // this.camControl.update(delta);
        //keep saturation state between worlds

        //Input from WASD
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.globalColor = colorRED;
            this.globalColor.s = sat;
            this.p1.setTint(this.globalColor.color);  // replace color value
        }
        else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.globalColor = colorBLUE;
            this.globalColor.s = sat;
            this.p1.setTint(this.globalColor.color);  // replace color value
        }

        if (keyUP.isDown) {
            if (sat <.99)
            {
                sat+=.01;
                this.globalColor.s+=.01
            }
            this.p1.setTint(this.globalColor.color);
            // console.log(sat);
        }
        else if (keyDOWN.isDown) {
            if (sat >0.01)
            {
                sat-=.01;
                this.globalColor.s-=.01
            }
            this.p1.setTint(this.globalColor.color);
            // console.log(sat);
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

            // if (parseInt(this.clockDisplay.text) > highScore) {
            //     highScore = this.clockDisplay.text;
            //     console.log("New Highscore: " + highScore);
            //     localStorage.setItem("highScore", highScore);
            //     this.highestScore.setText("Current Highscore: " + localStorage.getItem("highScore"));
            // }

            //Update timer text
            //this.clockDisplay.setText(Math.floor(this.clock.getElapsedSeconds()));
        }
    }
}
