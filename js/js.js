var c = document.getElementById("game");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var animateID = window.requestAnimationFrame(animate);
var stop = false;

var playerX = 0;
var playerY = 0;
var keys = [];
var frameCount = 0;

function animate(timestamp){
  var moving = false;
  var moveSpeed = (keys['SHIFT']) ? 2 : 1;
  if(frameCount++ >= 1000){
    frameCount = 0;
  }

  if(keys['RIGHT']){
    playerX += moveSpeed;
    moving = true;
  }
  if(keys['LEFT']){
    playerX -= moveSpeed;
    moving = true;
  }
  if(keys['UP']){
    playerY -= moveSpeed;
    moving = true;
  }
  if(keys['DOWN']){
    playerY += moveSpeed;
    moving = true;
  }

  ctx.save();
  ctx.clearRect(0,0,width,height);

  if(moving === true) {
    if(frameCount%15 > 5){
      plant(ctx, playerX, playerY, 1);
    }else if(frameCount%15 > 10){
      plant(ctx, playerX, playerY, 2);
    }else{
      plant(ctx, playerX, playerY, 3);
    }
  }else{
    plant(ctx, playerX, playerY, 1);
  }

  
  //roundedRect(ctx, playerX, playerY, 10, 10, 4, "blue");
  ctx.restore();

  if (stop === false) {
      window.requestAnimationFrame(animate);
    }
}

function roundedRect(ctx,x,y,width,height,radius, color){
  ctx.fillStyle = color;
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
  ctx.fill();
}

function plant(ctx, x, y, state){

  ctx.drawImage(document.getElementById('planty'+state),x,y);
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
    case 16:
        keys['SHIFT'] = status;
        break;
    default:
    console.log(code);
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