var c = document.getElementById("game");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var animateID = window.requestAnimationFrame(animate);
var stop = false;

var player = {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, currentPower:null};
var moveSpeed = 0;
var projectileSpeed = 5;
var shootCD = 20;
var keys = [];
var frameCount = 0;
var elements = [];
var collidibles = [
  // Outer Walls
  {x:0,y:0,w:10,h:height},
  {x:width-10,y:0,w:10,h:height},
  {x:0,y:height-10,w:width,h:10},
  {x:0,y:0,w:width,h:10},

  // Inner walls
  {x:0,y:80, w:300, h:10},
  {x:80, y:400, w:10, h:200},
  {x:350, y:250, w:100, h:100}
];

var pickups = [
  {x:Math.random()*width, y:Math.random()*height, w:10, h:10, onPickup: gain, color:'blue', name:'water'},
  {x:Math.random()*width, y:Math.random()*height, w:10, h:10, onPickup: gain, color:'orange', name:'fire'}
  //{x:Math.random()*width, y:Math.random()*height, w:10, h:10, onPickup: gain, name:'water'},
];

var enemies = [{x:400, y:150, w:10, h:10, hp:10, speed:1}];

var projectiles = [];


// --- Main loop ---

function animate(timestamp){
  var moving = false;

  if(keys['SHIFT'] && player.stamina > 0){
    player.stamina -= 4;
    moveSpeed = 4;
  }else{
    if(player.stamina <= 99){
      player.stamina ++;
    }
    moveSpeed = 2;
  }

  if(frameCount++ >= 1000){
    frameCount = 0;
  }

  // Clear canvas
  ctx.save();
  ctx.clearRect(0,0,width,height);

  // Draw things
  drawCollidibles();
  drawPickups();
  drawProjectiles();
  drawEnemies();

  // Move player or collide with walls
  moving = checkMove('LEFT',  'x', true)  || moving;
  moving = checkMove('RIGHT', 'x', false) || moving;
  moving = checkMove('UP',    'y', true)  || moving;
  moving = checkMove('DOWN',  'y', false) || moving;

  // Collide with pickups
  pickup();

  // Collide projectiles
  collideProjecties();

// Shoot  
  if(keys['SPACE'] && player.cd <= 0 && player.currentPower){
    // Shoot
    drawPlant('Shoot');
    shoot();
  }else if(player.cd > 10){
    // Just shot
    drawPlant('Shoot');
  }else{
    // Animate mr plant
    if(moving === true) {
      if(frameCount % 15 > 10){
        drawPlant(2);
      }else if(frameCount % 15 > 5){
        drawPlant(1);
      }else{
        drawPlant(3);
      }
    }else{
      drawPlant(1);
    }
  }

  if(player.cd > 0){
    player.cd --;
  }

  
  //roundedRect(ctx, player.x, player.y, 10, 10, 4, "blue");
  ctx.restore();

  if (stop === false) {
      window.requestAnimationFrame(animate);
    }
}

function checkMove(key, moveProperty, invert){
  if(keys[key]){
    // Key pressed

    player.lastDirection = key;

    if(invert){
      player[moveProperty] -= moveSpeed;
    }else{
      player[moveProperty] += moveSpeed;
    }
    var index = collision(player, collidibles);
    if(index > -1){
      // Collided with object
      if(invert){
        player[moveProperty] += moveSpeed;
      }else{
        player[moveProperty] -= moveSpeed;
      }
    }else{
      return true;
    }    
  }
  return false;
}

function collideProjecties(){
  
  for(i=0; i<projectiles.length; i++){
    var index = collision(projectiles[i], collidibles);
    if(index > -1){
      // Collision with walls
      projectiles.splice(i,1);
    }else{
      // Collision with enemies
      index = collision(projectiles[i], enemies);
      if(index > -1){
        projectiles.splice(i,1);
        enemies.splice(index,1);
      }
    }
  }
}

