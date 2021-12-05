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
//     bricks[bricks.length - 1].addImage("brick", ind);
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
//   ind = loadImage("images/indestructible_brick.png");
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
var BRICK_SPEED = 0.0;
var ROWS = 9;
var COLUMNS = 16;
var projectiles = [];
var normal_bricks;

function preload() {
  v1 = loadImage("images/vehicle1.png");
  v2 = loadImage("images/vehicle2.png");
  bgImg = loadImage("images/background.png");
  shot = loadImage("images/shot.png");
  wall_l = loadImage("images/side_wall.JPG");
  wall_r = loadImage("images/side_wall.JPG");

  red = loadImage("images/red_brick.png");
  blue = loadImage("images/blue_brick.png");
  green = loadImage("images/green_brick.png");
  yellow = loadImage("images/yellow_brick.png");

  normal_bricks = [red, blue, green, yellow];

  purple = loadImage("images/tough_brick1.png");
  tough = loadImage("images/tough_brick2.png");
  ind = loadImage("images/indestructible_brick.png");

} // preload

function setup() {

  createCanvas(canvasWidth, canvasHeight);

  player = createSprite(canvasWidth/2, 70, 100, 10);
  player.addAnimation("moving", v1, v2);
  player.addAnimation("idle", v1);
  player.immovable = true;

  wallTop = createSprite(canvasWidth/2, -WALL_THICKNESS/2, canvasWidth+WALL_THICKNESS*2, WALL_THICKNESS);
  wallTop.immovable = true;

  wallBottom = createSprite(canvasWidth/2, canvasHeight+WALL_THICKNESS/2, canvasWidth+WALL_THICKNESS*2, WALL_THICKNESS);
  wallBottom.immovable = true;

  wallLeft = createSprite(canvasWidth /  14, canvasHeight/2, WALL_THICKNESS, canvasHeight);
  wallLeft.immovable = true;
  wallLeft.addImage(wall_l);

  wallRight = createSprite(13 * canvasWidth / 14, canvasHeight/2, WALL_THICKNESS, canvasHeight);
  wallRight.immovable = true;
  wallRight.addImage(wall_r);

  bricks = new Group();

  var offsetX = 0;
  var offsetY = 0;

  bricks = new Group();
  makeBrickRow(0.95);
  makeBrickRow(1.02);

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

    for (let j = 0; j < projectiles.length; j++) {
      var p2 = projectiles[j];
      p.bounce(p2);
    
    } // for

    if(p.bounce(player)) {
      var swing = (p.position.x-player.position.x)/3;
      p.setSpeed(MAX_SPEED, p.getDirection()+swing);
    
    } // if

    p.bounce(bricks, brickHit);
  
  } // for

  drawSprites();

  for (let i = 0; i < bricks.length; i++) {
    var b = bricks[i];
    b.position.y -= BRICK_SPEED;

  } // for

  if (bricks.length > 0) {
    
    if (bricks[bricks.length - 1].position.y <= canvasHeight * 0.95) {
      makeBrickRow(1.02);

    } else if (bricks[0].position.y <= canvasHeight * 0.1) {
      BRICK_SPEED = 0;

    } // if

  } // if

} // draw

function makeBrickRow(factor) {
  
  var rowY = canvasHeight * factor;
  var rowLength = 7;

  for(var r = 0; r < rowLength; r++) {
  
    var offset = (r - Math.trunc((rowLength / 2))) * (BRICK_W + 2 * BRICK_MARGIN);
    var brick = createSprite(canvasWidth / 2 + offset, rowY, BRICK_W, BRICK_H);
    brick.immovable = true;

    var type = Math.trunc(Math.random() * 4);

    switch (type) {
      
      case 0:
        brick.remove();
        break;
      
      case 1:

        var variant = Math.trunc(Math.random() * 4);
        brick.addAnimation("1", normal_bricks[variant ]);
        brick.changeAnimation("1");
        break;
      
      case 2:
        brick.addAnimation("2", tough);
        brick.addAnimation("1", purple);
        brick.changeAnimation("2");
        break;
      
      case 3: 
        brick.addAnimation("5", ind);
        brick.addAnimation("4", ind);
        brick.addAnimation("3", ind);
        brick.addAnimation("2", ind);
        brick.addAnimation("1", red);
        brick.changeAnimation("5");
        break;
      
      default:
        brick.remove();
        break;

    } // switch

    bricks.add(brick);
  
  } // for

  

} // makeBrickRow

var shoot_btn_held = false;
function getInput() {

  player.changeImage("idle");
  
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    playerRight();
    player.changeImage("moving");
    
  } // if
  
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    playerLeft();
    player.changeImage("moving");
  
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
var ammo = 3;
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
  
  var health = brick.getAnimationLabel();

  if (health - 1 > 0) {
    brick.changeAnimation(health - 1);

  } else {
    brick.remove();

  } // if
  
} // brickHit

