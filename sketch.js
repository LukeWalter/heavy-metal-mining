var canvasWidth = 960;//window.innerWidth;
var canvasHeight = 640;//window.innerHeight - 0.1;

// var player = 0;
// var playerX = canvasWidth / 2;
// var playerY = canvasHeight / 5;
// var sprWidth = canvasWidth / 3;
// var sprHeight = sprWidth / 4;

// var playerMaxX = window.innerWidth;

// var brickRows = [];

// function makeBrickRow() {
  
//   var rowY = canvasHeight * 0.95;
//   var rowLength = 5;
//   brickWidth = 160;
//   brickHeight = 80;

//   var bricks = [];

//   for (let x = 0; x < rowLength; x++) {
//     var offset = (x - Math.trunc((rowLength / 2))) * brickWidth;
//     var i = bricks.length - 1;
//     bricks[bricks.length - 1] = createSprite(canvasWidth / 2 + offset, rowY, brickWidth, brickHeight);
//     bricks[bricks.length - 1].addImage("brick", indB);
//     bricks.length++;

//   } // for

//   return bricks;

// } // makeBrickRow

// var shoot_btn_held = false;
// function getInput() {
  
//   if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
//     playerRight();
    
//   } // if
  
//   if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
//     playerLeft();
  
//   } // if

//   if (keyIsDown(32)) {
//     if (!shoot_btn_held) playerShoot();
//     shoot_btn_held = true;
  
//   } else {
//     shoot_btn_held = false;

//   } // if

// } // getInput

// var speed = 10;

// function playerRight() {
  
//   if (player.position.x < (5 * canvasWidth / 7)) {
//     player.position.x += speed;
  
//   } // if

// } // playerRight

// function playerLeft() {
  
//   if (player.position.x > (2 * canvasWidth / 7)) {
//     player.position.x -= speed;
  
//   } // if

// } // playerLeft

// var shooting = false;
// var projSpeed = 18;
// var ammo = 20;
// function playerShoot() {
  
//   if (ammo > 0) {

//     var projectile = createSprite(player.position.x, player.position.y);
//     projectile.addImage(shot);
//     projectile.setSpeed(projSpeed, 90);
//     projectile.setCollider("rectangle", 0, 0, 40, 40);

//     ammo--;

//   } // ifa 

// } // playerShoot

// function preload() {
//   v1 = loadImage("images/vehicle1.png");
//   v2 = loadImage("images/vehicle2.png");
//   bgImg = loadImage("images/placeholder.png");
//   indB = loadImage("images/indestructible_brick.png");
//   shot = loadImage("images/shot.png");

// } // preload

// function setup() {
//   createCanvas(canvasWidth, canvasHeight);
//   brickRows[brickRows.length++ - 1] = makeBrickRow();
//   player = createSprite(playerX, playerY, sprWidth, sprHeight);
//   player.addAnimation("idle", v1, v2);

// } // setup

// function draw() {
//   background(bgImg);
//   getInput();
//   drawSprites();

// } // draw

//breakout close (core mechanics)
//mouse to control the player, click to start

var player, wallTop, wallBottom, wallLeft, wallRight;
var bricks;
var MAX_SPEED = 9;
var WALL_THICKNESS = canvasWidth / 7;
var BRICK_W = 80;
var BRICK_H = 40;
var BRICK_MARGIN = 4;
var ROWS = 9;
var COLUMNS = 16;
var projectiles = [];

function preload() {
  v1 = loadImage("images/vehicle1.png");
  v2 = loadImage("images/vehicle2.png");
  bgImg = loadImage("images/background.png");
  indB = loadImage("images/indestructible_brick.png");
  shot = loadImage("images/shot.png");
  wall_l = loadImage("images/wall.png");
  wall_r = loadImage("images/wall.png");

} // preload

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  player = createSprite(canvasWidth/2, 70, 100, 10);
  player.addAnimation("idle", v1, v2);
  player.immovable = true;

  wallTop = createSprite(canvasWidth/2, -WALL_THICKNESS/2, canvasWidth+WALL_THICKNESS*2, WALL_THICKNESS);
  wallTop.immovable = true;

  wallBottom = createSprite(canvasWidth/2, canvasHeight+WALL_THICKNESS/2, canvasWidth+WALL_THICKNESS*2, WALL_THICKNESS);
  wallBottom.immovable = true;

  wallLeft = createSprite(canvasWidth /  14, canvasHeight/2, WALL_THICKNESS, canvasHeight);
  wallLeft.immovable = true;
  //wallLeft.addImage(wall_l);

  wallRight = createSprite(13 * canvasWidth / 14, canvasHeight/2, WALL_THICKNESS, canvasHeight);
  wallRight.immovable = true;
  //wallRight.addImage(wall_r);

  bricks = new Group();

  var offsetX = 0;
  var offsetY = 0;

  makeBrickRow ();

} // setup

function draw() {
  
  background(bgImg);

  getInput();
  
  for (let i = 0; i < projectiles.length; i++) {
    
    var p = projectiles[i];
    p.bounce(wallTop);
    p.bounce(wallBottom);
    p.bounce(wallLeft);
    p.bounce(wallRight);

    if(p.bounce(player))
  {
    var swing = (p.position.x-player.position.x)/3;
    p.setSpeed(MAX_SPEED, p.getDirection()+swing);
  }

  p.bounce(bricks, brickHit);
  
  } // for

  drawSprites();

} // draw

function makeBrickRow() {
  
  var rowY = canvasHeight * 0.95;
  var rowLength = 7;
  brickWidth = 80;
  brickHeight = 40;

  bricks = new Group();

  for(var r = 0; r < rowLength; r++) {
  
    var offset = (r - Math.trunc((rowLength / 2))) * BRICK_W;
    var brick = createSprite(canvasWidth / 2 + offset, rowY, BRICK_W, BRICK_H);
    brick.addImage("brick", indB);
    bricks.add(brick);
    brick.immovable = true;
  
  } // for

  

} // makeBrickRow

var shoot_btn_held = false;
function getInput() {
  
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    playerRight();
    
  } // if
  
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    playerLeft();
  
  } // if

  if (keyIsDown(32)) {
    if (!shoot_btn_held) playerShoot();
    shoot_btn_held = true;
  
  } else {
    shoot_btn_held = false;

  } // if

} // getInput

var speed = 10;

function playerRight() {
  
  if (player.position.x < (5 * canvasWidth / 7)) {
    player.position.x += speed;
  
  } // if

} // playerRight

function playerLeft() {
  
  if (player.position.x > (2 * canvasWidth / 7)) {
    player.position.x -= speed;
  
  } // if

} // playerLeft

var shooting = false;
var projSpeed = 18;
var ammo = 20;
function playerShoot() {
  
  if (ammo > 0) {

    var projectile = createSprite(player.position.x, player.position.y);
    projectile.addImage(shot);
    projectile.setSpeed(projSpeed, 90);
    projectile.setCollider("rectangle", 0, 0, 40, 40);
    projectiles.push(projectile );

    ammo--;

  } // ifa 

} // playerShoot

function brickHit(ball, brick) {
  brick.remove();
}

