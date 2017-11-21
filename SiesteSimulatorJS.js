var width = 1280;
var height = 720;

var MENU = 0;
var GAME = 1;
var  WIN = 2;
var LOSE = 3;

var scenes, activeScene;

var FRAME_INTERVAL = 50;

var device;
var soundFiles;

var SLEEP_SOUND = 0;
var STUN_SOUND = 1;
var WAKE_SOUND = 2;
var VICTORY_SOUND = 3;
var DEFEAT_SOUND = 4;
var MENU_SOUND = 5;
var GAME_SOUND = 6;

var SOUNDS = ["Sleep.wav", "Stun.wav", "Wake.wav", "Victory.wav", "Defeat.wav", "Menu.mp3", "Game.mp3"];

var cam;
var camIsActive = false;
var timer;

var levels;
var MOVEMENTS_ASSET = "data/Assets/Levels.json";


// We load all the data here.
function preload() {
  levels = loadJSON(MOVEMENTS_ASSET);
  soundFiles = initSounds();
}

function setup() {
  createCanvas(1280, 720);

  // Constraint the video to have the minimum width and height, and no sound.
  cam = createCapture({
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      },
      optional: [
        { maxFrameRate: 10 }
      ]
    },
    audio: false
  });
  cam.loadPixels();
  cam.hide();
  
  scenes = [];
  scenes = resetGame(scenes);
  activeScene = scenes[MENU];
  
  timer = new Date();
}

function draw() {
  if (new Date() - timer >= FRAME_INTERVAL) {
    if (camIsActive) {
      fill(0);
      rect(0, 0, width, height);
      
      activeScene.gameLoop(cam);
      
      timer = new Date();
    }
    else {
      camIsActive = cameraIsActive(cam);
    }
  }
}

function resetGame (scenes) { 
  if (activeScene)
    activeScene.bgSound.stop();
  
  scenes[MENU] = null;
  scenes[WIN] = null;
  scenes[LOSE] = null;
  activeScene = null;
  
  delete scenes[MENU];
  delete scenes[WIN];
  delete scenes[LOSE];
  delete activeScene;
  
  scenes = [];
  
  //teacher = false;
  teacher = new Teacher();
  scenes[GAME] = new   GameScene(loadImage("data/Assets/background.jpg"), new Eye(), GAME_SOUND, WIN, LOSE, teacher);
  scenes[MENU] = new StaticScene(loadImage("data/Assets/titre.jpg"),      new Eye(), MENU_SOUND, GAME, 2000.0);
  scenes[WIN]  = new StaticScene(loadImage("data/Assets/gg.jpg"),         new Eye(), VICTORY_SOUND, MENU, 2000.0);
  scenes[LOSE] = new StaticScene(loadImage("data/Assets/Perdu.jpg"),      new Eye(), DEFEAT_SOUND, MENU, 2000.0);
  
  return scenes;
}

function activateScene (scene) {
  scenes = resetGame(scenes);
  activeScene = scenes[scene];
}

function initSounds() {
  var file = [];
  
  for (var i = 0; i < SOUNDS.length; i++) {
    file[i] = loadSound("data/Sounds/" + SOUNDS[i]);
  }
  
  return file;
}

function getColorAverage (cam) {
  var avg = 0;
  var bgt = 0;
  
  for (var x = 0; x < cam.width; x++) {
    for (var y = 0; y < cam.height; y++ ) {
      // Calculate the 1D location from a 2D grid
      var loc = (x + y*cam.width)*4;

      // Get the R,G,B values from image
      var r = cam.pixels[loc];
      var g = cam.pixels[loc+1];
      var b = cam.pixels[loc+2];
      
      if (r >= 0 && g >= 0 && b >= 0) 
        bgt += brightness(color(r, g, b));
    }
  }
  
  bgt /= width*height;
  
  if (bgt >= 0) {
    return bgt;
  }
  else
    return 100;
}

function cameraIsActive (cam) {
  var pixs = cam.get(0, 0, cam.width, cam.height);
  pixs.loadPixels();
  
  // Sum of "pixels" = 0 ==> the camera is not fully loaded.
  if (pixs.pixels.reduce(function (a,b) {return a+b;}) > 0)
    return true;
  else
    return false;
}