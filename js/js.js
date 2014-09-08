// Canvas
var can = document.getElementById("game");
var c = can.getContext("2d");

// Misc
var animateID, player;
var stop = true;
var root = this;

// Element types
var f='fire', w='water', s='spirit', a='air', e='earth';

// Images
var planty1 = new Image();
planty1.src = "./images/planty1.gif";

var planty2 = new Image();
planty2.src = "./images/planty2.gif";

var planty3 = new Image();
planty3.src = "./images/planty3.gif";

var plantyShoot = new Image();
plantyShoot.src = "./images/plantyShoot.gif";

// Numbers
var i, projectileSpeed = 5, shootCD = 20, spawnCD = 120, enemyWidth = 20, frameCount = 0;
// Movement
var moveSpeed = 0, keys = [];


// Levels
var currLvl = 1;
var levels = [];

var outerWalls = [
  {x:0,   y:0,  w:10, h:600},
  {x:790, y:0,  w:10, h:600},
  {x:0,   y:590,w:800,h:10},
  {x:0,   y:0,  w:800,h:10}
];

// Level 1 the water level
levels[1] = {
  walls : [
    // Inner walls
    [210, 490, 180, 10, w],
    [210, 490, 10, 100, w],
    [390, 490, 10, 100, w]
  ],
  spawns : [
    {x:400,y:250,w:10,h:10, types:[f, e, s, a], nextElement:e, cd:120}
  ],
  pickups : [
    {x:40, y:40, w:10, h:10, type:w}
  ],
  finish : [
    {x:225, y:510, w:160, h:70}
  ],
  player : {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, type:null, canShoot:false, canSprint:false}
};


// Level1 the air + water level
levels[2] = {
  walls : [
    // Inner walls
    [80, 400, 10, 190, a],
    [10, 400, 80, 10, w],
    [100, 150, 400, 10, e],
    [300, 10, 10, 150, e],
    [610, 490, 180, 10, f],
    [600, 390, 10, 200, s]
  ],
  spawns : [
    {x:350,y:370,w:10,h:10, types:[f, e, s, a], nextElement:a, cd:120}
  ],
  pickups : [
    {x:280, y:40, w:10, h:10, type:w},
    {x:40, y:570, w:10, h:10, type:f},
    {x:320, y:40, w:10, h:10, type:a}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ],
  player : {x:300, y:200, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, type:null, canShoot:false, canSprint:false}
};

// Level3 - the air water and earth level
levels[3] = {
  walls : [
    // Inner walls
    [10,80,80,10,a],
    [80,10,10,80,a],
    [80, 400, 10, 190, e],
    [600, 350, 10, 250, s],
    [600, 80, 10,  80, e],
    [600, 160, 80, 10, e],
    [10, 400, 80, 10, w],
    [400, 300, 10, 80, w],
    [480, 300, 10, 80, w],
    [410, 370, 80, 10, w],
    [400, 300, 80, 10, w],
    [610, 400, 180, 10, f],
    [610, 430, 180, 10, a],
    [610, 460, 180, 10, e],
    [610, 490, 180, 10, w]
  ],
  spawns : [
    {x:400,y:250,w:10,h:10, types:[f, e, s, a, w], nextElement:f, cd:120}
  ],
  pickups : [
    {x:40, y:40, w:10, h:10, type:w},
    {x:40, y:570, w:10, h:10, type:f},
    {x:440, y:335, w:10, h:10, type:e},
    {x:620, y:140, w:10, h:10, type:a}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ],
  player : {x:100, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, type:null, canShoot:false, canSprint:false}
};




// Level4 - the air water spirit and earth level
levels[4] = {
  walls : [
    [10, 100, 100, 10, f],
    [400, 10, 10, 580, f],
    [600, 10, 10, 150, e],
    [600, 150, 190, 10, e],
    [600, 250, 10, 250, e],
    [600, 490, 10, 100, a],
    [600, 490, 190, 10, a],
    [500, 300, 50, 10, s],
    [550, 250, 60, 10, s],
    [550, 250, 10, 60, s],
    [500, 300, 10, 60, s],
    [100, 500, 100, 10, w],
    [100, 10, 10, 500, w],
    [200, 10, 10, 500, w] 
  ],
  spawns : [
    {x:500,y:540,w:10,h:10, types:[f, a, e], nextElement:f, cd:120},
    {x:300,y:40,w:10,h:10, types:[f, w], nextElement:w, cd:120}
  ],
  pickups : [
    {x:40, y:40, w:10, h:10, type:w},
    {x:760, y:40, w:10, h:10, type:f},
    {x:580, y:290, w:10, h:10, type:e},
    {x:150, y:450, w:10, h:10, type:a}
  ],
  finish : [
    {x:620, y:510, w:160, h:70}
  ],
  player : {x:500, y:100, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, type:null, canShoot:false, canSprint:false}
};

