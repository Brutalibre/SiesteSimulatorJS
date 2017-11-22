/*
 * This class describes a teacher movement.
 * It describes the start position and time, and the arrival position and time.
 */

function Movement (_startP, _endP, _startT, _endT, _zone) {
    this.startPos = _startP;
    this.endPos = _endP;
    this.startTime = _startT;
    this.endTime = _endT;
    this.zone = _zone;

  
  this.mapTime = function (timer) {
    return map(timer, this.startTime, this.endTime, 0, 100);
  }  
  
  this.mapPosition = function (percent) {
    if (percent < 0 || percent > 100)
      percent = 0;
      
    var mappedX = map(percent, 0, 100, this.startPos.x, this.endPos.x);
    var mappedY = map(percent, 0, 100, this.startPos.y, this.endPos.y);
    var mappedW = map(percent, 0, 100, this.startPos.w, this.endPos.w);
    var mappedH = map(percent, 0, 100, this.startPos.h, this.endPos.h);
    
    return new Position(mappedW, mappedH, mappedX, mappedY);
  }
}