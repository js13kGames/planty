var c = document.getElementById("game");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var animateID;
var stop = true;
var i;
var root = this;

var planty1 = new Image();
planty1.src = "./images/planty1.gif";

var planty2 = new Image();
planty2.src = "./images/planty2.gif";

var planty3 = new Image();
planty3.src = "./images/planty3.gif";

var plantyShoot = new Image();
plantyShoot.src = "./images/plantyShoot.gif";

var player;
var moveSpeed = 0;
var projectileSpeed = 5;
var shootCD = 20;

var enemyWidth = 20;

var keys = [];
var frameCount = 0;

var currentLevel = 1;
var levels = [];

// Level1 the water level
levels[1] = {
  collidibles : [
    // Outer Walls
    {x:0,y:0,w:10,h:height},
    {x:width-10,y:0,w:10,h:height},
    {x:0,y:height-10,w:width,h:10},
    {x:0,y:0,w:width,h:10},

    // Inner walls
    {x:10, y:400, w:80, h:10, type:'water'},

    {x:400, y:300, w:10, h:80, type:'water'},
    {x:480, y:300, w:10, h:80, type:'water'},
    {x:410, y:370, w:80, h:10, type:'water'},
    {x:400, y:300, w:80, h:10, type:'water'},

    {x:210, y:490, w:180, h:10, type:'water'},
    {x:210, y:490, w:10, h:100, type:'water'},
    {x:390, y:490, w:10, h:100, type:'water'},
  ],
  spawns : [
    {x:400,y:250,w:10,h:10, availableElements:['fire', 'earth', 'spirit', 'air'], cd:120}
  ],
  pickups : [
    {x:20, y:40, w:10, h:10, type:'water'}
  ],
  finish : [
    {x:220, y:510, w:160, h:70}
  ],
  player : {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, element:null}
};


// Level1 the air + water level
levels[2] = {
  collidibles : [
    // Outer Walls
    {x:0,y:0,w:10,h:height},
    {x:width-10,y:0,w:10,h:height},
    {x:0,y:height-10,w:width,h:10},
    {x:0,y:0,w:width,h:10},

    // Inner walls
    {x:80, y:400, w:10, h:190, type:'air'},

    {x:10, y:400, w:80, h:10, type:'water'},

    {x:400, y:300, w:10, h:80, type:'water'},
    {x:480, y:300, w:10, h:80, type:'water'},
    {x:410, y:370, w:80, h:10, type:'water'},
    {x:400, y:300, w:80, h:10, type:'water'},

    {x:610, y:430, w:180, h:10, type:'air'},
    {x:610, y:490, w:180, h:10, type:'water'},
    {x:600, y:390, w:10, h:200, type:'spirit'},
  ],
  spawns : [
    {x:400,y:250,w:10,h:10, availableElements:['fire', 'earth', 'spirit', 'air'], cd:120}
  ],
  pickups : [
    {x:20, y:40, w:10, h:10, type:'water'},
    {x:40, y:height-30, w:10, h:10, type:'fire'},
    {x:440, y:335, w:10, h:10, type:'earth'},
    {x:620, y:140, w:10, h:10, type:'air'}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ],
  player : {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, element:null}
};

// Level3 - the air water and earth level
levels[3] = {
  collidibles : [
    // Outer Walls
    {x:0,y:0,w:10,h:height},
    {x:width-10,y:0,w:10,h:height},
    {x:0,y:height-10,w:width,h:10},
    {x:0,y:0,w:width,h:10},

    // Inner walls

    {x:10, y:80, w:80, h:10, type:'air'},
    {x:80, y:10, w:10, h:80, type:'air'},

    {x:80, y:400, w:10, h:190, type:'earth'},
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
    {x:400,y:250,w:10,h:10, availableElements:['fire', 'earth', 'spirit', 'air', 'water'], cd:120}
  ],
  pickups : [
    {x:40, y:40, w:10, h:10, type:'water'},
    {x:40, y:height-30, w:10, h:10, type:'fire'},
    {x:440, y:335, w:10, h:10, type:'earth'},
    {x:620, y:140, w:10, h:10, type:'air'}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ],
  player : {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, element:null}
};




// Level4 - the air water spirit and earth level
levels[4] = {
  collidibles : [
    // Outer Walls
    {x:0,y:0,w:10,h:height},
    {x:width-10,y:0,w:10,h:height},
    {x:0,y:height-10,w:width,h:10},
    {x:0,y:0,w:width,h:10},

    // Inner walls
    {x:80, y:400, w:10, h:190, type:'air'},
    {x:600, y:350, w:10, h:250, type:'spirit'},
    {x:600, y:80, w:10, h: 80, type:'earth'},
    {x:600, y:160, w:80, h:10, type:'earth'},

    {x:10, y:400, w:80, h:10, type:'water'},

    {x:400, y:300, w:10, h:80, type:'water'},
    {x:480, y:300, w:10, h:80, type:'water'},
    {x:410, y:370, w:80, h:10, type:'water'},
    {x:400, y:300, w:80, h:10, type:'water'},

    {x:610, y:430, w:180, h:10, type:'air'},
    {x:610, y:460, w:180, h:10, type:'earth'},
    {x:610, y:490, w:180, h:10, type:'water'},
  ],
  spawns : [
    {x:400,y:250,w:10,h:10, availableElements:['fire', 'earth', 'spirit', 'air', 'water'], cd:120}
  ],
  pickups : [
    {x:20, y:40, w:10, h:10, type:'water'},
    {x:40, y:height-30, w:10, h:10, type:'fire'},
    {x:440, y:335, w:10, h:10, type:'earth'},
    {x:620, y:140, w:10, h:10, type:'air'}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ],
  player : {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, element:null}
};

