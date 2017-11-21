/*
 * This class describes a position and size, relative to screen width and height.
 * It describes a width, height, x-position and y-position.
 */

function Position (_w, _h, _x, _y) {
  this.w = _w;
  this.h = _h;
  this.x = _x;
  this.y = _y;
  
  this.equals = function (compared) {
    return ( compared instanceof Position
             && this.w == compared.w 
             && this.h == compared.h 
             && this.x == compared.x 
             && this.y == compared.y 
           );
  }
  
  this.getRealPos = function () {
    return new Position( this.w * width, this.h * height, this.x *= width, this.y * height);
  }
}