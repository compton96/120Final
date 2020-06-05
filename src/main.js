/*
Game Name: The Stone Golem
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
    },
    scene: [Menu, Play],
};

let game = new Phaser.Game(config);

//define game settings
game.settings = {
    gameTimer: 10000,
}

let highScore = 0;
let highestScore;
// localStorage.clear();
if (localStorage.getItem("highScore")) {
    highScore = localStorage.getItem("highScore");
}

//Reserve some keyboard variables
let keySPACE, keyLEFT, keyRIGHT, keyDOWN, keyUP, keyW, keyA, keyD, keyS, keyONE, keyTWO, keyTHREE;
//color vars
let colorGREEN = Phaser.Display.Color.IntegerToColor('0x0dcd0a');
let colorBLUE = Phaser.Display.Color.IntegerToColor('0x0bbbde');
let saturate;
let globalColor;
// let boxColor;
// let boxCurrent;
//global group
let physicsList;
//box group
// let boxGroup;
// let boxes;
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