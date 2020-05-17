class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;

        scene.physics.add.existing(this);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.setScale(.5);
        this.body.setSize(this.width/2);
        this.body.setDragX(1000);
        this.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.body.setCollideWorldBounds(true);
        this.isJumping = false;
    }


    update() {
        // //Input from WASD
        if (keyA.isDown) {
            this.setVelocityX(-200);
        }
        else if (keyD.isDown) {
            this.setVelocityX(200);
        }

        if (Phaser.Input.Keyboard.JustDown(keyW) && this.isJumping == false) {
            this.isJumping = true;
            this.setVelocityY(-700);
        }
        if(Phaser.Input.Keyboard.JustDown(keySPACE) && this.isJumping == false){
            this.isJumping = true;
            this.setVelocityY(-700);
        }
        // else if (keyS.isDown && this.y <= 850) {
        //     this.setVelocityY(100);
        // }
    }
}
