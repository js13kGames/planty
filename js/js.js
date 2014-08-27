var c = document.getElementById("game");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var animateID = window.requestAnimationFrame(animate);
var stop = true;
var i;

var defaultPlayer = {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, element:null};
var player = defaultPlayer;
var moveSpeed = 0;
var projectileSpeed = 5;
var shootCD = 20;

var enemyWidth = 20;

var keys = [];
var frameCount = 0;

var currentLevel = 0;
var levels = [];

levels[0] = {
  collidibles : [
    // Outer Walls
    {x:0,y:0,w:10,h:height},
    {x:width-10,y:0,w:10,h:height},
    {x:0,y:height-10,w:width,h:10},
    {x:0,y:0,w:width,h:10},

    // Inner walls
    {x:10,y:80, w:300, h:10, type:'fire'},
    {x:80, y:400, w:10, h:190, type:'air'},
    {x:600, y:350, w:10, h:250, type:'spirit'},
    {x:600, y:80, w:10, h: 80, type:'earth'},
    {x:600, y:160, w:80, h:10, type:'earth'},

    {x:10, y:400, w:80, h:10, type:'water'},

    {x:400, y:300, w:10, h:80, type:'water'},
    {x:480, y:300, w:10, h:80, type:'water'},
    {x:410, y:370, w:80, h:10, type:'water'},
    {x:400, y:300, w:80, h:10, type:'water'},

    {x:610, y:400, w:180, h:10, type:'fire'},
    {x:610, y:430, w:180, h:10, type:'air'},
    {x:610, y:460, w:180, h:10, type:'earth'},
    {x:610, y:490, w:180, h:10, type:'water'},
  ],
  spawns : [
    {x:400,y:250,w:10,h:10, nextElement:'fire', cd:120}
  ],
  pickups : [
    {x:20, y:40, w:10, h:10, type:'water'},
    {x:40, y:height-30, w:10, h:10, type:'fire'},
    {x:440, y:335, w:10, h:10, type:'earth'},
    {x:620, y:140, w:10, h:10, type:'air'}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ]
}

var collidibles = levels[currentLevel].collidibles;
var spawns = levels[currentLevel].spawns;
var pickups = levels[currentLevel].pickups;
var finish = levels[currentLevel].finish[0];

var elements = [];
var colors = {'fire':'orange', 'water':'aqua', 'earth':'brown', 'air':'ghostwhite', 'spirit':'black'};
var enemies = [];
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

  for(i=0; i<spawns.length; i++){
    if(spawns[i].cd-- <= 0){
      spawns[i].cd = 120;
      
      enemies.push(
        { x:spawns[i].x, 
          y:spawns[i].y, 
          w:5, h:5, 
          hp:10, 
          speed:Math.random() + .5, 
          type:spawns[i].nextElement
        });

      spawns[i].nextElement = ['fire','earth','water','air'][Math.floor(Math.random()*4)];
    }
  }

  // Clear canvas
  ctx.save();
  ctx.clearRect(0,0,width,height);

  // Draw things
  drawCollidibles();
  drawPickups();
  drawProjectiles();
  drawSpawns();
  drawEnemies();
  drawFinish();

  collideEnemies();

  // Move player or collide with walls
  moving = checkMove('LEFT',  'x', true)  || moving;
  moving = checkMove('RIGHT', 'x', false) || moving;
  moving = checkMove('UP',    'y', true)  || moving;
  moving = checkMove('DOWN',  'y', false) || moving;

  // Check collision with enemies
  var index = collision(player, enemies);
  if(index > -1) {
    die();
  }

  // Collide with pickups
  pickup();

  // Collide projectiles
  collideProjecties();

// Shoot  
  if(keys['SPACE'] && player.cd <= 0 && player.element){
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
      animateID = window.requestAnimationFrame(animate);
    }
}

