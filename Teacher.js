var TEACHER_ASSET   = "data/Assets/jose.png";

var SAFE_ZONE   = 0 + 1;
var ALERT_ZONE  = 1 + 2;
var DANGER_ZONE = 2 + 3;

/*
 * This class describes the main antagonist, the teacher.
 * It describes their position at any time and processes their movements.
 */

function Teacher () {
  // POSITION CONSTANTS. Must be declared here for correct initialization.
  // These Positions are the key Positions for the teacher movements. 0 -> 1 is Safe, 1 -> 2 is Alert, 2 -> 3 is Danger.
  var ZONE_POS =   [ new Position(0.15, 0.472, 0.34, 0.14), new Position(0.15, 0.472, 0.57, 0.14), new Position(0.356, 1.07, 0.69, 0.27), new Position(0.356, 1.07, 0.21, 0.27) ];

  this.currentPos = ZONE_POS[SAFE_ZONE];
  this.levelTimer = null;
  
  this.sprite = loadImage(TEACHER_ASSET);
  var movements = [];
  
  // This json has been loaded in preload()
  this.json = levels;
  
  Object.values(this.json).map(function (json) {
    var posStart = ZONE_POS[json.posStart];
    var posEnd = ZONE_POS[json.posEnd];
    var timeStart = json.timeStart;
    var timeEnd = json.timeEnd;
    var zone = json.posStart + json.posEnd;
      
    movements.push(new Movement(posStart, posEnd, timeStart, timeEnd, zone));
  });
  
  this.currentMovement = 0;
  this.win = false;
  
  this.startTimer = function () {
    this.levelTimer = new Date();
  }
  
  this.getCurrentZone = function () {
     return movements[this.currentMovement].zone;
  }
  
  this.checkWin = function () {
    return this.win;
  }
  
  this.renderAtCurrentPosition = function () {
    var percent = movements[this.currentMovement].mapTime(new Date - this.levelTimer);
    
    if (percent >= 100) {
      this.currentMovement ++;
      
      if (this.currentMovement < movements.length)
        percent = movements[this.currentMovement].mapTime(this.levelTimer);
      else {
        this.win = true;
        return;
      }
    }
    
    this.currentPos = movements[this.currentMovement].mapPosition(percent);
    
    var realPos = this.currentPos.getRealPos();
    
    image(this.sprite, realPos.x, realPos.y, realPos.w, realPos.h);
  }
}