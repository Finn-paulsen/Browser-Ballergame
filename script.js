const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 50;
const playerHeight = 20;
const playerSpeed = 5;
const bulletSpeed = 7;
const alienSpeed = 2;
const alienWidth = 50;
const alienHeight = 20;
const alienRows = 3;
const alienCols = 5;

let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;
let bullets = [];
let aliens = [];
let keys = {};
let lives = 3;
let gameRunning = false;
let intervalId;

function initAliens() {
    aliens = [];
    for (let row = 0; row < alienRows; row++) {
        aliens[row] = [];
        for (let col = 0; col < alienCols; col++) {
            aliens[row][col] = {
                x: col * (alienWidth + 10) + 30,
                y: row * (alienHeight + 10) + 30,
                width: alienWidth,
                height: alienHeight
            };
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

function drawAliens() {
    ctx.fillStyle = 'green';
    aliens.forEach(row => {
        row.forEach(alien => {
            if (alien) {
                ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
            }
        });
    });
}

function drawLives() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Leben: ' + lives, 10, 20);
}

function movePlayer() {
    if (keys['a'] && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys['d'] && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bulletSpeed;
    });
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function moveAliens() {
    aliens.forEach(row => {
        row.forEach(alien => {
            if (alien) {
                alien.y += alienSpeed;
                if (alien.y > canvas.height) {
                    endGame();
                }
            }
        });
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((row, rowIndex) => {
            row.forEach((alien, colIndex) => {
                if (alien && bullet.x < alien.x + alien.width &&
                    bullet.x + 5 > alien.x &&
                    bullet.y < alien.y + alien.height &&
                    bullet.y + 10 > alien.y) {
                    aliens[rowIndex][colIndex] = null;
                    bullets.splice(bulletIndex, 1);
                }
            });
        });
    });
}

function endGame() {
    clearInterval(intervalId);
    document.getElementById('gameOverScreen').classList.remove('hidden');
    gameRunning = false;
}

function startGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.add('hidden');
    lives = 3;
    playerX = canvas.width / 2 - playerWidth / 2;
    playerY = canvas.height - playerHeight - 10;
    bullets = [];
    initAliens();
    gameRunning = true;
    intervalId = setInterval(gameLoop, 1000 / 60);
}

function retryGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    startGame();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveBullets();
    moveAliens();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawAliens();
    drawLives();
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        bullets.push({ x: playerX + playerWidth / 2 - 2.5, y: playerY });
    }
});

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('retryButton').addEventListener('click', retryGame);

startGame();
