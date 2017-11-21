var ENERGY_MAX         = 200;
var BASE_ENERGY        = ENERGY_MAX/2;
var ENERGY_ASSET_UNDER = "data/Assets/jauge_bg.png";
var ENERGY_ASSET_OVER  = "data/Assets/jauge_overlay.png";
var ENERGY_BAR_SHRINK  = 4;
var ENERGY_BAR_MULTI   = 9.0 / 10.0;
var ENERGY_COLOR       = [111, 65, 192];

var TABLES_ASSET     = "data/Assets/rangs.png";
var LAST_TABLE_ASSET = "data/Assets/dernierrang.png";

var STUN_DURATION = 3000.0;

var POINTS_ADD = 1.5;
var POINTS_SUB = 1;

function GameScene (_bg, _eye, _bgSound, _winScene, _loseScene, _teacher) {
  
  this.background = _bg;
  this.eye = _eye;
  var brightnessAvg = 100;
  
  this.bgSound = soundFiles[_bgSound];
  
  this.firstRender = true;
  
  this.winScene = _winScene;
  this.loseScene = _loseScene;
    
  this.energy = BASE_ENERGY;
  this.energyMax = ENERGY_MAX;
  this.energyBarBg = loadImage(ENERGY_ASSET_UNDER);
  this.energyBarOv = loadImage(ENERGY_ASSET_OVER);
  
  this.tables = loadImage(TABLES_ASSET);
  this.lastTable = loadImage(LAST_TABLE_ASSET);
  
  this.stunTimer = null;
  
  this.playCloseSound = true;
  
  this.isStunned = false;
  this.teacher = _teacher;
  
  // The game loop is called at every frame.
  this.gameLoop = function (cam) {
    var camPixels = cam.get(0, 0, cam.width, cam.height);
    camPixels.loadPixels();
   
    brightnessAvg = getColorAverage(camPixels);
    
    this.sceneRender();
    this.eyeBehaviour();
    this.eye.render(brightnessAvg);
    this.guiRender();
    
    if (this.firstRender) {
      this.bgSound.loop();
      this.firstRender = false;
    }
  }


  this.sceneRender = function () {
    if (this.firstRender) {
      this.teacher.startTimer();
    }
    
    // This stops the rendering of the current scene to directly jump to the winning scene.
    if (this.teacher.checkWin()) {
      activateScene(this.winScene);
      return;
    }
    
    if (this.checkLose()) {
      activateScene(this.loseScene);
      return;
    }
    
    image(this.background, 0, 0, width, height);
      
    // This means the teacher is behind the tables.
    if (this.teacher.getCurrentZone() == SAFE_ZONE || this.teacher.getCurrentZone() == ALERT_ZONE) {
      this.teacher.renderAtCurrentPosition();
      image(this.tables, 0, 0, width, height);
    }
    else {
      image(this.tables, 0, 0, width, height);
      this.teacher.renderAtCurrentPosition();
    }
    
    image(this.lastTable, 0, 0, width, height);
  }
  
  this.checkLose = function () {
    return this.teacher.getCurrentZone() == DANGER_ZONE && this.eye.isClosed;
  }

  this.eyeBehaviour = function () {
    if (this.eye.isClosed) {
      this.energy += POINTS_ADD;
    } else {
      this.energy -= POINTS_SUB;
    }
    
    if (this.energy > this.energyMax)
      this.energy = this.energyMax;
      
    // If the energy falls to 0, the student falls asleep for some time (stun).
    else if (this.energy < 0 && this.stunTimer == null)  {
      this.isStunned = true;
            
      // Energy is 0 : start stun timer.
      this.stunTimer = new Date();
    }
    
    // Stun timer is running : simulate closed eye + test with stun duration to reset it.
    if (this.isStunned) {
      // Simulate a low brightness so the eye appears as closed.
      brightnessAvg = 0.1;
      
      if (this.stunIsOver()) {
        this.stunTimer = null;
        this.isStunned = false;
      }
    }


    // Check which sound to play.
    if (this.energy <= 0 && this.isStunned)  {
        soundFiles[STUN_SOUND].play();
    }
    else if (this.playCloseSound && this.eye.isClosed) {
        this.playCloseSound = false;
        soundFiles[SLEEP_SOUND].play();
    } 
    else if (!this.playCloseSound && !this.eye.isClosed) {
        this.playCloseSound = true;
        soundFiles[WAKE_SOUND].play();
    }
  }
  
  
  this.guiRender = function () {
    imageMode(CENTER);
    
    var posX = width/2;
    var posY = height * ENERGY_BAR_MULTI;
    var barWidth  = this.energyBarOv.width - ENERGY_BAR_SHRINK*2;
    var barHeight = this.energyBarOv.height - ENERGY_BAR_SHRINK*2;
    
    image(this.energyBarBg, posX, posY);
    
    // Map the score to the gauge width.
    var mappedScore = int(map(this.energy, 0, this.energyMax, 0, barWidth));
    
    fill(ENERGY_COLOR[0], ENERGY_COLOR[1], ENERGY_COLOR[2]);  
    rect(posX - barWidth/2, posY - barHeight/2, mappedScore, barHeight);
    
    image (this.energyBarOv, posX, posY);
    
    imageMode(CORNER);
  }
  
  this.stunIsOver = function () {
    return (new Date() - this.stunTimer >= STUN_DURATION);
  }
}