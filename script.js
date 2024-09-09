const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Charakter-Eigenschaften
const character = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5
};

// Tasteneingaben
const keys = {
    W: false,
    A: false,
    S: false,
    D: false
};

function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Hintergrund löschen
    ctx.fillStyle = 'red';
    ctx.fillRect(character.x, character.y, character.size, character.size);
}

function update() {
    if (keys.W) character.y -= character.speed;
    if (keys.S) character.y += character.speed;
    if (keys.A) character.x -= character.speed;
    if (keys.D) character.x += character.speed;
    
    drawCharacter();
}

function handleKeyDown(e) {
    if (e.code in keys) {
        keys[e.code] = true;
    }
}

function handleKeyUp(e) {
    if (e.code in keys) {
        keys[e.code] = false;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Game Loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
