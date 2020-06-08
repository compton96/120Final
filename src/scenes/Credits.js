class Credits extends Phaser.Scene {
    constructor() {
        super("creditScene");

    }

    preload() {
        this.load.audio('bgMusic', './assets/TalesfromtheLoop.mp3');
    }

    create() {
        //this.background = this.add.image(game.config.width / 2, (game.config.height / 2) - 40, 'bg');
        //this.background.setScale(game.config.width / (this.background.width + 90));
        if (!bgMusic) {
            bgMusic = this.sound.add('bgMusic', { volume: 0.2 });
            bgMusic.play({
                loop: true,
            });
        }

        //Title
        this.madeText = this.add.text(game.config.width / 2, game.config.height / 2 - 350, "Made by:", titleConfig).setOrigin(0.5);

        this.coleText = this.add.text(game.config.width / 2, game.config.height / 2 - 150, "Cole Cota", mainMenuConfig).setOrigin(0.5);

        this.eugText = this.add.text(game.config.width / 2, game.config.height / 2 - 50, "Eugene Shin", mainMenuConfig).setOrigin(0.5);

        this.jakeText = this.add.text(game.config.width / 2, game.config.height / 2 + 50, "Jacob Compton", mainMenuConfig).setOrigin(0.5);

        this.thanksText = this.add.text(game.config.width / 2, game.config.height / 2 + 200, "Thank you for playing our game!", mainMenuConfig).setOrigin(0.5);

        this.menuButton = this.add.text(game.config.width / 2, game.config.height / 2 + 300, "Back to Menu", mainMenuConfig).setOrigin(0.5);
        this.menuButton.setInteractive({ useHandCursor: true });
        this.menuButton.on('pointerdown', () => this.enterButtonActiveState(this.menuButton));
        this.menuButton.on('pointerover', () => this.enterButtonHoverState(this.menuButton));
        this.menuButton.on('pointerout', () => this.enterButtonRestState(this.menuButton));
        this.menuButton.on('pointerup', () => {
            this.enterButtonHoverState(this.menuButton)
            this.scene.start("menuScene");
        });

        this.goingToGreen = false;
        this.goingToBlue = false;

        this.blueToGreen(this.cameras.main);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update() {
        // this.scene.start("playScene");

        if (goingToGreen) {
            // console.log("Calling Blue to Green");
            this.blueToGreen(this.cameras.main);
        } else if (goingToBlue) {
            // console.log("Calling Green to Blue");
            this.greenToBlue(this.cameras.main);
        }


        // if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
        //     // mainMenuBGMusic.destroy();
        //     // mainMenuBGMusic = null;
        //     this.scene.start("playScene");
        // }
        // if (Phaser.Input.Keyboard.JustDown(keyA)) {
        //     this.scene.start("tutorialScene");
        // }
    }

    blueToGreen(camera) {
        goingToGreen = false;
        this.tweens.addCounter({
            from: 1,
            to: 100,
            duration: 5000,
            onUpdate: function (tween) {
                var value = Math.floor(tween.getValue());

                camera.setBackgroundColor(Phaser.Display.Color.Interpolate.ColorWithColor(colorBLUE, colorGREEN, 100, value));
                if (value == 100) {
                    goingToGreen = false;
                    goingToBlue = true;
                    return;
                }
            }
        });
    }

    greenToBlue(camera) {
        goingToBlue = false;
        this.tweens.addCounter({
            from: 1,
            to: 100,
            duration: 5000,
            onUpdate: function (tween) {
                var value = Math.floor(tween.getValue());

                camera.setBackgroundColor(Phaser.Display.Color.Interpolate.ColorWithColor(colorGREEN, colorBLUE, 100, value));
                if (value == 100) {
                    goingToGreen = true;
                    goingToBlue = false;
                    return;
                }
            }
        });
    }

    enterButtonHoverState(button) {
        button.setStyle({ fill: '#e8edea' });
    }

    enterButtonRestState(button) {
        button.setStyle({ fill: '#000000' });
    }

    enterButtonActiveState(button) {
        button.setStyle({ fill: '#c7c7c7' });
    }
}
