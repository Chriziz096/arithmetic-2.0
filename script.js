let score = 0;
let timeLeft = 20;
let currentQuestion = {};
let timer;
let questionCount = 0;
const maxQuestions = 20; // 每次游戏的题目数量
let difficulty = 'easy';
let timeLimit = 20;

const startButton = document.getElementById('start-game');
const gameArea = document.getElementById('game-area');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const floatingSymbolsContainer = document.getElementById('floating-symbols');
const cheerSound = document.getElementById('cheerSound');
const booSound = document.getElementById('booSound');
const highScoresListEasy = document.getElementById('highscores-list-easy');
const highScoresListMedium = document.getElementById('highscores-list-medium');
const highScoresListHard = document.getElementById('highscores-list-hard');
const nameInputContainer = document.getElementById('name-input');
const finalScoreElement = document.getElementById('final-score');
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score');
const difficultySelect = document.getElementById('difficulty');
const timeLimitSelect = document.getElementById('time-limit');

let highScores = {
    easy: JSON.parse(localStorage.getItem('highScoresEasy')) || [],
    medium: JSON.parse(localStorage.getItem('highScoresMedium')) || [],
    hard: JSON.parse(localStorage.getItem('highScoresHard')) || []
};

difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
});

timeLimitSelect.addEventListener('change', () => {
    timeLimit = parseInt(timeLimitSelect.value);
});

function startGame() {
    resetGame();
    startButton.style.display = 'none';
    gameArea.classList.remove('hidden');
    generateQuestion();
    answerElement.focus();
}

function generateQuestion() {
    if (questionCount >= maxQuestions) {
        endGame();
        return;
    }

    const operators = ['+', '-', '*', '/'];
    let num1, num2, operator, answer;

    do {
        operator = operators[Math.floor(Math.random() * operators.length)];
        
        switch(operator) {
            case '+':
                if (difficulty === 'easy') {
                    num1 = Math.floor(Math.random() * 50) + 1;
                    num2 = Math.floor(Math.random() * 50) + 1;
                } else if (difficulty === 'medium') {
                    num1 = Math.floor(Math.random() * 900) + 100; // 3位數
                    num2 = Math.floor(Math.random() * 900) + 100; // 最多3位數
                } else {
                    num1 = Math.floor(Math.random() * 9000) + 1000; // 3-4位數
                    num2 = Math.floor(Math.random() * 9000) + 1000; // 3-4位數
                }
                answer = num1 + num2;
                break;
            case '-':
                if (difficulty === 'easy') {
                    num1 = Math.floor(Math.random() * 50) + 26;
                    num2 = Math.floor(Math.random() * 25) + 1;
                } else if (difficulty === 'medium') {
                    num1 = Math.floor(Math.random() * 900) + 100; // 3位數
                    num2 = Math.floor(Math.random() * 900) + 100; // 最多3位數
                } else {
                    num1 = Math.floor(Math.random() * 9000) + 1000; // 3-4位數
                    num2 = Math.floor(Math.random() * 9000) + 1000; // 3-4位數
                }
                answer = num1 - num2;
                break;
            case '*':
                if (difficulty === 'easy') {
                    num1 = Math.floor(Math.random() * 90) + 10; // 2位數
                    num2 = Math.floor(Math.random() * 9) + 1;   // 1位數
                } else if (difficulty === 'medium') {
                    num1 = Math.floor(Math.random() * 900) + 100; // 3位數
                    num2 = Math.floor(Math.random() * 90) + 10;   // 2位數
                } else {
                    num1 = Math.floor(Math.random() * 9000) + 1000; // 3-4位數
                    num2 = Math.floor(Math.random() * 900) + 100;   // 2-3位數
                }
                answer = num1 * num2;
                break;
            case '/':
                if (difficulty === 'easy') {
                    num2 = Math.floor(Math.random() * 9) + 1;   // 1位數
                    answer = Math.floor(Math.random() * 90) + 10; // 2位數
                } else if (difficulty === 'medium') {
                    num2 = Math.floor(Math.random() * 90) + 10;   // 2位數
                    answer = Math.floor(Math.random() * 900) + 100; // 3位數
                } else {
                    num2 = Math.floor(Math.random() * 900) + 100;   // 2-3位數
                    answer = Math.floor(Math.random() * 9000) + 1000; // 3-4位數
                }
                num1 = num2 * answer; // 確保num1是num2的整數倍
                break;
        }
    } while (answer < 0 || !Number.isInteger(answer));

    currentQuestion = { 
        question: `${num1} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${num2}`, 
        answer: answer 
    };
    questionElement.textContent = currentQuestion.question;
    questionCount++;
    
    clearInterval(timer);
    timeLeft = timeLimit;
    updateTimer();
}

function checkAnswer() {
    const userAnswer = parseInt(answerElement.value);
    if (userAnswer === currentQuestion.answer) {
        score += timeLimit === 20 ? 3 : timeLimit === 30 ? 2 : 1;
        scoreElement.textContent = score;
        cheerSound.play();
    } else {
        booSound.play();
    }
    answerElement.value = '';
    generateQuestion();
}

function updateTimer() {
    timerElement.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            generateQuestion();
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    questionCount = 0;
}

function endGame() {
    gameArea.classList.add('hidden');
    nameInputContainer.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

function saveScore() {
    const playerName = playerNameInput.value;
    if (playerName) {
        const newScore = { name: playerName, score: score };
        highScores[difficulty].push(newScore);
        highScores[difficulty].sort((a, b) => b.score - a.score);
        highScores[difficulty] = highScores[difficulty].slice(0, 10);
        localStorage.setItem(`highScores${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, JSON.stringify(highScores[difficulty]));
        displayHighScores();
        nameInputContainer.classList.add('hidden');
        startButton.style.display = 'block';
    }
}

function displayHighScores() {
    highScoresListEasy.innerHTML = highScores.easy.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
    highScoresListMedium.innerHTML = highScores.medium.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
    highScoresListHard.innerHTML = highScores.hard.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
}

startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
saveScoreButton.addEventListener('click', saveScore);
answerElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

document.addEventListener('DOMContentLoaded', displayHighScores);