function shoot(){
  switch(player.currentPower){
    case 'water':
      var p = {x:player.x, y:player.y, w:3, h:3, color:'blue', tX:0, tY:0};
      p = modDirection(p);
      projectiles.push(p);

      player.cd = shootCD;
    break;
  }
}

function modDirection(p){
  // Make the projectile appear in the right place
  if(keys['RIGHT'] || p['RIGHT']){
    p.x += player.w;
    p.y += 10;
    p.tX = projectileSpeed;
  }
  if(keys['LEFT'] || p['LEFT']){
    p.y += 10;
    p.tX = 0 - projectileSpeed;
  }
  if(keys['UP'] || p['UP']){
    p.tY = 0 - projectileSpeed;
    p.x += player.w/2;
  }
  if(keys['DOWN'] || p['DOWN']){
    p.y += player.h;
    p.tY = projectileSpeed;
    p.x += player.w/2;
  }

  if(p.tX === 0 && p.tY === 0){
    // Shoot in the last direction pressed
    p[player.lastDirection] = true;
    p = modDirection(p);
  }

  return p;
}

// --- Collision ---

function collision(obj, arr) {
  var i;
  for(i=0; i<arr.length; i++){
    var coll = arr[i];
    if((obj.x + obj.w > coll.x && obj.x < coll.x + coll.w) &&
      (obj.y + obj.h > coll.y && obj.y < coll.y + coll.h)){
      return i;
    }
  }
  return -1;
}

function pickup(){
  var i;
  for(i=0; i<pickups.length; i++){
    var o = pickups[i];
    if((player.x + player.w > o.x && player.x < o.x+o.w) &&
      (player.y + player.h > o.y && player.y < o.y+o.h)){
      o.onPickup(o.name);
      pickups.splice(i,1);
      break;
    }
  }
}

function gain(item){
  console.log('Gained water!');

  switch(item){
    case 'water':    
      player.currentPower = item;
      elements.push({name:item, color:'blue'});
    break;
    case 'fire':
      player.currentPower = item;
      elements.push({name:item, color:'orange'});
    break;

  }
}

// --- Drawing ---

function drawPickups() {
  var i;
  for(i=0; i<pickups.length; i++){
    var o = pickups[i];
    rect(o.x, o.y, o.w, o.h, o.color);
  }
}

function drawCollidibles() {
  var i;
  for(i=0; i<collidibles.length; i++){
    var o = collidibles[i];
    rect(o.x, o.y, o.w, o.h, '#000000');
  }
}

function drawEnemies() {
  var i;
  for(i=0; i<enemies.length; i++){
    var o = enemies[i];
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(enemies[i].x, enemies[i].y, enemies[i].w, 0, 360, false);
      ctx.stroke();
      ctx.fill();
  }
}

function drawProjectiles(){
  var i;
  for(i=0; i<projectiles.length; i++){
    var o = projectiles[i];
    o.x += o.tX;
    o.y += o.tY;
    rect(o.x, o.y, o.w, o.h, o.color);
  }
}

function rect(x,y,w,h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.stroke();
  ctx.fill();
}

function drawPlant(state) {
  var x = player.x;
  var y = player.y;

  if(keys['LEFT'] || player.lastDirection === 'LEFT'){
    flipImage(document.getElementById('planty' + state), x, y);
  }else{
    ctx.drawImage(document.getElementById('planty' + state),x,y);
  }
  
  for(i=0; i<elements.length; i++){
    var e = elements[i];
    var w = (player.currentPower === e.name) ? 6 : 5;
    rect(x + (i*5), y, w, w, e.color);
  }

  // Stam bar
  rect(x,y+player.h, player.w * (player.stamina/100), 3, 'yellow');
}

function flipImage(image, x, y) {

  x = (image.width * -1) + 0-x;

  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(image, x, y, image.width, image.height);
  ctx.restore();
}


// ---  Movement  ---

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