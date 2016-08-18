var WebAudioDemo = {};
// Gain node needs to be mutated 
WebAudioDemo.gainNode = null;
// Define audio context
var context = new (window.AudioContext || window.webkitAudioContext)(); 
// Webkit/blink browsers need prefix, Safari won't work without window.

WebAudioDemo.createAudio=function () {
	if (!context.createGain)
			 context.createGain = context.createGainNode;
  	this.gainNode = context.createGain();
	// Create gain node
	this.gainNode = context.createGain();
	// Connect gain node to context (output)
	this.gainNode.connect(context.destination);
	// Add handler for play button
	play(context, this.gainNode,'seq');

}
//Creating Another one for single Note
WebAudioDemo.oneNote=function (freq) {
	if (!context.createGain)
		context.createGain = context.createGainNode;
  	this.gainNode = context.createGain();
	// Create gain node
	 this.gainNode = context.createGain();
	// Connect gain node to context (output)
	this.gainNode.connect(context.destination);
	// Add handler for play button
	play(context, this.gainNode,freq);

}

WebAudioDemo.changeVolume = function(element) {
			var volume = element.value;
			var fraction = parseInt(element.value) / parseInt(element.max);
			// Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
			 this.gainNode.gain.value = fraction * fraction;
		}
function play(context, node,type) {
			// Get current time in seconds
			var startTime = context.currentTime;
			// Set duration in seconds 
			var duration = 0.7;
			// Time between each note in seconds
			var speed = 0.35;
		if(type==="seq"){
			// Sequence of frequencies
			var sequence = [ 261.6, 293.7, 329.6, 349.2, 392, 440, 493.9,523.2, 523.2, 493.9, 440, 392, 349.2, 329.6, 293.7, 261.6];

			for (var i = 0; i < sequence.length; i++) {

				playNote(context, node, sequence[i], startTime, duration);
				startTime += speed;
			}
		}
		else{
			playNote(context, node, type, startTime, duration);
		}

		}

function playNote(context, node, freq, startTime, duration) {

			// Get sample rate
			var rate = context.sampleRate;

			// Compute buffer length
			var length = rate * duration;

			// Create buffer
			var buffer = context.createBuffer(1, length, rate);

			// Grab channel for inserting samples
			var data = buffer.getChannelData(0);

			// Get wave period
			var period = Math.floor(rate / freq);

			// Generate white noise (random excitation)
			for (var i = 0; i < period; i++) {
				data[i] = Math.random() * 2 - 1;
			}

			// Decay of feedback loop
			var decay = 0.993;

			// Length of buffer beyond initial excitation
			var len = data.length - period;

			// Feedback loop
			for (var i = 0; i < len; i++) {
				data[i + period] = (data[i] + data[i + 1]) * decay * 0.5;
			}

			// Create audio source
			var source = context.createBufferSource();
			// Set buffer to our created one (N.B: You can use some preset ones too)
			source.buffer = buffer;
			// Connect to gain node
			source.connect(node);
			// Play audio source at startTime
			source.start(startTime);

}
        
 /* 
  * Breakout Game Script (Modified by Koustav Ray to add sound on collision)
  *
  * Original game by: Andrzej Mazur
  * https://jsfiddle.net/end3r/9temh0ta/
  * 
  * Tutorial for game: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
  *
  */
var canvas = document.getElementById("myCanvas");
var canvasContainer=document.getElementById("game");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var lossText="<h3 class='text-center'><span class='label label-danger'>GAME OVER!</span></h3></br></br><button class='btn btn-lg btn-danger' onclick=' document.location.reload()'><i class='glyphicon glyphicon-repeat'> </i> Retry ...</button>";
var winText="<h3 class='text-center'><span class='label label-success'>YOU WIN, CONGRATS!</span></h3></br></br><button class='btn btn-lg btn-primary' onclick=' document.location.reload()'><i class='glyphicon glyphicon-repeat'></i> Play Again!</button>";

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() {
			
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    WebAudioDemo.oneNote(1500);
                    if(lives>1 && score == brickRowCount*brickColumnCount) {
                        canvasContainer.innerHTML=winText;
                       
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "rgb(255, 0, 75)";
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
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
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
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives && score != brickRowCount*brickColumnCount) {
                canvasContainer.innerHTML=lossText;
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
