/*
Game Name: The Stone Golem
Date Finished: 6/7/2020
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
            debug: true,
            fps: 100, //This fixed falling through the floor
            tileBias: 64,
            overlapBias: 17,
        },
    },
    scene: [Menu, Tutorial, Play],
};

let game = new Phaser.Game(config);

//Reserve some keyboard variables
let keySPACE, keyLEFT, keyRIGHT, keyDOWN, keyUP, keyW, keyA, keyD, keyS, keyONE, keyTWO, keyTHREE;
//color vars
let colorGREEN = Phaser.Display.Color.IntegerToColor('0x0dcd0a');
let colorBLUE = Phaser.Display.Color.IntegerToColor('0x0bbbde');
let saturate;
let globalColor;
let goingToBlue = false;
let goingToGreen = false;

//global group
let physicsList;

let sat = .99;
//Global music variables so we can play music through scenes
let bgMusic;
let destroyedMenuMusic = false;
//score display
let scoreConfig = {
    fontFamily: "Courier",
    fontSize: "70px",
    backgroundColor: "#7476ad",
    color: "#000000",
    align: "right",
    padding: {
        top: 5,
        bottom: 5,
    },
}

let titleConfig = {
    fontFamily: "Courier",
    fontSize: "100px",
    color: "#000000",
    align: "right",
    padding: {
        top: 5,
        bottom: 5,
    },
}

let mainMenuConfig = {
    fontFamily: "Courier",
    fontSize: "70px",
    color: "#000000",
    align: "right",
    padding: {
        top: 5,
        bottom: 5,
    },
}