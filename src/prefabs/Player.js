class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.MAX_X_VEL = 10000;
        this.MAX_Y_VEL = 2000;

        scene.physics.add.existing(this);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.setScale(.2);
        this.body.setSize(this.width);
        this.body.setDragX(5000);
        this.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.body.setCollideWorldBounds(true);
        this.isJumping = false;
        this.lastCheckpoint;
        this.xMovement = 800;
        this.yMovement = 7000;
        this.facing = 'right';
        this.jumpTimer = 0;
        this.time = 0;
        this.dead = false;
    }

    update() {
        var standing = this.body.blocked.down || this.body.touching.down;
        // console.log(this.body.touching.down);
        // console.log(this.body.velocity);
        // //Input from WASD
        if (this.dead != true) {
            if (keyA.isDown) {
                this.setVelocityX(-this.xMovement);
                if (this.facing !== 'left') {
                    this.play('runLeft',true);
                    this.facing = 'left';
                }
                else
                    this.play('runLeft',true);
            }
            else if (keyD.isDown) {
                this.setVelocityX(this.xMovement);
                if (this.facing !== 'right') {
                    this.play('runRight');
                    this.facing = 'right';
                }
                else
                    this.play('runRight',true);
            }
            else {
                if (this.facing !== 'idle') {
                    this.anims.stop();
                    if (this.facing === 'left') {
                        this.setFrame('rockDudeRun15.png');
                    }
                    else {
                        this.setFrame('rockDudeRun1.png');
                    }
                    this.facing = 'idle';
                }
            }
            if (standing && keySPACE.isDown && this.time > this.jumpTimer) {
                this.setVelocityY(-this.yMovement);
                this.jumpTimer = this.time + 750;
                this.play('jump');
                this.isJumping = true;
            }
            if(this.jumpTimer < this.time && this.isJumping){
                this.isJumping = false;
                if (this.facing === 'left') {
                    this.setFrame('rockDudeRun15.png');
                }
                else {
                    this.setFrame('rockDudeRun1.png');
                }
            }
            // if (standing && this.isJumping) {
            //     this.isJumping = false;
            //     if (this.facing === 'left') {
            //         this.setFrame('rockDudeRun15.png');
            //     }
            //     else {
            //         this.setFrame('rockDudeRun1.png');
            //     }
            //     // this.anims.stop();
            // }
        }
    }
    updateTime(num) {
        this.time = num;
    }
    // else if (keyS.isDown && this.y <= 850) {
    //     this.setVelocityY(100);
    // }
}
