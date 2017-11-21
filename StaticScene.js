/*
 * This class describles scenes as menu, victory screen, or defeat screen.
 * It goes over to next scene when the eye closes.
 */

function StaticScene (_bg, _eye, _bgSound, _nextScene, _stunDuration) {
  this.background = _bg;
  this.eye = _eye;
  var brightnessAvg = 100;
  
  this.bgSound = soundFiles[_bgSound];
  
  this.firstRender = true;
  this.nextScene = _nextScene;
  this.stunDuration = _stunDuration;
  
  // The game loop is called at every frame.
  this.gameLoop = function (cam) {
    var camPixels = cam.get(0, 0, cam.width, cam.height);
    camPixels.loadPixels();
    
    var brightnessAvg = getColorAverage(camPixels);
    
    this.sceneRender();
    this.eyeBehaviour();
    this.eye.render(brightnessAvg);
    
    if (this.firstRender) {
      this.bgSound.loop();
      this.firstRender = false;
    }
  }
  
  
  this.eyeBehaviour = function () {
    if (this.firstRender)
      this.stunTimer = new Date();
    
    
    if (this.stunOpen()) {
      brightnessAvg = 100;
    } 
    else if (this.eye.isClosed) {
      activateScene(this.nextScene);
    }
  }
  
  this.sceneRender = function () {
    image(this.background, 0, 0, width, height);
  }
  
  this.stunOpen = function () {
    return (new Date() - this.stunTimer < this.stunDuration);
  }
}