// Level5 FIRE!
levels[5] = {
  walls : [
    [10, 80, 360, 10],
    [10, 260,360, 10],
    [10, 340,360, 10],
    [10, 500,360, 10],
    [370, 80, 10, 190],
    [370, 340,10, 170],

    [430, 80, 380, 10],
    [430, 260,380, 10],
    [430, 340,380, 10],
    [430, 500,380, 10],
    [430, 80, 10, 190],
    [430, 340,10, 170]
  ],
  spawns : [
    {x:40,y:40,w:10,h:10, types:[f, a, e, w], nextElement:f, cd:10},
    {x:760,y:40,w:10,h:10, types:[f, a, e, w], nextElement:f, cd:10},
    {x:40,y:560,w:10,h:10, types:[f, a, e, w], nextElement:f, cd:10},
    {x:760,y:560,w:10,h:10, types:[f, a, e, w], nextElement:f, cd:10}
  ],
  pickups : [
    // {x:20, y:40, w:10, h:10, type:w},
    // {x:40, y:height-30, w:10, h:10, type:f},
    // {x:440, y:335, w:10, h:10, type:e},
    // {x:620, y:140, w:10, h:10, type:a}
    {x:760, y:300, w:10, h:10, type:s}
  ],
  finish : [

  ],
  player : {x:40, y:280, h:59, w:37, cd:0, lastDirection:'RIGHT', stamina:100, type:null, canShoot:true, canSprint:true}
}; 

var walls, spawns, pickups, finish;

var elements = [];
var colors = {fire:['#FA6900', 'canSprint'], water:['#046D8B', 'canShoot'], earth:['#784800', 'canSprint'], air:['ghostwhite', 'canSprint'], spirit:['black', 'canSprint']};
var enemies = [];
var projectiles = [];


// --- Main loop ---

