let currentQuestion = 0;
let userAnswers = Array(10).fill(null);
let timerSeconds = 600;

async function loadQuestions() {
    const res = await fetch('questions.json');
    const data = await res.json();
    window.questions = data;
    renderQuestion();
    renderQuestionButtons();
    startTimer();
}

// Pertanyaan
function renderQuestion() {
    const q = questions[currentQuestion];
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <h5>Pertanyaan ${currentQuestion + 1}</h5>
        <p>${escapeHtml(q.question)}</p>
        ${q.options.map((opt, i) => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="answer" id="q${currentQuestion}opt${i}" 
                    value="${i}" ${userAnswers[currentQuestion] == i ? 'checked' : ''}>
                <label class="form-check-label" for="q${currentQuestion}opt${i}">${escapeHtml(opt)}</label>
            </div>`).join('')}
    `;
    updateButtonStyles();
}

// Tombol 1-10
function renderQuestionButtons() {
    const btnContainer = document.getElementById('question-buttons');
    btnContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-secondary m-1';
        btn.textContent = i + 1;
        btn.id = `btn-q-${i}`;
        btn.onclick = () => {
            currentQuestion = i;
            renderQuestion();
        };
        btnContainer.appendChild(btn);
    }
    updateButtonStyles();
}

// ubah tombol jadi hijau saat diklik next
function updateButtonStyles() {
    for (let i = 0; i < 10; i++) {
        const btn = document.getElementById(`btn-q-${i}`);
        if (userAnswers[i] !== null) {
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-success');
        }
    }
}

// menyimpan jawaban
function nextQuestion() {
    saveAnswer();
    if (currentQuestion < 9) currentQuestion++;
    renderQuestion();
}

