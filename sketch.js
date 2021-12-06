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

var player, wallTop, wallBottom, wallLeft, wallRight, life1, life2, life3;
var bricks;
var MAX_SPEED = 9;
var WALL_THICKNESS = canvasWidth / 7;
var BRICK_W = 80;
var BRICK_H = 40;
var BRICK_MARGIN = 4;
var BRICK_SPEED = 0.0;
var ROWS = 9;
var COLUMNS = 16;
var health = 3;
var score = 0;

var projectiles = [];
var normal_bricks;

function preload() {
  
  v1 = loadImage("images/vehicle1.png");
  v2 = loadImage("images/vehicle2.png");
  bgImg = loadImage("images/background.png");
  shot = loadImage("images/shot.png");
  wall_l = loadImage("images/side_wall.JPG");
  wall_r = loadImage("images/side_wall.JPG");
  life = loadImage("images/life.png");

  red = loadImage("images/red_brick.png");
  blue = loadImage("images/blue_brick.png");
  green = loadImage("images/green_brick.png");
  yellow = loadImage("images/yellow_brick.png");

  normal_bricks = [red, blue, green, yellow];

  purple = loadImage("images/tough_brick1.png");
  tough = loadImage("images/tough_brick2.png");
  
  st5 = loadImage("images/steel_brick5.png");
  st4 = loadImage("images/steel_brick4.png");
  st3 = loadImage("images/steel_brick3.png");
  st2 = loadImage("images/steel_brick2.png");
  st1 = loadImage("images/steel_brick1.png");

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

  barrier = createSprite(canvasWidth / 2, canvasHeight * 0.7, canvasWidth, 10);
  barrier.immovable = true;
  barrier.visible = false;

  life1 = createSprite(68, 50, 45, 25);
  life1.addImage("life1", life);
  life1.immovable = true;
  
  life2 = createSprite(68, 100, 45, 25);
  life2.addImage("life1", life);
  life2.immovable = true;
  
  life3 = createSprite(68, 150, 45, 25);
  life3.addImage("life1", life);
  life3.immovable = true;

  bricks = new Group();

  var offsetX = 0;
  var offsetY = 0;

  bricks = new Group();
  startLevel();

} // setup

function draw() {
  
  if (bricks.length == 0) {
    
    for (let i = 0; i < projectiles.length; i++) {
      var p = projectiles[i];
      p.remove();

    } // for

    startLevel();

  } // if
  background(bgImg);

  getInput();
  barrier.collide(bricks, () => { BRICK_SPEED = 0.0; });
  
  for (let i = 0; i < projectiles.length; i++) {
    
    var p = projectiles[i];
    p.collide(wallTop, () => {
      
      p.remove();
      ammo++;
      
      switch (health) {
        case 3:
          life3.remove();health--;
          break;
        case 2:
          life2.remove();health--;
          break;
        case 1:
          life1.remove();health--;
          noLoop();
          alert("Game Over!\nScore = " + score);
          break;
        default:
          break;

      } // switch

    });

    p.bounce(wallBottom);
    p.bounce(wallLeft);
    p.bounce(wallRight);

    for (let j = 0; j < projectiles.length; j++) {
      var p2 = projectiles[j];
      p.bounce(p2);
    
    } // for

    if(p.bounce(player)) {console.log("colliding");
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

} // draw

function startLevel() {
  
  barrier.position.y = canvasHeight * (0.5);

  makeBrickRow(1.02);
  makeBrickRow(1.09);
  makeBrickRow(1.16);
  makeBrickRow(1.23);
  makeBrickRow(1.30);

  BRICK_SPEED = 1.5; 

} // level

var difficulty_factor = 10;
function makeBrickRow(location_factor) {
  
  var rowY = canvasHeight * location_factor;
  var rowLength = 7;

  for(var r = 0; r < rowLength; r++) {
  
    var offset = (r - Math.trunc((rowLength / 2))) * (BRICK_W + 2 * BRICK_MARGIN);
    var brick = createSprite(canvasWidth / 2 + offset, rowY, BRICK_W, BRICK_H);
    brick.immovable = true;

    var type = Math.trunc(Math.random() * difficulty_factor);

    switch (type) {
      
      case 0:
      case 1:
      case 2:
        brick.remove();
        break;
      
      case 3:
      case 4:
      case 5:
      case 6:
        var variant = Math.trunc(Math.random() * 4);
        brick.addAnimation("1", normal_bricks[variant ]);
        brick.changeAnimation("1");
        bricks.add(brick);
        break;
      
      case 7:  
      case 8:
      case 11:
      case 13:
      case 15:  
        brick.addAnimation("2", tough);
        brick.addAnimation("1", purple);
        brick.changeAnimation("2");
        bricks.add(brick);
        break;
      
      case 9: 
      case 10:
      case 12:
      case 14:
        brick.addAnimation("5", st5);
        brick.addAnimation("4", st4);
        brick.addAnimation("3", st3);
        brick.addAnimation("2", st2);
        brick.addAnimation("1", st1);
        brick.changeAnimation("5");
        bricks.add(brick);
        break;
      
      default:
        brick.remove();
        break;

    } // switch
  
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
    score += 100;
     
  } // if
  
} // brickHit

