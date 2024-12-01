// Get references to the canvas and score container
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreContainer = document.getElementById('score-container');

// Set up initial game variables
let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 }
]; // Initial snake coordinates

let direction = 'RIGHT';
let food = { x: 300, y: 300 };
let score = 0;
let gameOver = false;

// Set the game speed (in milliseconds)
const gameSpeed = 100;

// Set the size of each grid square
const gridSize = 10;

// Handle keyboard input for snake movement
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
}

// Function to update the game
function updateGame() {
    if (gameOver) return;

    // Move the snake by adding a new head in the direction
    let newHead;
    if (direction === 'UP') {
        newHead = { x: snake[0].x, y: snake[0].y - gridSize };
    } else if (direction === 'DOWN') {
        newHead = { x: snake[0].x, y: snake[0].y + gridSize };
    } else if (direction === 'LEFT') {
        newHead = { x: snake[0].x - gridSize, y: snake[0].y };
    } else if (direction === 'RIGHT') {
        newHead = { x: snake[0].x + gridSize, y: snake[0].y };
    }

    // Check for collision with the walls or itself
    if (
        newHead.x < 0 || newHead.x >= canvas.width || 
        newHead.y < 0 || newHead.y >= canvas.height || 
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        gameOver = true;
        showGameOver();
        return;
    }

    // Add new head to the snake
    snake.unshift(newHead);

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        scoreContainer.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop(); // Remove last segment if no food eaten
    }

    // Redraw game elements
    drawGame();
}

// Function to draw the game (snake and food)
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lime'; // Head is green, body is lime
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to generate new food at a random position
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    food = { x, y };
}

// Function to show game over screen
function showGameOver() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'game-over-container';
    gameOverMessage.innerHTML = `
        <div id="game-over-message">Game Over!</div>
        <div id="you-win-message">You scored ${score} points!</div>
        <button id="reset-button">Try Again</button>
    `;
    document.body.appendChild(gameOverMessage);

    // Add event listener to reset the game when button is clicked
    document.getElementById('reset-button').addEventListener('click', resetGame);
}

// Function to reset the game
function resetGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 }
    ];
    direction = 'RIGHT';
    food = { x: 300, y: 300 };
    score = 0;
    scoreContainer.textContent = `Score: 0`;
    gameOver = false;

    // Remove game over message and restart the game
    document.getElementById('game-over-container').remove();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (gameOver) return;
    updateGame();
    setTimeout(gameLoop, gameSpeed);
}

// Initialize game
generateFood();
gameLoop();
