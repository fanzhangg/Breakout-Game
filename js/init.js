
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Variables defining the ball
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballColor = "red";

//Variables defining the paddle to hit the ball
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth)/2;
var paddleSpeed = 1;

//Variables defining the pressed buttons
var rightPressed = false;
var leftPressed = false;

//Variables defining the bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 1;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;
var pause = false;

//Hold all bricks in a two-dimensional array. c: brick columns, r: brick rows; { x: 0, y: 0}: an object containing the x and y position and status property to indicate whether we want to paint each brick on the screen or not
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
	bricks[c] = [];
	for(var r=0; r<brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}


// Event listeners to listen for key presses

// keyDownHandler() function will be executed when any of the keys on your keyboard are pressed
document.addEventListener("keydown", keyDownHandler, false);

// keyUpHandler() function will be executed when the key stop being pressed
document.addEventListener("keyup", keyUpHandler, false);

// The variable rightPressed is set to be true if the right cursor key is pressed. The variable leftPressed is set to be true if the left cursor key is pressed.
function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

// When the key is released, the variable is set back to false
function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth/2;
	}
}

document.addEventListener("click", clickHandler, false);

function clickHandler(e) {
	pause = !pause;
	console.log(pause);
}

// A function to detect whether the ball collides a brick
function collisionDetection() {
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if(b.status === 1) {
				if((b.y + brickHeight == y - ballRadius || y + ballRadius == b.y) && b.x < x && b.x + brickWidth >= x) {
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount*brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}

					if((x-ballRadius == b.x + brickWidth || x+ballRadius == b.x) && y > b.y && y <= b.y + brickHeight) {
						dx = -dx;
						b.status = 0;
						score++;
						if(score == brickRowCount*brickColumnCount) {
							aler("You WIN, CONGRATULATIONS!");
							document.location.reload();
						}
					}


				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle ="#0095DD";
	ctx.fillText("Score: " +score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


function changeBallColor() {
	var choice = Math.floor(Math.random() * 5);

	switch (choice) {
		case 0:
			ballColor = "black";
		case 1:
			ballColor = "red";
			break;
		case 2:
			ballColor = "blue";
			break;
		case 3:
			ballColor = "yellow";
			break;
		case 4:
			ballColor = "green";
			break;
		case 5:
			ballColor = "orange";
			break;
		default:
			ballColor = "red"
	}
}


function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

//A function to loop through all the bricks in the array and draw them on the screen
function drawBricks() {
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function resetGame() {
	x = canvas.width/2;
	y = canvas.height - 30;
	dx = 2;
	dy = -2;
	paddleX = (canvas.width - paddleWidth)/2;
}

function hitPaddle() {
	if (y + dy > canvas.height - ballRadius - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
		dy = -dy;
	}
}

function hitBottom() {
	if (y + dy > canvas.height + ballRadius) {
		lives--;
		if (lives == 0) {
			alert("GAME OVER");
			document.location.reload();
		}
		else {
			resetGame();
		}
	}
}

function hitTop() {
	if (y + dy < ballRadius) {
		dy = -dy;
	}
}

function hitLeftorRight() {
	if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
		dx = -dx;
	}
}

function moveBall() {
	x += dx;
	y += dy;
}

function movePaddle() {
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += paddleSpeed;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= paddleSpeed;
	}
}


function draw() {
	if (!pause) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall();
		drawPaddle();
		drawLives();
		drawScore();
		collisionDetection();

		hitPaddle();
		hitBottom();
		hitTop();
		hitLeftorRight();

		moveBall();
	}


	requestAnimationFrame(draw);
}



draw();


