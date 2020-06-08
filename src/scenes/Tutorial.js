class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
        this.MAX_X_VEL = 2000;
        this.MAX_Y_VEL = 2000;
        this.addedGameOverText = false;
    }


    preload() {
        //load images/tile sprite
        this.load.tilemapTiledJSON("tilemapJson", "./assets/tutorialTilemap.json"); //Tiled JSON file
        this.load.spritesheet("tilemapImage", "./assets/ruinTileSheetFixed.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.spritesheet("backgroundImage", "./assets/backgroundWorking.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.audio('bgMusic', './assets/TalesfromtheLoop.mp3');
        this.load.audio('jump', './assets/honk.mp3');
        this.load.atlas('animation', './assets/rock_boi_run.png', './assets/rock_boi_run_atlas.json'); //Player
    }

    create() {
        this.dialogueOn = false;
        this.walk = false;
        this.jump = false;
        this.col = false;
        this.check = false;
        this.goal = false;

        physicsList = new Phaser.Structs.List(Phaser.GameObjects.Group);

        if (!bgMusic) {
            bgMusic = this.sound.add('bgMusic', { volume: 0.2 });
            bgMusic.play({
                loop: true,
            });
        }

        //Add a tilemap
        const tilemap = this.add.tilemap("tilemapJson");
        //Add a tile set to the tilemap
        const tileset = tilemap.addTilesetImage("tilemap", "tilemapImage");
        //Create static layers
        this.sceneryLayer = tilemap.createDynamicLayer("Scenery", tileset, 0, 0);
        this.backgroundLayer = tilemap.createDynamicLayer("Background", tileset, 0, 0);
        this.deathLayer = tilemap.createDynamicLayer("Death", tileset, 0, 0);

        //Set up Tilemap Collision
        this.backgroundLayer.setCollisionByProperty({ hasCollision: true });
        this.deathLayer.setCollisionByProperty({ hasCollision: true });

        //Define a render debug so we can see the Tilemap's collision bounds
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null, //Color of non-colliding tiles
        //     collidingLineColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });
        const p1Spawn = tilemap.findObject("Objects", obj => obj.name === "PlayerSpawn");

        //spawn player
        this.p1 = new Player(this, p1Spawn.x, p1Spawn.y, 'animation', 'rockDudeRun1.png');
        this.p1.lastCheckpoint = p1Spawn;
        this.playerGroup = this.add.group();
        this.playerGroup.add(this.p1);
        this.playerGroup.name = 'player';

        physicsList.add(this.playerGroup);

        //Setting up checkpoints
        this.checkpoints = tilemap.createFromObjects("Objects", "Checkpoint", {
            key: "tilemapImage",
            frame: 304,
        }, this);
        this.checkpointGroup = this.add.group(this.checkpoints);
        this.physics.world.enable(this.checkpoints, Phaser.Physics.Arcade.STATIC_BODY);

        //Setting up endGoal
        this.endGoals = tilemap.createFromObjects("Objects", "EndGoal", {
            key: "tilemapImage",
            frame: 400,
        }, this);
        this.endGoalGroup = this.add.group(this.endGoals);
        this.physics.world.enable(this.endGoals, Phaser.Physics.Arcade.STATIC_BODY);

        //Setting up jump pads
        this.bouncepads = tilemap.createFromObjects("Objects", "Bouncepad", {
            key: "tilemapImage",
            frame: 300,
        }, this);

        this.bouncepadGroup = this.add.group(this.bouncepads);


        this.physics.world.enable(this.bouncepads, Phaser.Physics.Arcade.STATIC_BODY);

        this.bouncepadGroup.children.each(function (child) {
            child.body.setSize(190,70);
            child.body.setOffset(-45, 80);
        }, this);


        //Set gravity
        this.physics.world.gravity.y = 3000;
        //Set world bounds to tilemap dimensions
        this.physics.world.bounds.setTo(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

        //Create colliders;

        this.physics.add.collider(this.p1, this.backgroundLayer, () => { //When player touches the floor layer, allow them to jump again
            if (this.p1.facing === 'left' && ( this.p1.anims.getCurrentKey() =='jumpRight' || this.p1.anims.getCurrentKey() =='jumpLeft')) {
                this.p1.setFrame('rockDudeRun15.png');
            }
            else if( this.p1.anims.getCurrentKey() =='jumpRight' || this.p1.anims.getCurrentKey() =='jumpLeft')
            {
                this.p1.setFrame('rockDudeRun1.png');
            }
        });

        this.physics.add.collider(this.p1, this.deathLayer, () => { //When player touches deadly objects, respawn at last checkpoint
            if (!this.p1.dead) {
                this.p1.dead = true;
                this.p1.anims.stop();
                if (this.p1.facing == 'left' || this.p1.facing === 'idleLeft')
                {
                    this.p1.play('deathLeft');

                }
                else {
                    this.p1.play('deathRight');
                }
                this.p1.once('animationcomplete', () => {
                    // this.p1.once('death', () => {
                    this.p1.x = this.p1.lastCheckpoint.x;
                    this.p1.y = this.p1.lastCheckpoint.y - 100;
                    this.p1.body.setVelocity(0 , 0);
                    this.p1.dead = false;

                    this.p1.setFrame('rockDudeRun1.png');
                }, this);
            }
        });

        this.physics.add.overlap(this.p1, this.checkpointGroup, (player, checkpoint) => { //When player touches checkpoint, store it
            this.p1.lastCheckpoint = checkpoint;
        });

        this.physics.add.overlap(this.p1, this.endGoalGroup, () => { //When player touches endGoal, set gameOver to true
            if (!this.gameOver) {
                this.gameOver = true;
                this.p1.anims.stop();
                if (this.p1.facing === 'left'  || this.p1.facing === 'idleLeft') {
                    this.p1.setFrame('rockDudeRun15.png');
                }
                else {
                    this.p1.setFrame('rockDudeRun1.png');
                }
            }
        });

        //Setting up platforms, had to use filerObjects since we're making them a class
        this.platformSpawns = tilemap.filterObjects("Objects", (object) => {
            if (object.name == "Platform") {
                return true;
            } else {
                return false;
            }
        });

        this.platformsGroup = this.add.group();
        for (var itr = 0; itr < this.platformSpawns.length; itr++) {
            this.platform = new Platform(this, this.platformSpawns[itr].x, this.platformSpawns[itr].y);
            this.platform.setTexture("tilemapImage", 104);
            this.platform.body.setSize(100, 30, 0, 0);
            this.platformsGroup.add(this.platform);
        }
        // this.physics.world.enable(this.platformsGroup, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.physics.add.collider(this.p1, this.platformsGroup);

        //Set up camera to follow player
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels); //Set camera bounds to the tilemap bounds
        this.cameras.main.startFollow(this.p1, true, 0.25, 0.25); //Make camera follow player
        this.cameras.main.setZoom(0.5);

    
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
        this.gameOver = false;


        this.anims.create({
            key: 'runRight',
            frameRate: 15,
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
            frameRate: 15,
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
            key: 'jumpRight',
            frameRate: 15,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeJump',
                start: 1,
                end: 7,
                zeropad: 1,
                suffix: '.png'
            }),
            // repeat: -1,
        });
        this.anims.create({
            key: 'jumpLeft',
            frameRate: 15,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeJump',
                start: 8,
                end: 14,
                zeropad: 1,
                suffix: '.png'
            }),
            // repeat: -1,
        });
        this.anims.create({
            key: 'deathRight',
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
        this.anims.create({
            key: 'deathLeft',
            frameRate: 10,
            frames: this.anims.generateFrameNames('animation', {
                prefix: 'rockDudeDeath',
                start: 12,
                end: 22,
                zeropad: 1,
                suffix: '.png'
            }),
            // repeat: -1,
        });

        this.globalColor = colorBLUE;
        this.globalColor.s = sat;
        this.updateColors();

        this.physics.add.collider(this.p1, this.bouncepadGroup, () => {
            if (this.globalColor == colorGREEN)
            {
                this.p1.setVelocityY(-3500*sat);
            }
            // this.p1.isJumping = false;
            // this.jump.stop();
        });
    }

    update(time, delta) {
        this.platformsGroup.children.each(function (child) {
            child.color = this.globalColor;
            child.update();
        }, this);

        this.p1.updateTime(this.time.now);
        //keep saturation state between worlds

        if (this.globalColor == colorGREEN) {
            physicsList.each((group) => {
                if (group.name == 'player') {
                    group.children.each(function (child) {
                        child.body.bounce.y = sat;
                        this.physics.world.updateMotion(this.p1.body, .00005);
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
                    }, this);
                }
                else {
                    group.children.each(function (child) {
                        child.body.bounce.y = 0;
                        if (sat == 0.99) {
                            child.body.setImmovable(true);
                            child.body.veloctiyX = 0;
                            child.body.velocityY = 0;
                        }
                        // else {
                        // }
                    }, this);
                }
            })
        }

        //check key input for restart
        if (this.gameOver) {

            if (!this.addedGameOverText) {
                this.addedGameOverText = true;
                this.gameOverText = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 500, "You finished the tutorial!", scoreConfig).setOrigin(0.5);
                this.gameOverInstructions = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 400, "Space to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            }
            this.gameOverText.x = this.cameras.main.midPoint.x;
            this.gameOverText.y = this.cameras.main.midPoint.y - 500;
            this.gameOverInstructions.x = this.cameras.main.midPoint.x;
            this.gameOverInstructions.y = this.cameras.main.midPoint.y - 400;
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.resetSettings();
                this.scene.restart();
            } else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                // bgMusic.destroy();
                // bgMusic = null;
                this.resetSettings();
                this.scene.start("menuScene");
            }
        }

        if(this.p1.body.x >= 205 && !this.walk)
        {
            this.walk = true;
            this.dialogueOn = true;
            this.talk = this.add.text(this.cameras.main.midPoint.x + 400, this.cameras.main.midPoint.y-500, "Move left with A and right with D.", scoreConfig).setOrigin(0.5);
            let done = this.time.delayedCall(3000, () => { this.dialogueOn = false; this.talk.destroy();}, null, this)
        }
        if(this.p1.body.x >= 450 && !this.jump)
        {
            this.jump = true;
            this.dialogueOn = true;
            this.talk = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 500, "Press Space to Jump! Try jumping on the jump pad in front of you.", scoreConfig).setOrigin(0.5);
            let done = this.time.delayedCall(3000, () => { this.dialogueOn = false; this.talk.destroy(); }, null, this)
        }
        if(this.p1.body.x >= 650 && !this.col)
        {
            this.col = true;
            this.dialogueOn = true;
            this.talk = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 500, "Change the colors of the world by using the arrow keys!", scoreConfig).setOrigin(0.5);
            this.talk2 = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 400, "Green is a bouncy world while Blue slows the world down.", scoreConfig).setOrigin(0.5);
            this.talk3 = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 300, "Experiment with changing the saturation with the up and down arrows keys to affect the world!", scoreConfig).setOrigin(0.5);
            let done = this.time.delayedCall(7000, () => { this.dialogueOn = false; this.talk.destroy(); this.talk2.destroy(); this.talk3.destroy();}, null, this)
        }
        if(this.p1.body.x >= 1670 && !this.check)
        {
            this.check = true;
            this.dialogueOn = true;
            this.checkTalk = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 500, "Once you reach a checkpoint flag you will respawn there when you die.", scoreConfig).setOrigin(0.5);
            this.checkTalk2 = this.add.text(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y - 400, "Reach the end flag to win the level!", scoreConfig).setOrigin(0.5);
            let done = this.time.delayedCall(5000, () => { this.dialogueOn = false; this.checkTalk.destroy(); this.checkTalk2.destroy();}, null, this)
        }
        if (!this.gameOver && !this.dialogueOn) {

            //Input from WASD
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.globalColor = colorGREEN;
                this.globalColor.s = sat;
                this.physics.world.timeScale = 1;
                this.updateColors();
            }
            else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                this.globalColor = colorBLUE;
                this.globalColor.s = sat;
                this.physics.world.timeScale = 1 + sat;
                this.updateColors();
            }

            if (keyUP.isDown) {
                if (sat < .99) {
                    sat += .01;
                    this.globalColor.s += .01
                    if (this.globalColor == colorBLUE) {
                        this.physics.world.timeScale = 1 + sat; // physics
                    }
                }
                this.updateColors();
            }
            else if (keyDOWN.isDown) {
                if (sat > 0.01) {
                    sat -= .01;
                    this.globalColor.s -= .01
                    if (this.globalColor == colorBLUE) {
                        this.physics.world.timeScale = 1 + sat; // physics
                    }
                    this.updateColors();
                }
            }

            this.p1.update();

        }
    }

    updateColors() {
        this.backgroundLayer.forEachTile(tile => { //Loop through background layer and set each tile color depending on its property
            tile.tint = this.globalColor.color;
        });
        this.deathLayer.forEachTile(tile => { //Loop through death layer and set each tile color depending on its property
            tile.tint = this.globalColor.color;
        });
        this.sceneryLayer.forEachTile(tile => { //Loop through scenery layer and set each tile color depending on its property
            tile.tint = this.globalColor.color;
        });
        this.checkpointGroup.setTint(this.globalColor.color); //Set tint of checkpoints
        this.endGoalGroup.setTint(this.globalColor.color);
        this.bouncepadGroup.setTint(this.globalColor.color); //Set tint of bouncepads
        this.playerGroup.setTint(this.globalColor.color); //Set tint of player
        this.platformsGroup.setTint(this.globalColor.color); //Set tint of platforms
    }

    resetSettings() {
        this.addedGameOverText = false;
        this.globalColor = colorGREEN;
        sat = 1;
    }
}
