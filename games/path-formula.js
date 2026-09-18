// =========================================================
//  ИГРА "ФОРМУЛА ПУТИ" (4 класс)
//  Даны 2 величины — найти третью.
//  Все деления и умножения — на однозначное число (1–9).
//  Деление — без остатка.
// =========================================================

const GAME_DURATION = 300; // 5 минут

// ====== ЭЛЕМЕНТЫ ======
const startScreen   = document.getElementById('start-screen');
const gameScreen    = document.getElementById('game-screen');
const resultScreen  = document.getElementById('result-screen');

const startBtn    = document.getElementById('start-btn');
const restartBtn  = document.getElementById('restart-btn');
const timerEl     = document.getElementById('timer');
const taskText    = document.getElementById('task-text');
const taskHint    = document.getElementById('task-hint');
const taskCard    = document.getElementById('task-card');
const answerInput = document.getElementById('answer-input');
const submitBtn   = document.getElementById('submit-btn');
const progressEl  = document.getElementById('progress');

const correctCountEl = document.getElementById('correct-count');
const wrongCountEl   = document.getElementById('wrong-count');
const timeTakenEl    = document.getElementById('time-taken');
const resultEmoji    = document.getElementById('result-emoji');

// ====== СОСТОЯНИЕ ======
let timeLeft    = GAME_DURATION;
let timerId     = null;
let lockInput   = false;
let currentTask = null;
let correctCount = 0;
let wrongCount   = 0;

// ====== УТИЛИТЫ ======
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// =========================================================
//  ГЕНЕРАЦИЯ ЗАДАЧИ
// =========================================================
function generateTask() {
    const type = ['S', 'v', 't'][randInt(0, 2)];

    if (type === 'S') {
        const oneDigit = randInt(2, 9);
        const other    = randInt(2, 20);

        const vIsOneDigit = Math.random() < 0.5;

        const v = vIsOneDigit ? oneDigit : other;
        const t = vIsOneDigit ? other    : oneDigit;
        const S = v * t;

        return {
            target: 'S',
            v, t, S,
            text: `v = ${v} км/ч, t = ${t} ч.\nНайди S.`,
            hint: 'S = v × t',
            answer: S,
            unit: 'км'
        };
    }

    if (type === 'v') {
        const t = randInt(2, 9);
        const v = randInt(2, 20);
        const S = v * t;

        return {
            target: 'v',
            v, t, S,
            text: `S = ${S} км, t = ${t} ч.\nНайди v.`,
            hint: 'v = S ÷ t',
            answer: v,
            unit: 'км/ч'
        };
    }

    const v = randInt(2, 9);
    const t = randInt(2, 20);
    const S = v * t;

    return {
        target: 't',
        v, t, S,
        text: `S = ${S} км, v = ${v} км/ч.\nНайди t.`,
        hint: 't = S ÷ v',
        answer: t,
        unit: 'ч'
    };
}

// =========================================================
//  УПРАВЛЕНИЕ ЭКРАНАМИ
// =========================================================
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// =========================================================
//  ИГРА
// =========================================================
function startGame() {
    timeLeft = GAME_DURATION;
    correctCount = 0;
    wrongCount = 0;

    updateTimerDisplay();
    updateProgress();
    timerEl.classList.remove('warning');

    showScreen(gameScreen);
    nextTask();
    answerInput.focus();

    clearInterval(timerId);
    timerId = setInterval(tick, 1000);
}

function tick() {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 30) timerEl.classList.add('warning');
    if (timeLeft <= 0) endGame();
}

function updateTimerDisplay() {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}

function updateProgress() {
    progressEl.textContent = `Верных ответов: ${correctCount}`;
}

function nextTask() {
    currentTask = generateTask();
    taskText.textContent = currentTask.text;
    taskHint.textContent = currentTask.hint;
    answerInput.value = '';
}

// =========================================================
//  ПРОВЕРКА ОТВЕТА
// =========================================================
function checkAnswer() {
    if (lockInput || !currentTask) return;

    const raw = answerInput.value.trim().replace(',', '.');
    if (raw === '') return;

    const userAnswer = parseFloat(raw);
    if (isNaN(userAnswer)) return;

    if (Math.abs(userAnswer - currentTask.answer) < 1e-6) {
        correctCount++;
        updateProgress();
        taskCard.classList.add('correct');
        lockInput = true;
        setTimeout(() => {
            taskCard.classList.remove('correct');
            lockInput = false;
            nextTask();
            answerInput.focus();
        }, 250);
    } else {
        wrongCount++;
        taskCard.classList.add('wrong');
        answerInput.value = '';
        setTimeout(() => taskCard.classList.remove('wrong'), 400);
    }
}

// =========================================================
//  КОНЕЦ ИГРЫ
// =========================================================
function endGame() {
    clearInterval(timerId);
    timerEl.classList.remove('warning');

    correctCountEl.textContent = correctCount;
    wrongCountEl.textContent   = wrongCount;
    timeTakenEl.textContent    = GAME_DURATION;

    if (correctCount >= 40)      resultEmoji.textContent = '🏆';
    else if (correctCount >= 25) resultEmoji.textContent = '🎉';
    else if (correctCount >= 15) resultEmoji.textContent = '👍';
    else                          resultEmoji.textContent = '💪';

    showScreen(resultScreen);
}

// =========================================================
//  СОБЫТИЯ
// =========================================================
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
});

submitBtn.addEventListener('click', checkAnswer);
