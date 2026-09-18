// ====== ЗАДАНИЯ ======
const TASKS = [
    { text: "-0.6 + 2",             answer: 1.4 },
    { text: "-7.3 + 8.2",           answer: 0.9 },
    { text: "1.5 - 2.9",            answer: -1.4 },
    { text: "2.17 + (-4.39)",       answer: -2.22 },
    { text: "-6.19 - 2.51",         answer: -8.7 },
    { text: "-0.803 - (-1.6)",      answer: 0.797 },

    { text: "3.7 + 4.5",            answer: 8.2 },
    { text: "-5.2 + 3.8",           answer: -1.4 },
    { text: "6.04 - 2.7",           answer: 3.34 },
    { text: "-1.25 + (-3.75)",      answer: -5 },
    { text: "0.9 - (-2.1)",         answer: 3 },
    { text: "-4.6 + 4.6",           answer: 0 },
    { text: "7.8 - 9.3",            answer: -1.5 },
    { text: "-2.05 + 6.4",          answer: 4.35 },
    { text: "5.5 + (-1.25)",        answer: 4.25 },
    { text: "-3.14 - 2.86",         answer: -6 },
    { text: "8.02 - 3.7",           answer: 4.32 },
    { text: "-0.5 + 1.75",          answer: 1.25 },
    { text: "9.6 - 12.4",           answer: -2.8 },
    { text: "-7.07 + 3.07",         answer: -4 },

    { text: "4 - 6.5",              answer: -2.5 },
    { text: "-8 + 3.25",            answer: -4.75 },
    { text: "10.5 - 15",            answer: -4.5 },
    { text: "-3.6 + 9",             answer: 5.4 },
    { text: "2.4 + (-7)",           answer: -4.6 },
    { text: "-12 + 5.8",            answer: -6.2 },

    { text: "0.5 × 6",              answer: 3 },
    { text: "-2.4 × 2",             answer: -4.8 },
    { text: "1.2 × 5",              answer: 6 },
    { text: "-0.3 × (-4)",          answer: 1.2 },
    { text: "7.2 ÷ 2",              answer: 3.6 },
    { text: "-9.6 ÷ 3",             answer: -3.2 },
    { text: "4.5 ÷ 0.5",            answer: 9 },

    { text: "-1.1 - 2.2",           answer: -3.3 },
    { text: "3.33 + 6.67",          answer: 10 },
    { text: "-5.5 + 2.25",          answer: -3.25 },
    { text: "0.125 + 0.875",        answer: 1 },
    { text: "-2.75 - (-0.25)",      answer: -2.5 },
    { text: "11.1 - 4.4",           answer: 6.7 },
    { text: "-0.9 + (-0.1)",        answer: -1 },
];

const GAME_DURATION = 180; // 3 минуты в секундах

// ====== ЭЛЕМЕНТЫ ======
const startScreen  = document.getElementById('start-screen');
const gameScreen   = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn   = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const timerEl    = document.getElementById('timer');
const taskText   = document.getElementById('task-text');
const taskCard   = document.getElementById('task-card');
const answerInput= document.getElementById('answer-input');
const submitBtn  = document.getElementById('submit-btn');
const progressEl = document.getElementById('progress');

const correctCountEl = document.getElementById('correct-count');
const totalCountEl   = document.getElementById('total-count');
const timeTakenEl    = document.getElementById('time-taken');
const resultEmoji    = document.getElementById('result-emoji');

// ====== СОСТОЯНИЕ ======
let currentIndex = 0;
let correctCount = 0;
let timeLeft = GAME_DURATION;
let timerId = null;
let lockInput = false;

// ====== ПЕРЕМЕШИВАНИЕ ======
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let shuffledTasks = [];

// ====== УПРАВЛЕНИЕ ЭКРАНАМИ ======
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// ====== СТАРТ ИГРЫ ======
function startGame() {
    shuffledTasks = shuffle(TASKS);
    currentIndex = 0;
    correctCount = 0;
    timeLeft = GAME_DURATION;

    updateTimerDisplay();
    showTask();
    showScreen(gameScreen);
    answerInput.value = '';
    answerInput.focus();

    clearInterval(timerId);
    timerId = setInterval(tick, 1000);
}

// ====== ТИК ТАЙМЕРА ======
function tick() {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 30) {
        timerEl.classList.add('warning');
    }
    if (timeLeft <= 0) {
        endGame(false);
    }
}

function updateTimerDisplay() {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}

// ====== ПОКАЗ ЗАДАНИЯ ======
function showTask() {
    if (currentIndex >= shuffledTasks.length) {
        endGame(true);
        return;
    }
    taskText.textContent = shuffledTasks[currentIndex].text;
    progressEl.textContent = `Задание ${currentIndex + 1} из ${shuffledTasks.length}`;
    answerInput.value = '';
}

// ====== ПРОВЕРКА ОТВЕТА ======
function checkAnswer() {
    if (lockInput) return;
    const raw = answerInput.value.trim().replace(',', '.');
    if (raw === '') return;

    const userAnswer = parseFloat(raw);
    if (isNaN(userAnswer)) return;

    const correct = shuffledTasks[currentIndex].answer;
    const isCorrect = Math.abs(userAnswer - correct) < 1e-6;

    if (isCorrect) {
        correctCount++;
        taskCard.classList.add('correct');
        lockInput = true;
        setTimeout(() => {
            taskCard.classList.remove('correct');
            lockInput = false;
            currentIndex++;
            showTask();
            answerInput.focus();
        }, 250);
    } else {
        taskCard.classList.add('wrong');
        answerInput.value = '';
        setTimeout(() => taskCard.classList.remove('wrong'), 400);
    }
}

// ====== КОНЕЦ ИГРЫ ======
function endGame(allDone) {
    clearInterval(timerId);

    const timeSpent = GAME_DURATION - timeLeft;

    correctCountEl.textContent = correctCount;
    totalCountEl.textContent = shuffledTasks.length;
    timeTakenEl.textContent = timeSpent;

    if (correctCount === shuffledTasks.length) {
        resultEmoji.textContent = '🏆';
    } else if (correctCount >= shuffledTasks.length * 0.7) {
        resultEmoji.textContent = '🎉';
    } else if (correctCount >= shuffledTasks.length * 0.4) {
        resultEmoji.textContent = '👍';
    } else {
        resultEmoji.textContent = '💪';
    }

    timerEl.classList.remove('warning');
    showScreen(resultScreen);
}

// ====== СОБЫТИЯ ======
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
});

submitBtn.addEventListener('click', checkAnswer);
