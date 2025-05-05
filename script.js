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

function renderQuestion() {
    const q = questions[currentQuestion];
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <h5>Pertanyaan ${currentQuestion + 1}</h5>
        <p>${escapeHtml(q.pertanyaan)}</p>
        ${q.options.map((opt, i) => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="answer" id="q${currentQuestion}opt${i}" 
                    value="${i}" ${userAnswers[currentQuestion] == i ? 'checked' : ''}>
                <label class="form-check-label" for="q${currentQuestion}opt${i}">${escapeHtml(opt)}</label>
            </div>`).join('')}
    `;
    updateButtonStyles();
}