function checkMove(direction, moveProperty, invert){
  if(keys[direction]){
    // Key pressed

    player.lastDirection = direction;

    if(invert){
      player[moveProperty] -= moveSpeed;
    }else{
      player[moveProperty] += moveSpeed;
    }

    index = collision(player, collidibles);
    if(index > -1 && player.element !== collidibles[index].type){
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
        if(player.element === enemies[index].type){
          // Same element, enemy gets stronger
          enemies[index].w+=2;
          enemies[index].h+=2;
        }else{
          // Different element, kill element
          projectiles.splice(i,1);
          enemies.splice(index,1);
        }
      }
    }
  }
}

function collideEnemies(){
  for(i=0; i<enemies.length; i++){
    var o = enemies[i];
    var index = collision(o, collidibles);

    o.x += (o.x < player.x) ? o.speed : -o.speed;
    o.y += (o.y < player.y) ? o.speed : -o.speed;

    if(index === -1 || o.type === collidibles[index].type){
      // Enemy can pass
    }else{
      o.x -= (o.x < player.x) ? o.speed : -o.speed;
      o.y -= (o.y < player.y) ? o.speed : -o.speed;
    }
  }
}

function shoot() {

  var p = {x:player.x, y:player.y, w:3, h:3, color:colors[player.element], tX:0, tY:0};

  p = modDirection(p);
  projectiles.push(p);
  player.cd = shootCD;
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
      gain(o.type);
      pickups.splice(i,1);
      break;
    }
  }
}

function gain(item){

  elements.push({type:item, color: colors[item]});
  if(elements.length === 1){
    player.element = item;
  }
}

function die(){
  window.cancelAnimationFrame(animateID);
  stop = true;

  document.getElementById('btn').classList.remove('hidden');
  document.getElementById('dead').classList.remove('hidden');
  document.getElementById('content').classList.add('disabled');
  document.getElementById('btn').focus();
  document.getElementById('dead').classList.remove('disabled');
  document.getElementById('btn').innerHTML = 'Try again';
}

function again(){
  console.log(window.location);
  if(window.location.search.indexOf('autoStart') === -1){
    window.location = window.location += '?autoStart';
  }else{
    window.location = '';
  }
}

// --- Drawing ---

function drawPickups() {
  for(i=0; i<pickups.length; i++){
    var o = pickups[i];
    rect(o.x, o.y, o.w, o.h, colors[o.type]);
  }
}

function drawCollidibles() {
  for(i=0; i<collidibles.length; i++){
    var o = collidibles[i];
    rect(o.x, o.y, o.w, o.h, colors[o.type]);
  }
}

function drawEnemies() {
  for(i=0; i<enemies.length; i++){
    var o = enemies[i];
    if(o.w < enemyWidth){
      o.w++;
      o.h++;
    }
    rect(o.x, o.y, o.w, o.h, colors[o.type], 'purple');
  }
}
 
function drawProjectiles() {
  for(i=0; i<projectiles.length; i++){
    var o = projectiles[i];
    o.x += o.tX;
    o.y += o.tY;
    rect(o.x, o.y, o.w, o.h, o.color);
  }
}

function drawSpawns() {
  for(i=0; i<spawns.length; i++){
    ctx.strokeStyle = 'black';
    ctx.fillStyle = colors[spawns[i].nextElement];
    ctx.beginPath();
    ctx.arc(spawns[i].x, spawns[i].y, spawns[i].w, 0, Math.PI*2, true );
    ctx.stroke();
    ctx.fill();
  }
}

function drawFinish() {
  ctx.fillStyle = "gray";
  ctx.font = "20pt Helvetica";
  ctx.fillText("Exit", finish.x+55, finish.y+45);
}

function rect(x,y,w,h, color, lineColor) {
  ctx.strokeStyle = lineColor || 'black';
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
    var w = (player.element === e.type) ? 6 : 5;
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
    case 49:
    case 50:
    case 51:
    case 52:
    case 97:
    case 98:
    case 99:
    case 100:
      var a = 3-(52-code);
      // Activate element
      if(elements.length > 0){
        player.element = elements[a].type;
      }
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

function onLoad(){
  if(location.search.indexOf('autoStart') > -1){
    stop = false;
    document.getElementById('content').classList.remove('disabled');
    document.getElementById('btn').classList.add('hidden');
  }
}