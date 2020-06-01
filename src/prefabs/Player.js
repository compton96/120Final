class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;

        scene.physics.add.existing(this);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.setScale(.04);
        this.body.setSize(this.width/2);
        this.body.setDragX(2000);
        this.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.body.setCollideWorldBounds(true);
        this.isJumping = false;
        this.lastCheckpoint;
        this.xMovement = 200;
        this.yMovement = 700;
        this.facing = 'left';
        this.jumpTimer = 0;
    }   

    update() {
        // console.log(this.body.velocity);
        // //Input from WASD
        if (keyA.isDown) {
            this.setVelocityX(-this.xMovement);
            if (this.facing !== 'left')
            {
                this.play('runLeft');
                this.facing = 'left';
            }
        }
        else if (keyD.isDown) {
            this.setVelocityX(this.xMovement);
            if (this.facing !== 'right')
            {
                this.play('runRight');
                this.facing = 'right';
            }
        }
        else
        {
            if (this.facing !== 'idle')
            {
                this.anims.stop();

                if (this.facing === 'left')
                {
                    this.setFrame('rockDudeRun15.png');
                }
                else
                {
                    this.setFrame('rockDudeRun1.png');
                }

                this.facing = 'idle';
            }
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
