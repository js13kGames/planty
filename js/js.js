var c = document.getElementById("game");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var animateID = window.requestAnimationFrame(animate);
var stop = false;

var playerX = 0;
var playerY = 0;
var keys = [];

function animate(timestamp){

  if(keys['RIGHT']){
    playerX ++;
  }
  if(keys['LEFT']){
    playerX --;
  }
  if(keys['UP']){
    playerY --;
  }
  if(keys['DOWN']){
    playerY ++;
  }

  ctx.save();
  ctx.clearRect(0,0,width,height);
  roundedRect(ctx, playerX, playerY, 10, 10, 4);
  ctx.restore();

  if (stop === false) {
      window.requestAnimationFrame(animate);
    }
}

function roundedRect(ctx,x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.stroke();
}

function setKey(event, status) {
    var code = event.keyCode;

    switch(code) {
    case 32:
        keys['SPACE'] = status; 
        break;
    case 37:
    case 65:
        keys['LEFT'] = status; 
        break;
    case 38:
    case 87:
        keys['UP'] = status; 
        break;
    case 39:
    case 68:
        keys['RIGHT'] = status; 
        break;
    case 40:
    case 83:
        keys['DOWN'] = status; 
        break;
    default:
        // Convert ASCII codes to letters
        key = String.fromCharCode(code);
    }

}


document.addEventListener('keydown', function(e) {
    setKey(e, true);
});

document.addEventListener('keyup', function(e) {
    setKey(e, false);
});

window.addEventListener('blur', function() {
    keys = [];
});