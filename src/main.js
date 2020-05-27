/*
Game Name: 
Date Finished: 
Collaborators: Jacob Compton, Eugene Shin, Cole Cota
*/

let config = 
{
    type: Phaser.AUTO,
    pixelArt: true,
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 1,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 100, //This fixed falling through the floor
            // tileBias: 64,
            // overlapBias: 17,
        },
        
        // gravity: {
        //     x: 0,
        //     y: 0
        // }
    },
    scene: [ Menu, Play],
};

let game = new Phaser.Game(config);

//define game settings
    game.settings = {
    gameTimer: 10000,
}

let highScore = 0;
let highestScore;
// localStorage.clear();
if(localStorage.getItem("highScore")){
    highScore = localStorage.getItem("highScore");
}

//Reserve some keyboard variables
let keySPACE, keyLEFT, keyRIGHT, keyDOWN, keyUP, keyW, keyA, keyD, keyS, keyONE, keyTWO, keyTHREE;
//color vars
let slideColor = Phaser.Display.Color.IntegerToColor('0x800000');
let freezeColor = Phaser.Display.Color.IntegerToColor('0x000080');
let bounceColor = Phaser.Display.Color.IntegerToColor('0x008000');
let colorRED = Phaser.Display.Color.IntegerToColor('0x800000');
let colorDarkRED = Phaser.Display.Color.IntegerToColor('0x300000');
let colorLightRED = Phaser.Display.Color.IntegerToColor('0xed0000');
let colorBLUE = Phaser.Display.Color.IntegerToColor('0x000080');
let colorDarkBLUE = Phaser.Display.Color.IntegerToColor('0x000030');
let colorLightBLUE = Phaser.Display.Color.IntegerToColor('0x0000e6');
let saturate;
let globalColor;
let boxColor;
let boxCurrent;
let boxGroup;
let boxes;
let sat = .99;
//Global music variables so we can play music through scenes
let bgMusic;
let mainMenuBGMusic;
let destroyedMenuMusic = false;
//score display
let scoreConfig = {
    fontFamily: "Courier",
    fontSize: "28px",
    backgroundColor: "#7476ad",
    color: "#843605",
    align: "right",
    padding: {
        top: 5,
        bottom: 5,
    },
    fixedWidth: 100
}