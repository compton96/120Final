class Crusher extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, color) {
        super(scene, x, y, texture);

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;

        scene.physics.add.existing(this);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.scale = 5;
        this.movementSpeed = 1500;
        this.spawnPoint = y;
        this.goingUp = false;
        this.goingDown = true;
        this.color = color;
        this.body.setSize(45, 95);
        this.body.setOffset(27, 0);
    }

    update() {
        if(this.y >= this.spawnPoint + 375){
            this.goingDown = false;
            this.goingUp = true;
        }
        if(this.y <= this.spawnPoint){
            this.goingUp = false;
            this.goingDown = true;
        }
        if(this.goingDown && this.y < this.spawnPoint + 375){
            // console.log("Going Down");
            if(this.color == colorGREEN){
                // this.x += this.movementSpeed;
                this.setVelocityY(this.movementSpeed);
            } else{
                // this.x += this.movementSpeed * (1 - this.color.s);
                this.setVelocityY(this.movementSpeed * (1 - this.color.s));
            }
        } else if(this.goingUp && this.y > this.spawnPoint){
            // console.log("Going Up");
            if(this.color == colorGREEN){
                // this.x -= this.movementSpeed;
                this.setVelocityY(-this.movementSpeed);
            } else{
                // this.x -= this.movementSpeed * (1 - this.color.s);
                this.setVelocityY(-this.movementSpeed * (1 - this.color.s));
            }
        }
    }
}
