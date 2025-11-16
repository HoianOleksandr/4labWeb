const menu = document.getElementById('menu');
const gameArea = document.getElementById('gameArea');
const gameOver = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const difficultySelect = document.getElementById('difficulty');
const colorSelect = document.getElementById('color');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('finalScore');
const canvas = document.getElementById('canvas');

// Змінні гри
let score = 0;
let timeLeft = 0;
let currentTarget = null;
let gameInterval = null;
let difficulty = '';
let selectedColor = '';
const WIN_SCORE = 50;

// Музика
let gameMusic = null;

const difficultySettings = {
    easy: { time: 3 },
    medium: { time: 2 },
    hard: { time: 1 }
};

startBtn.addEventListener('click', function() {
    difficulty = difficultySelect.value;
    selectedColor = colorSelect.value;

    if (!difficulty || !selectedColor) {
        alert('Будь ласка, оберіть складність та колір!');
        return;
    }

    startGame();
});

restartBtn.addEventListener('click', function() {
    resetGame();
    menu.classList.remove('hidden');
    gameOver.classList.add('hidden');
});

function startGame() {
    menu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    score = 0;
    scoreDisplay.textContent = score;

    gameMusic = new Audio('the_witcher_3_wild_hunt_01 The Trail.mp3');
    gameMusic.loop = true;
    gameMusic.volume = 0.3;
    gameMusic.play().catch(e => console.log('Музика не запустилась:', e));

    createNewTarget();
}

function createNewTarget() {
    if (currentTarget) {
        currentTarget.remove();
    }

    const target = document.createElement('div');
    target.className = `target ${selectedColor}`;
    target.textContent = 'Тик';

    const canvasRect = canvas.getBoundingClientRect();
    const maxX = canvas.clientWidth - 40;
    const maxY = canvas.clientHeight - 40;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    target.style.left = randomX + 'px';
    target.style.top = randomY + 'px';

    canvas.appendChild(target);
    currentTarget = target;

    timeLeft = difficultySettings[difficulty].time;
    timerDisplay.textContent = timeLeft;

    if (gameInterval) {
        clearInterval(gameInterval);
    }

    gameInterval = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    target.addEventListener('click', function() {
        score += 1;
        scoreDisplay.textContent = score;

        if (score >= WIN_SCORE) {
            winGame();
        } else {
            createNewTarget();
        }
    });
}

function winGame() {
    clearInterval(gameInterval);

    if (gameMusic) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }

    gameArea.classList.add('hidden');
    gameOver.classList.remove('hidden');

    const gameOverTitle = document.querySelector('#gameOver h2');
    gameOverTitle.textContent = 'Молодець вояко!';
    gameOverTitle.style.color = '#4CAF50';
    finalScoreDisplay.textContent = score;

    if (currentTarget) {
        currentTarget.remove();
    }
}

function endGame() {
    clearInterval(gameInterval);

    if (gameMusic) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }

    gameArea.classList.add('hidden');
    gameOver.classList.remove('hidden');

    const gameOverTitle = document.querySelector('#gameOver h2');
    gameOverTitle.textContent = 'Game Over!';
    gameOverTitle.style.color = '#f44336';
    finalScoreDisplay.textContent = score;

    if (currentTarget) {
        currentTarget.remove();
    }
}

function resetGame() {
    score = 0;
    timeLeft = 0;

    if (gameInterval) {
        clearInterval(gameInterval);
    }

    if (currentTarget) {
        currentTarget.remove();
    }

    if (gameMusic) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
        gameMusic = null;
    }

    difficultySelect.value = '';
    colorSelect.value = '';
}