class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

    }

    preload() {

    }

    create() {
        //this.background = this.add.image(game.config.width / 2, (game.config.height / 2) - 40, 'bg');
        //this.background.setScale(game.config.width / (this.background.width + 90));

        // if (!mainMenuBGMusic) {
        //     mainMenuBGMusic = this.sound.add('mainMenuBGMusic');
        //     mainMenuBGMusic.play({
        //         loop: true,
        //     });
        // }

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
            this.scene.start("playScene");
    }

}