// Level5 FIRE!
levels[5] = {
  collidibles : [
    // Outer Walls
    {x:0,y:0,w:10,h:height},
    {x:width-10,y:0,w:10,h:height},
    {x:0,y:height-10,w:width,h:10},
    {x:0,y:0,w:width,h:10},

    // Inner walls
    {x:10,y:80, w:300, h:10, type:'fire'},
    {x:160, y:490, h:100, w:10, type:'water'},
    {x:190, y:490, h:100, w:10, type:'fire'},
    {x:220, y:490, h:100, w:10, type:'earth'},
    {x:250, y:490, h:100, w:10, type:'air'},
    {x:10, y:480, h:10, w:260, type:'spirit'},

  ],
  spawns : [
    //{x:400,y:250,w:10,h:10, nextElement:'fire', cd:120}
  ],
  pickups : [
    // {x:20, y:40, w:10, h:10, type:'water'},
    // {x:40, y:height-30, w:10, h:10, type:'fire'},
    // {x:440, y:335, w:10, h:10, type:'earth'},
    // {x:620, y:140, w:10, h:10, type:'air'}
  ],
  finish : [
    {x:0, y:510, w:50, h:50}
  ],
  player : {x:10, y:10, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, element:null}
};

var collidibles , spawns, pickups, finish;

var elements = [];
var colors = {'fire':'#FA6900', 'water':'#046D8B', 'earth':'#784800', 'air':'ghostwhite', 'spirit':'black'};
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
      
      var nextElement = spawns[i].availableElements[Math.floor(Math.random()*4)];
      enemies.push(
        { x:spawns[i].x, 
          y:spawns[i].y, 
          w:5, h:5, 
          hp:10, 
          speed:Math.random() + .5, 
          type:nextElement
        });
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

  checkFinish();

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
  if(keys['SPACE'] && player.cd <= 0 && player.type){
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
    if(index > -1 && player.type !== collidibles[index].type){
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
    if(index > -1 && collidibles[index].type !== player.type){

      // Collision with walls
      projectiles.splice(i,1);

    }else{
      // Collision with enemies
      index = collision(projectiles[i], enemies);
      if(index > -1){
        if(player.type === enemies[index].type){
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
    
    o.x += (o.x < player.x) ? o.speed : -o.speed;
    var index = collision(o, collidibles);

    if(index === -1 || o.type === collidibles[index].type){
      // Enemy can pass on the x plane
    }else{
      o.x -= (o.x < player.x) ? o.speed : -o.speed;
    }


    o.y += (o.y < player.y) ? o.speed : -o.speed;
    index = collision(o, collidibles);
    if(index === -1 || o.type === collidibles[index].type){
      // Enemy can pass on the y plane
    }else{
      o.y -= (o.y < player.y) ? o.speed : -o.speed;
    }
  }
}

function finished(){
  currentLevel++;
  goLevel(currentLevel);
}

function checkFinish(){
  if((player.x + player.w > finish.x && player.x < finish.x + finish.w) &&
      (player.y + player.h > finish.y && player.y < finish.y + finish.h))
  {
    finished();
  }
}

function shoot() {

  var p = {x:player.x, y:player.y, w:3, h:3, color:colors[player.type], tX:0, tY:0};

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

  // Picked up an element
  elements.push({type:item, color: colors[item]});
  if(elements.length === 1){
    player.type = item;
  }
}

function get(id){
  return document.getElementById(id);
}

function die(){
  window.cancelAnimationFrame(animateID);
  stop = true;

  get('btn').classList.remove('hidden');
  get('dead').classList.remove('hidden');
  get('content').classList.add('disabled');
  get('btn').focus();
  get('dead').classList.remove('disabled');
  get('btn').innerHTML = 'Try again';
}

function again(){
  goLevel(currentLevel);
}

function goLevel(level){
  var s = window.location.toString();
  window.location = s.split('?')[0] + '?autoStart=1&level=' + level;
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
      // Expand animation from spawn
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
    flipImage(root['planty' + state], x, y);
  }else{
    ctx.drawImage(root['planty' + state],x,y);
  }
  
  for(i=0; i<elements.length; i++){
    var e = elements[i];
    var w = (player.type === e.type) ? 6 : 5;
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
        if(stop === false){
          event.preventDefault();
        }
        break;
    case 37:
    case 65:
        keys['LEFT'] = status;
        event.preventDefault();
        break;
    case 38:
    case 87:
        keys['UP'] = status;
        event.preventDefault();
        break;
    case 39:
    case 68:
        keys['RIGHT'] = status;
        event.preventDefault();
        break;
    case 40:
    case 83:
        keys['DOWN'] = status;
        event.preventDefault();
        break;
    case 16:
        keys['SHIFT'] = status;
        break;
    case 49:
    case 50:
    case 51:
    case 52:
      var a = 3-(52-code);
      // Activate element
      if(elements.length > 0){
        player.type = elements[a].type;
      }
      break;
    case 97:
    case 98:
    case 99:
    case 100:
      var a = 3-(100-code);
      // Activate element
      if(elements.length > 0){
        player.type = elements[a].type;
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
  var u = location.search;
  if(u.indexOf('autoStart') > -1){
    
    c.classList.remove('disabled');
    get('btn').classList.add('hidden');

    var q = qs(location.search);
    console.log(q);
    currentLevel = parseInt(q.level);

    collidibles = levels[currentLevel].collidibles;
    spawns = levels[currentLevel].spawns;
    pickups = levels[currentLevel].pickups;
    finish = levels[currentLevel].finish[0];
    player = levels[currentLevel].player;

    stop = false;
    animateID = window.requestAnimationFrame(animate);
  }
}

function qs(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}