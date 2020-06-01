class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, color) {
        super(scene, x, y, texture);

        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;

        scene.physics.add.existing(this);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.movementSpeed = 1;
        this.spawnPoint = x;
        this.goingLeft = false;
        this.goingRight = true;
        this.color = color;
    }

    update() {
        if(this.x >= this.spawnPoint + 200){
            this.goingRight = false;
            this.goingLeft = true;
        }
        if(this.x <= this.spawnPoint - 200){
            this.goingLeft = false;
            this.goingRight = true;
        }
        if(this.goingRight && this.x < this.spawnPoint + 200){
            // console.log("Going right");
            if(this.color == colorGREEN){
                this.x += this.movementSpeed;
            } else{
                this.x += this.movementSpeed * (1 - this.color.s);
            }
        } else if(this.goingLeft && this.x > this.spawnPoint - 200){
            // console.log("Going left");
            if(this.color == colorGREEN){
                this.x -= this.movementSpeed;
            } else{
                this.x -= this.movementSpeed * (1 - this.color.s);
            }
        }
    }
}