function animate(timestamp){
  var moving = false;

  if(keys['SHIFT'] && player.stamina > 0 && player.canSprint){
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
      spawns[i].cd = spawnCD;
      var nextElement = spawns[i].nextElement; 
      spawns[i].nextElement = spawns[i].types[Math.floor(Math.random()*4)];
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
  c.save();
  c.clearRect(0,0,800,600);

  // Draw things
  drawWalls();
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
  if(keys['SPACE'] && player.cd <= 0 && player.type && player.canShoot){
    // Shoot
    drawPlant('Shoot');
    shoot();
  }else if(player.cd > 15){
    // Just shot
    drawPlant('Shoot');
  }else{
    // Animate Planty
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

  if(player.type === "spirit"){
    if(walls.length > 0){
      walls = outerWalls;
      projectileSpeed = 5;
      get('howto').innerHTML = '<h2>You found the 5th element! Now you get to spend eternity keeping the balance!<h2>';
    }
    shoot5();
  }

  if(player.cd > 0){
    player.cd --;
  }

  c.restore();

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

    index = collision(player, walls);
    if(index > -1 &&  (! elements[walls[index].type]) ){
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
    var index = collision(projectiles[i], walls);
    if(index > -1 && walls[index].type !== player.type){

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
    var index = collision(o, walls);

    if(index === -1 || o.type === walls[index].type){
      // Enemy can pass on the x plane
    }else{
      o.x -= (o.x < player.x) ? o.speed : -o.speed;
    }


    o.y += (o.y < player.y) ? o.speed : -o.speed;
    index = collision(o, walls);
    if(index === -1 || o.type === walls[index].type){
      // Enemy can pass on the y plane
    }else{
      o.y -= (o.y < player.y) ? o.speed : -o.speed;
    }
  }
}

function finished(){
  currLvl++;
  goLevel(currLvl);
}

function checkFinish(){
  if(collision(player,[finish]) > -1){
    finished();
  }
}

function shoot() {

  var p = {x:player.x, y:player.y, w:6, h:6, color:colors[player.type][0], tX:0, tY:0};

  p = modDirection(p);
  projectiles.push(p);
  player.cd = shootCD;
}

function shoot5() {
  var dir = ['RIGHT','LEFT','UP','DOWN'];
  for(i=0;i<dir.length;i++){
    var p = {x:player.x, y:player.y, w:6, h:6, color:'#'+(Math.random()*0xFFFFFF<<0).toString(16), tX:(Math.random()*10)-5, tY:(Math.random()*10)-5};
    p[dir[i]] = true;
    p = modDirection(p);
    projectiles.push(p);
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
  var index = collision(player, pickups);
  if(index > -1){
    gain(pickups[index].type);
    pickups.splice(index,1);
  }
}

function gain(item){

  // Picked up an element
  elements.push({type:item, color: colors[item][0]});
  elements[item] = true;
  if(elements.length === 1){
    player.type = item;
    player[colors[item][1]] = true;
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

  get('dead').style.top = '579px';
}

function again(){
  goLevel(currLvl);
}

function goLevel(level){
  var s = window.location.toString();
  window.location = s.split('?')[0] + '?autoStart=1&level=' + level;
}

// --- Drawing ---

function drawPickups() {
  for(i=0; i<pickups.length; i++){
    var o = pickups[i];
    rect(o.x, o.y, o.w, o.h, colors[o.type][0]);
  }
}

function drawWalls() {
  for(i=0; i<walls.length; i++){
    var o = walls[i];
    var c = 'black';
    if (o.type != null){
      c = colors[o.type][0];
    }
    rect(o.x, o.y, o.w, o.h, c);
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
    rect(o.x, o.y, o.w, o.h, colors[o.type][0], 'purple');
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
    c.strokeStyle = 'black';
    c.fillStyle = colors[spawns[i].nextElement][0];
    c.beginPath();
    c.arc(spawns[i].x, spawns[i].y, spawns[i].w, 0, Math.PI*2, true );
    c.stroke();
    c.fill();
  }
}

function drawFinish() {
  c.fillStyle = "gray";
  c.font = "20pt Helvetica";
  c.fillText("Exit", finish.x+55, finish.y+45);
}

function rect(x,y,w,h, color, lineColor) {

  c.strokeStyle = lineColor || 'black';
  c.fillStyle = color;
  c.beginPath();
  c.rect(x, y, w, h);
  c.stroke();
  c.fill();
}

function drawPlant(state) {
  var x = player.x;
  var y = player.y;

  if(keys['LEFT'] || player.lastDirection === 'LEFT'){
    flipImage(root['planty' + state], x, y);
  }else{
    c.drawImage(root['planty' + state],x,y);
  }
  
  for(i=0; i<elements.length; i++){
    var e = elements[i];
    var w = (player.type === e.type) ? 6 : 5;
    rect(x + (i*5), y, w, w, e.color);
  }

  // Stam bar
  if (player.canSprint) {
    rect(x,y+player.h, player.w * (player.stamina/100), 3, 'yellow');
  }
}

function flipImage(image, x, y) {

  x = (image.width * -1) + 0-x;

  c.save();
  c.scale(-1, 1);
  c.drawImage(image, x, y, image.width, image.height);
  c.restore();
}

function showL1Instructions(){
  get('l1i').style.display = 'block';
  get('collect').style.top = '46px';
  get('avoid').style.top = '251px';
  get('go').style.top = '545px';
}

function hideL1Instructions(){
  get('l1i').display = 'none';
}

// Create level object from array
function wall(o){
  var a = [];
  for(i=0;i<o.length;i++){
    a.push({x:o[i][0], y:o[i][1], w:o[i][2], h:o[i][3], type:o[i][4]});
  }
  return a;
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
      if(elements[a]){
        player.type = elements[a].type;
      }
      break;
    case 97:
    case 98:
    case 99:
    case 100:
      var a = 3-(100-code);
      // Activate element
      if(elements[a]){
        player.type = elements[a].type;
      }
      break;
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
    
    get('game').classList.remove('disabled');
    get('btn').classList.add('hidden');

    var q = qs(location.search);
    currLvl = parseInt(q.level);

    if(currLvl === 1){
      showL1Instructions();
    }else{
      hideL1Instructions();
    }

    // Add the level's items
    var lvl = levels[currLvl];
    var innerWalls = wall(lvl.walls);
    walls = outerWalls.concat(innerWalls);
    spawns = lvl.spawns;
    pickups = lvl.pickups;
    finish = lvl.finish[0] || {};
    player = lvl.player;
    spawnCD = spawns[0].cd;

    stop = false;
    animateID = window.requestAnimationFrame(animate);
  }
}

function qs(qs) {
    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[tokens[1]] = tokens[2];
    }

    return params;
}