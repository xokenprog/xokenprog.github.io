let canvas, ctx, gameInterval, timerInterval;
let timeLeft = 10;
let gameOver = false;

const gravity = 0.6;

const p1Image = new Image();
p1Image.src = 'p1.png'; 

const p2Image = new Image();
p2Image.src = 'p2.png'; 

// Fighter Class with Robust Image Rendering
class Fighter {
    constructor({ position, velocity, image, color, offset, isFacingLeft = false }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 32;          // Pixel width of character frame
        this.height = 40;         // Pixel height of character frame
        this.image = image;
        this.color = color;       // Fallback color if image fails or is loading
        this.health = 100;
        this.isGrounded = false;
        this.isAttacking = false;
        this.isFacingLeft = isFacingLeft;
        
        // Simple animation frame toggle
        this.animFrame = 0;
        this.animTimer = 0;

        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            offset: offset,
            width: 30,
            height: 20
        };
    }

    draw() {
        ctx.save();

        // Handle Horizontal Flipping depending on direction faced
        if (this.isFacingLeft) {
            ctx.translate(this.position.x + this.width, this.position.y);
            ctx.scale(-1, 1); // Flip horizontally
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        // Slight "bounce" animation while moving
        let yOffset = 0;
        if (Math.abs(this.velocity.x) > 0 && this.isGrounded) {
            this.animTimer++;
            if (this.animTimer % 8 === 0) {
                this.animFrame = (this.animFrame === 0) ? 1 : 0;
            }
            yOffset = this.animFrame * 2; // Pixel bounce when walking
        } else {
            yOffset = 0;
        }

        // Draw Image if completely loaded; otherwise draw fallback colored rectangle
        if (this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, 0, yOffset, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(0, yOffset, this.width, this.height);
        }

        ctx.restore();

        // Draw Attack Hitbox
        if (this.isAttacking) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update() {
        this.draw();

        // Keep Attack Box aligned with facing direction
        if (this.isFacingLeft) {
            this.attackBox.position.x = this.position.x - this.attackBox.width;
        } else {
            this.attackBox.position.x = this.position.x + this.width;
        }
        this.attackBox.position.y = this.position.y + 10;

        // Apply movement & gravity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Ground Collision (Floor Y = 160)
        if (this.position.y + this.height + this.velocity.y >= 160) {
            this.velocity.y = 0;
            this.position.y = 160 - this.height;
            this.isGrounded = true;
        } else {
            this.velocity.y += gravity;
            this.isGrounded = false;
        }

        // Screen Boundaries
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width;
    }

    attack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 150);
    }
}

// Players Setup
let player1, player2;
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
};

function startGame() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Smooth crisp pixel rendering for canvas images
    ctx.imageSmoothingEnabled = false;

    player1 = new Fighter({
        position: { x: 50, y: 100 },
        velocity: { x: 0, y: 0 },
        image: p1Image,
        color: '#7700ff', // P1 Fallback Color
        offset: { x: 30 },
        isFacingLeft: false
    });

    player2 = new Fighter({
        position: { x: 215, y: 100 },
        velocity: { x: 0, y: 0 },
        image: p2Image,
        color: '#ffee00', // P2 Fallback Color
        offset: { x: -30 },
        isFacingLeft: true
    });

    timeLeft = 60;
    gameOver = false;
    document.getElementById('gameTimer').innerText = timeLeft;
    document.getElementById('p1Health').style.width = '100%';
    document.getElementById('p2Health').style.width = '100%';

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    gameInterval = setInterval(gameLoop, 1000 / 60);
    timerInterval = setInterval(() => {
        if (timeLeft > 0 && !gameOver) {
            timeLeft--;
            document.getElementById('gameTimer').innerText = timeLeft;
        } else if (timeLeft === 0) {
            determineWinner();
        }
    }, 1000);
}

function stopGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);

    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('heroSection').style.display = 'flex';
}

function handleKeyDown(e) {
    if (gameOver) return;

    // Player 1 Keys
    if (e.key === 'a' || e.key === 'A') keys.a.pressed = true;
    if (e.key === 'd' || e.key === 'D') keys.d.pressed = true;
    if ((e.key === 'w' || e.key === 'W') && player1.isGrounded) player1.velocity.y = -10;
    if (e.code === 'Space') player1.attack();

    // Player 2 Keys
    if (e.key === 'ArrowLeft') keys.ArrowLeft.pressed = true;
    if (e.key === 'ArrowRight') keys.ArrowRight.pressed = true;
    if (e.key === 'ArrowUp' && player2.isGrounded) player2.velocity.y = -10;
    if (e.key === 'Enter') player2.attack();
}

function handleKeyUp(e) {
    if (e.key === 'a' || e.key === 'A') keys.a.pressed = false;
    if (e.key === 'd' || e.key === 'D') keys.d.pressed = false;
    if (e.key === 'ArrowLeft') keys.ArrowLeft.pressed = false;
    if (e.key === 'ArrowRight') keys.ArrowRight.pressed = false;
}

function checkCollision(attacker, defender) {
    return (
        attacker.attackBox.position.x < defender.position.x + defender.width &&
        attacker.attackBox.position.x + attacker.attackBox.width > defender.position.x &&
        attacker.attackBox.position.y < defender.position.y + defender.height &&
        attacker.attackBox.position.y + attacker.attackBox.height > defender.position.y
    );
}

function gameLoop() {
    // Clear Stage
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stage Floor
    ctx.fillStyle = '#262936';
    ctx.fillRect(0, 160, canvas.width, 40);

    // Player 1 Movement & Direction Logic
    player1.velocity.x = 0;
    if (keys.a.pressed) {
        player1.velocity.x = -3;
        player1.isFacingLeft = true;
    }
    if (keys.d.pressed) {
        player1.velocity.x = 3;
        player1.isFacingLeft = false;
    }

    // Player 2 Movement & Direction Logic
    player2.velocity.x = 0;
    if (keys.ArrowLeft.pressed) {
        player2.velocity.x = -3;
        player2.isFacingLeft = true;
    }
    if (keys.ArrowRight.pressed) {
        player2.velocity.x = 3;
        player2.isFacingLeft = false;
    }

    player1.update();
    player2.update();

    // Combat Hit Check
    if (player1.isAttacking && checkCollision(player1, player2)) {
        player1.isAttacking = false;
        player2.health -= 15;
        if (player2.health < 0) player2.health = 0;
        document.getElementById('p2Health').style.width = player2.health + '%';
    }

    if (player2.isAttacking && checkCollision(player2, player1)) {
        player2.isAttacking = false;
        player1.health -= 15;
        if (player1.health < 0) player1.health = 0;
        document.getElementById('p1Health').style.width = player1.health + '%';
    }

    if (player1.health <= 0 || player2.health <= 0) {
        determineWinner();
    }
}

function determineWinner() {
    gameOver = true;
    clearInterval(timerInterval);

    let winnerText = "DRAW!";
    if (player1.health > player2.health) winnerText = "PLAYER 1 WINS!";
    else if (player2.health > player1.health) winnerText = "PLAYER 2 WINS!";

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffcc00';
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(winnerText, canvas.width / 2, canvas.height / 2);
}
