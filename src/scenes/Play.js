class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;
    }

    preload() {
        //load images/tile sprite
        this.load.tilemapTiledJSON("testTilemap", "./assets/testTileset.json"); //Tiled JSON file
        this.load.spritesheet("tilemapImage", "./assets/colored_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('player', './assets/NOSinGame.png'); //Player
        this.load.image('background', './assets/tempRoad.png');
        this.load.audio('bgMusic', './assets/ToccataTechno.mp3');
        this.load.atlas('barrelAtlas', './assets/barrel_roll.png', './assets/barrel_roll_atlas.json');
        this.load.audio('jump', './assets/discord-notification.mp3');
    }

    create() {
        //Add a tilemap
        const tilemap = this.add.tilemap("testTilemap");
        //Add a tile set to the tilemap
        const tileset = tilemap.addTilesetImage("testTileset", "tilemapImage");
        //Create static layers
        this.backgroundLayer = tilemap.createDynamicLayer("Background", tileset, 0, 0).setScrollFactor(0.25);
        this.groundLayer = tilemap.createDynamicLayer("Ground", tileset, 0, 0);
        this.sceneryLayer = tilemap.createDynamicLayer("Scenery", tileset, 0, 0);

        this.boxColor = bounceColor;
        this.boxColor.s = sat;
        this.boxCurrent = this.boxColor;

        //Set up Tilemap Collision
        this.groundLayer.setCollisionByProperty({ hasCollision: true });

        //Define a render debug so we can see the Tilemap's collision bounds
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null, //Color of non-colliding tiles
        //     collidingLineColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });
        this.jump = this.sound.add('jump', { volume: 0.3 });
        const p1Spawn = tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");

        //Define keyboard keys
        this.p1 = new Player(this, p1Spawn.x, p1Spawn.y);

        // generate coin objects from object data
        this.boxes = tilemap.createFromObjects("Objects", "Box", {
            key: "tilemapImage",
            frame: 346
        }, this);

        this.physics.world.enable(this.boxes, Phaser.Physics.Arcade.DYNAMIC_BODY);

        // then add the coins to a group
        this.boxGroup = this.add.group(this.boxes);
        this.boxGroup.children.each(function(box) {
            box.body.setFriction(0.5,0.5);
            box.body.setDrag(100000);
        }, this);

        //Set gravity
        this.physics.world.gravity.y = 2000;
        //Set world bounds to tilemap dimensions
        this.physics.world.bounds.setTo(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

        //Create colliders
        // this.physics.add.collider(this.p1, groundLayer, ()=> {
        //     this.p1.isJumping = false;
        // });
        this.physics.add.collider(this.p1, this.groundLayer, () => {
            this.p1.isJumping = false;
        });
        this.physics.add.collider(this.p1, this.boxGroup);
        this.physics.add.collider(this.boxGroup, this.groundLayer);
        this.physics.add.collider(this.boxGroup, this.boxGroup);

        //box tint
        this.boxGroup.setTint(this.boxColor.color);

       
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
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        keyTHREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

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
        if (this.boxCurrent == bounceColor)
        {
            this.boxGroup.children.each(function(box) {
                box.body.bounce.y = 1;
                box.body.setImmovable(false);
                box.body.setFriction(0.5,0.5);
                box.body.setDrag(100000, 0);
                box.body.setGravityY(0)
            }, this);
        }
        if (this.boxCurrent == freezeColor)
        {
            this.boxGroup.children.each(function(box) {
                box.body.bounce.y = 0;
                box.body.setImmovable(true);
                box.body.setFriction(0.5,0.5);
                box.body.setDrag(100000, 0);
                box.body.setVelocity(0,0);
                box.body.setVelocity(0,0);
                box.body.setGravityY(-2000)
            }, this);
        }
        if (this.boxCurrent == slideColor)
        {
            this.boxGroup.children.each(function(box) {
                box.body.bounce.y = 0;
                box.body.setImmovable(false);
                box.body.setFriction(0,0);
                box.body.setDrag(0, 0);
                box.body.setGravityY(0)
            }, this);
        }
        if (Phaser.Input.Keyboard.JustDown(keyONE)) {
            this.boxCurrent = bounceColor;
            this.boxCurrent.s = sat;
            this.boxGroup.setTint(this.boxCurrent.color);  // replace color value
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
            this.boxCurrent = freezeColor;
            this.boxCurrent.s = sat;
            this.boxGroup.setTint(this.boxCurrent.color);  // replace color value
        }
        if (Phaser.Input.Keyboard.JustDown(keyTHREE)) {
            this.boxCurrent = slideColor;
            this.boxCurrent.s = sat;
            this.boxGroup.setTint(this.boxCurrent.color);  // replace color value
        }

        //Input from WASD
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.globalColor = colorRED;
            this.globalColor.s = sat;
            this.updateColors();
        }
        else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.globalColor = colorBLUE;
            this.globalColor.s = sat;
            this.updateColors();
        }

        if (keyUP.isDown) {
            if (sat < .99) {
                sat += .01;
                this.globalColor.s += .01
            }
            this.updateColors();
        }
        else if (keyDOWN.isDown) {
            if (sat > 0.01) {
                sat -= .01;
                this.globalColor.s -= .01
            }
            this.updateColors();
        }
        if (this.p1.isJumping) {
            this.jump.play();
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

    updateColors() {
        // this.p1.setTint(this.globalColor.color); //Uncomment if we want to change player color
        if (this.globalColor == colorRED) { //Global Color is Red, adjust accordingly
            this.groundLayer.forEachTile(tile => { //Loop through ground layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightRED.s = this.globalColor.s;
                    tile.tint = colorLightRED.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkRED.s = this.globalColor.s;
                    tile.tint = colorDarkRED.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            this.backgroundLayer.forEachTile(tile => { //Loop through background layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightRED.s = this.globalColor.s;
                    tile.tint = colorLightRED.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkRED.s = this.globalColor.s;
                    tile.tint = colorDarkRED.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            this.sceneryLayer.forEachTile(tile => { //Loop through scenery layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightRED.s = this.globalColor.s;
                    tile.tint = colorLightRED.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkRED.s = this.globalColor.s;
                    tile.tint = colorDarkRED.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
        } else if (this.globalColor == colorBLUE) { //Global color is Blue, adjust accordingly
            this.groundLayer.forEachTile(tile => { //Loop through ground layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightBLUE.s = this.globalColor.s;
                    tile.tint = colorLightBLUE.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkBLUE.s = this.globalColor.s;
                    tile.tint = colorDarkBLUE.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            this.backgroundLayer.forEachTile(tile => { //Loop through background layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightBLUE.s = this.globalColor.s;
                    tile.tint = colorLightBLUE.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkBLUE.s = this.globalColor.s;
                    tile.tint = colorDarkBLUE.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            this.sceneryLayer.forEachTile(tile => { //Loop through scenery layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightBLUE.s = this.globalColor.s;
                    tile.tint = colorLightBLUE.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkBLUE.s = this.globalColor.s;
                    tile.tint = colorDarkBLUE.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
        }

    }
}
