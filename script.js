const btnRules = document.getElementById('btn-rules');
const bntClose = document.getElementById('btn-close');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const scoreEl = document.getElementById('score');
const btnAgain = document.getElementById('btn-again');
const endGameScreen = document.querySelector('.endGame');

// Create the canvas 2D context
const ctx = canvas.getContext('2d');
ctx.font = "normal 20px 'Press Start 2P'";


let score = 0;
const bricksPerRow = 9;
const bricksPerColumn = 5;

// Create ball props
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 10,
    speed: 3,
    dx: 4,
    dy: -4
}

// Create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
}

// Create brick props
const brickInfo = {
    w: 70,
    h: 20,
    margin: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

// Create bricks
const bricks = [];
for(let i = 0; i < bricksPerRow; i++) {
    bricks[i] = [];
    for(let j = 0; j < bricksPerColumn; j++) {
        const x = i * (brickInfo.w + brickInfo.margin) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.margin) + brickInfo.offsetY;
        bricks[i][j] = {x, y, ...brickInfo};
    }
}

// Draw ball
function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#332c50';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#332c50';
    ctx.fill();
    ctx.closePath();
}

// Draw score
function drawScore() {
    // ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    scoreEl.innerText = `Score: ${score}`
}

// Draw brikcs
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#332c50' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall collision
    if(paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    // Wall collision
    if(ball.x + ball.size >= canvas.width || ball.x - ball.size <= 0) {
        ball.dx *= -1;
    }
    if(ball.y + ball.size >= canvas.height || ball.y - ball.size <= 0) {
        ball.dy *= -1;
    }

    // Paddle collision 
    if(ball.x - ball.size >= paddle.x && ball.x + ball.size <= paddle.x + paddle.w && ball.y + ball.size >= paddle.y) {
        ball.dy = -ball.speed;
        ball.dx = -ball.speed;
    } 

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible) {
                if(ball.x - ball.size >= brick.x && // left brick side check
                    ball.x + ball.size <= brick.x + brick.w && //right brick side check
                    ball.y + ball.size >= brick.y && // top brick side check
                    ball.y - ball.size <= brick.y + brick.h // bottom brick side check
                    ) {
                        ball.dy *= -1;
                        brick.visible = false;
                        increaseScore();
                    }
            }
        })
    })

    // Check when the ball touches the bottom
    if(ball.y + ball.size > canvas.height) {
        endGame();
    }
}

// Display end game screen
function endGame() {
    endGameScreen.classList.add('show');
    cancelAnimationFrame(gameFrame);
}

// Restart the game
function restartGame() {
    endGameScreen.classList.remove('show');
    showAllBricks();
    score = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.dy = 4;
    ball.dy = -4;
    update();
}

// Increase score and check remaining bricks
function increaseScore() {
    score++;
    if(score % (bricksPerRow * bricksPerColumn) === 0) {
        showAllBricks();
    }
}

// Populate again the bricks
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick  => {
            brick.visible = true;
        })
    })
}

// Draw everything
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawScore();
    drawBricks()
}

// Update the canvas
function update() {
    movePaddle();
    moveBall();

    // Draw everything
    draw();

    const gameFrame = requestAnimationFrame(update);
}

update();

// Keydown
function keyDown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
    
}

// Keyboard event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and event listener for open/close it
function displayRules() {
    rules.classList.toggle('show');
}

btnRules.addEventListener('click', displayRules);
bntClose.addEventListener('click', displayRules);
btnAgain.addEventListener('click', restartGame)