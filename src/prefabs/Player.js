class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;

        scene.physics.add.existing(this);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.setScale(.5);
        this.body.setSize(this.width/2);
        this.body.setDragX(2000);
        this.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.body.setCollideWorldBounds(true);
        this.isJumping = false;
        this.lastCheckpoint;
        this.xMovement = 200;
        this.yMovement = 700;
    }


    update() {
        // console.log(this.body.velocity);
        // //Input from WASD
        if (keyA.isDown) {
            this.setVelocityX(-this.xMovement);
        }
        else if (keyD.isDown) {
            this.setVelocityX(this.xMovement);
        }

        if (Phaser.Input.Keyboard.JustDown(keyW) && this.isJumping == false) {
            this.isJumping = true;
            this.setVelocityY(-this.yMovement);
        }
        if(Phaser.Input.Keyboard.JustDown(keySPACE) && this.isJumping == false){
            this.isJumping = true;
            this.setVelocityY(-this.yMovement);
        }
        // else if (keyS.isDown && this.y <= 850) {
        //     this.setVelocityY(100);
        // }
    }
}
