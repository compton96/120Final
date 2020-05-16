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
    //zoom: 1,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
        gravity: {
            x: 0,
            y: 0
        }
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
let keySPACE, keyLEFT, keyRIGHT, keyDOWN, keyUP, keyW, keyA, keyD, keyS;
//color vars
let colorRED = Phaser.Display.Color.IntegerToColor('0x800000');
let colorBLUE = Phaser.Display.Color.IntegerToColor('0x000080');
let saturate;
let globalColor;
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