class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

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
            // console.log(this.time.now);

            var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(colorBLUE, colorGREEN, 1, Math.sin(this.time.now/1000));

            // if(Math.abs(Math.cos(this.time.now/1000)) > .7){
            //     console.log("BG is green");
            // }

            // console.log(hexColor);
            this.cameras.main.setBackgroundColor(hexColor);
    }

}
