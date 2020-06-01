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
        this.load.audio('jump', './assets/honk.mp3');
        this.load.atlas('animation', './assets/rock_boi_run.png', './assets/rock_boi_run_atlas.json');
    }

    create() {

        physicsList = new Phaser.Structs.List(Phaser.GameObjects.Group);

        //Add a tilemap
        const tilemap = this.add.tilemap("testTilemap");
        //Add a tile set to the tilemap
        const tileset = tilemap.addTilesetImage("testTileset", "tilemapImage");
        //Create static layers
        this.backgroundLayer = tilemap.createDynamicLayer("Background", tileset, 0, 0).setScrollFactor(0.25);
        this.groundLayer = tilemap.createDynamicLayer("Ground", tileset, 0, 0);
        this.sceneryLayer = tilemap.createDynamicLayer("Scenery", tileset, 0, 0);
        this.deathLayer = tilemap.createDynamicLayer("Death", tileset, 0, 0);

        this.boxColor = bounceColor;
        this.boxColor.s = sat;
        this.boxCurrent = this.boxColor;

        //Set up Tilemap Collision
        this.groundLayer.setCollisionByProperty({ hasCollision: true });
        this.deathLayer.setCollisionByProperty({ hasCollision: true });

        //Define a render debug so we can see the Tilemap's collision bounds
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null, //Color of non-colliding tiles
        //     collidingLineColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });
        this.jump = this.sound.add('jump', { volume: 0.3 });
        const p1Spawn = tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");

        //spawn player
        this.p1 = new Player(this, p1Spawn.x, p1Spawn.y, 'animation', 'rockDudeRun1.png');
        this.p1.lastCheckpoint = p1Spawn;
        this.playerGroup = this.add.group();
        this.playerGroup.add(this.p1);
        this.playerGroup.name = 'player';


        physicsList.add(this.playerGroup);

        // generate box objects from object data
        this.boxes = tilemap.createFromObjects("Objects", "Box", {
            key: "tilemapImage",
            frame: 346
        }, this);

        this.checkpoints = tilemap.createFromObjects("Objects", "Checkpoint", {
            key: "tilemapImage",
            frame: 401,
        }, this);

        this.checkpointGroup = this.add.group(this.checkpoints);
        this.physics.world.enable(this.checkpoints, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.boxes, Phaser.Physics.Arcade.DYNAMIC_BODY);

        // then add the boxes to a group
        this.boxGroup = this.add.group(this.boxes);
        // this.boxGroup.children.each(function (box) {
        //     box.body.setFriction(0.5, 0.5);
        //     box.body.setDrag(100000);
        // }, this);
        this.boxGroup.name = 'box';
        physicsList.add(this.boxGroup);

        //Set gravity
        this.physics.world.gravity.y = 2000;
        //Set world bounds to tilemap dimensions
        this.physics.world.bounds.setTo(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

        //Create colliders
        this.physics.add.collider(this.p1, this.groundLayer, () => { //When player touches the floor layer, allow them to jump again
            this.p1.isJumping = false;
        });

        this.physics.add.collider(this.p1, this.deathLayer, () => { //When player touches deadly objects, respawn at last checkpoint
            this.p1.anims.stop();
            this.p1.dead = true;
            this.p1.play('death');
            this.p1.once('animationcomplete', () => {
                console.log("Touched enemy");
                this.p1.x = this.p1.lastCheckpoint.x;
                this.p1.y = this.p1.lastCheckpoint.y-16;
                this.p1.dead = false;
                if (this.p1.facing === 'left') {
                    this.p1.setFrame('rockDudeRun15.png');
                }
                else {
                    this.p1.setFrame('rockDudeRun1.png');
                }
            }, this);
        });

        this.physics.add.overlap(this.p1, this.checkpointGroup, (player, checkpoint) => { //When player touches checkpoint, store it
            this.p1.lastCheckpoint = checkpoint;
        });
        this.physics.add.collider(this.p1, this.boxGroup);
        this.physics.add.collider(this.boxGroup, this.groundLayer);
        this.physics.add.collider(this.boxGroup, this.boxGroup);


        this.physics.add.collider(this.boxGroup, this.boxGroup, function (s1, s2) {
            var b1 = s1.body;
            var b2 = s2.body;

            if (b1.y > b2.y) {
                b2.y += (b1.top - b2.bottom);
                b2.stop();
            }
            else {
                b1.y += (b2.top - b1.bottom);
                b1.stop();
            }
        });

        // box tint
        this.boxGroup.setTint(this.boxColor.color);

        this.globalColor = colorGREEN;
        this.globalColor.s = sat;
        this.updateColors();


        //Set up camera to follow player
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels); //Set camera bounds to the tilemap bounds
        this.cameras.main.startFollow(this.p1, true, 0.25, 0.25); //Make camera follow player

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
        console.log(physicsList);











        this.anims.create({
            key: 'runRight',
            frameRate: 10,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeRun',
                start: 1,
                end: 14,
                zeropad: 1,
                suffix: '.png'
            }),
            repeat: -1,
        });
        this.anims.create({
            key: 'runLeft',
            frameRate: 10,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeRun',
                start: 15,
                end: 28,
                zeropad: 1,
                suffix: '.png'
            }),
            repeat: -1,
        });
        this.anims.create({
            key: 'jump',
            frameRate: 10,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeJump',
                start: 1,
                end: 7,
                zeropad: 1,
                suffix: '.png'
            }),
            repeat: -1,
        });
        this.anims.create({
            key: 'death',
            frameRate: 10,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeDeath',
                start: 1,
                end: 11,
                zeropad: 1,
                suffix: '.png'
            }),
            // repeat: -1,
        });

    }

    update(time, delta) {

        this.p1.updateTime(this.time.now);
        // this.camControl.update(delta);
        //keep saturation state between worlds
        if (this.globalColor == colorGREEN) {
            physicsList.each((group) => {
                if (group.name == 'player') {
                    group.children.each(function (child) {
                        child.body.bounce.y = sat;
                        child.xMovement = 200;
                        child.yMovement = 700;
                        this.physics.world.updateMotion(this.p1.body, .00005);
                        //child.body.setDrag(100000, 0);
                    }, this);
                }
                else {
                    group.children.each(function (child) {
                        child.body.bounce.y = sat;
                        child.body.setImmovable(false);
                        child.body.setDrag(100000, 0);
                        child.body.allowGravity = true
                    }, this);
                }
            })
        }
        if (this.globalColor == colorBLUE) {
            physicsList.each((group) => {
                if (group.name == 'player') {
                    group.children.each(function (child) {
                        child.body.bounce.y = 0;
                        this.physics.world.updateMotion(this.p1.body, .00005);
                        // child.xMovement = child.xMovement * (1-sat));
                        // child.yMovement = child.yMovement * (1-sat);
                        //console.log(child.body.velocity);
                        // child.body.setDragY(2000*sat);
                    }, this);
                }
                else {
                    group.children.each(function (child) {
                        child.body.bounce.y = 0;
                        if (sat == 0.99) {
                            child.body.setImmovable(true);
                            // child.body.setDrag(100000, 0);
                            child.body.veloctiyX = 0;
                            child.body.velocityY = 0;
                            // child.body.setGravity(-2000);
                        }
                        else {
                            //child.body.setImmovable(false);
                            //child.body.setGravityY(-2000)
                            // child.body.setGravity(2000);
                        }

                    }, this);
                }
            })
            // physicsList.each((group) => {
            //     group.children.each(function (child) {
            //         child.body.bounce.y = 0;
            //         child.body.setImmovable(true);
            //         child.body.setFriction(0.5, 0.5);
            //         child.body.setDrag(100000, 0);
            //         child.body.setVelocity(0, 0);
            //         child.body.setVelocity(0, 0);
            //         child.body.allowGravity = false
            //     }, this);
            // })
        }
        // if (Phaser.Input.Keyboard.JustDown(keyONE)) {
        //     this.globalColor = colorGREEN;
        //     this.globalColor.s = sat;
        //     this.boxGroup.setTint(this.globalColor.color);  // replace color value
        // }
        // if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
        //     this.globalColor = colorBLUE;
        //     this.globalColor.s = sat;
        //     this.boxGroup.setTint(this.globalColor.color);  // replace color value
        // }

        //Input from WASD
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.globalColor = colorGREEN;
            this.globalColor.s = sat;
            this.physics.world.timeScale = 1;
            console.log(this.globalColor.color);
            this.updateColors();
        }
        else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.globalColor = colorBLUE;
            this.globalColor.s = sat;
            this.physics.world.timeScale = 1 + sat;
            console.log(this.globalColor.color);
            this.updateColors();
        }

        if (keyUP.isDown) {
            if (sat < .99) {
                sat += .01;
                this.globalColor.s += .01
                if (this.globalColor == colorBLUE) {
                    this.physics.world.timeScale += .01; // physics
                }
                // this.camControl.update(delta);
                //keep saturation state between worlds
                // if (this.globalColor == colorGREEN) {
                //     physicsList.each((group) => {
                //         group.children.each(function (child) {
                //             child.body.bounce.y += .01;
                //         }, this);
                //     })
                // }
                // if (this.globalColor == colorBLUE) {
                //     if (sat == .99) {
                //         physicsList.each((group) => {
                //             group.children.each(function (child) {
                //                 child.body.setImmovable(true);
                //                 child.body.setVelocity(0, 0);
                //             }, this);
                //         })
                //     }
                //     else if (sat < .99) {
                //         physicsList.each((group) => {
                //             group.children.each(function (child) {
                //                 child.body.setImmovable(false);
                //                 child.body.setGravityY(-2000)
                //             }, this);
                //         })
                //     }
                // }
            }
            this.updateColors();
        }
        else if (keyDOWN.isDown) {
            if (sat > 0.01) {
                sat -= .01;
                this.globalColor.s -= .01
                if (this.globalColor == colorBLUE) {
                    this.physics.world.timeScale -= .01; // physics
                }
                // if (this.globalColor == colorGREEN) {
                //     physicsList.each((group) => {
                //         group.children.each(function (child) {
                //             child.body.bounce.y += .01;
                //         }, this);
                //     })
                // }
                // else if (this.globalColor == colorBLUE) {
                //     if (sat == .99) {
                //         physicsList.each((group) => {
                //             group.children.each(function (child) {
                //                 child.body.setImmovable(true);
                //                 child.body.setVelocity(0, 0);
                //             }, this);
                //         })
                //     }
                //     else if (sat < .99) {
                //         physicsList.each((group) => {
                //             group.children.each(function (child) {
                //                 child.body.setImmovable(false);
                //                 child.body.setGravityY(-2000)
                //             }, this);
                //         })
                //     }
                // }
                this.updateColors();
            }
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

            // this.checkpointGroup.children.each((box) => {

            // })

            // if (parseInt(this.clockDisplay.text) > highScore) {
            //     highScore = this.clockDisplay.text;
            //     console.log("New Highscore: " + highScore);
            //     localStorage.setItem("highScore", highScore);
            //     this.highestScore.setText("Current Highscore: " + localStorage.getItem("highScore"));
            // }

            //Update timer text
            //this.clockDisplay.setText(Math.floor(this.clock.getElapsedSeconds()));
        }
        // console.log(this.body.velocity);

    }

    updateColors() {
        // this.p1.setTint(this.globalColor.color); //Uncomment if we want to change player color
        if (this.globalColor == colorGREEN) { //Global Color is GREEN, adjust accordingly
            this.groundLayer.forEachTile(tile => { //Loop through ground layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightGREEN.s = this.globalColor.s;
                    tile.tint = colorLightGREEN.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkGREEN.s = this.globalColor.s;
                    tile.tint = colorDarkGREEN.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            // this.backgroundLayer.forEachTile(tile => { //Loop through background layer and set each tile color depending on its property
            //     if (tile.properties.Shade == "Light") {
            //         colorLightGREEN.s = this.globalColor.s;
            //         tile.tint = colorLightGREEN.color;
            //     } else if (tile.properties.Shade == "Dark") {
            //         colorDarkGREEN.s = this.globalColor.s;
            //         tile.tint = colorDarkGREEN.color;
            //     } else {
            //         tile.tint = this.globalColor.color;
            //     }
            // });
            this.sceneryLayer.forEachTile(tile => { //Loop through scenery layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightGREEN.s = this.globalColor.s;
                    tile.tint = colorLightGREEN.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkGREEN.s = this.globalColor.s;
                    tile.tint = colorDarkGREEN.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            this.deathLayer.forEachTile(tile => { //Loop through death layer and set each tile color depending on its property
                if (tile.properties.Shade == "Light") {
                    colorLightGREEN.s = this.globalColor.s;
                    tile.tint = colorLightGREEN.color;
                } else if (tile.properties.Shade == "Dark") {
                    colorDarkGREEN.s = this.globalColor.s;
                    tile.tint = colorDarkGREEN.color;
                } else {
                    tile.tint = this.globalColor.color;
                }
            });
            this.checkpointGroup.setTint(this.globalColor.color); //Set tint of checkpoints3
            this.boxGroup.setTint(this.globalColor.color); //Set tint of checkpoints
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
            // this.backgroundLayer.forEachTile(tile => { //Loop through background layer and set each tile color depending on its property
            //     if (tile.properties.Shade == "Light") {
            //         colorLightBLUE.s = this.globalColor.s;
            //         tile.tint = colorLightBLUE.color;
            //     } else if (tile.properties.Shade == "Dark") {
            //         colorDarkBLUE.s = this.globalColor.s;
            //         tile.tint = colorDarkBLUE.color;
            //     } else {
            //         tile.tint = this.globalColor.color;
            //     }
            // });
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
            this.deathLayer.forEachTile(tile => { //Loop through scenery layer and set each tile color depending on its property
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
            this.checkpointGroup.setTint(this.globalColor.color); //Set tint of checkpoints
            this.boxGroup.setTint(this.globalColor.color); //Set tint of checkpoints
        }

    }
}
