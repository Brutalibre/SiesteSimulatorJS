var MIN_LUM = 5;
var MAX_LUM = 60;
var CLOSED_LUM = MAX_LUM / 4;
var EYE_WIDTH_MULTIPLIER  = 1.65;
var EYE_HEIGHT_MULTIPLIER = 1.65;
var EYE_SHAPE = "data/Assets/eyeContour.svg";

function Eye () {
  this.minCamLuminosity = MIN_LUM;
  this.maxCamLuminosity = MAX_LUM;
  this.scoringLevel = CLOSED_LUM;
  
  //mappedBrightness = mapBgt((minCamLuminosity + maxCamLuminosity) / 2);
  this.isClosed = false;
  
  this.baseWidth = width * EYE_WIDTH_MULTIPLIER;
  this.baseHeight = height * EYE_HEIGHT_MULTIPLIER;
  
  this.shape = loadImage(EYE_SHAPE);    
  
  /*
   * Draw the eye depending on the camera average brightness.
   */ 
  this.render = function (brightnessAvg) {
    this.mappedBrightness = this.mapBgt(brightnessAvg);
    this.isClosed = brightnessAvg <= this.scoringLevel;
    
    imageMode(CENTER);
    image(this.shape, width/2, height/2, this.baseWidth, this.mappedBrightness);
    imageMode(CORNER);
    
    // This is just to fill the blanks left above and under the shape.
    fill(0);
    rect(0, 0, width, height/2 - this.mappedBrightness/2 + this.mappedBrightness/8);
    rect(0, height/2 + this.mappedBrightness/2 - this.mappedBrightness/8, width, height/2 - this.mappedBrightness/2 + this.mappedBrightness/8);
  }
  
  /* 
   * Map the camera average brightess to fit the screen height.
   * Also normalize the extreme values.
   */
  this.mapBgt = function (brightnessAvg) {
    if (brightnessAvg <= this.minCamLuminosity)        brightnessAvg = this.minCamLuminosity;
    else if (brightnessAvg >= this.maxCamLuminosity)   brightnessAvg = this.maxCamLuminosity;
    
    // Subtract 1 to min luminosity bc resizing the img to 0 causes a crash !
    return map(brightnessAvg, this.minCamLuminosity-1, this.maxCamLuminosity, 0, this.baseHeight);
  }
}