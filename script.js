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

// pindah ke pertanyaan selanjutnya setelah menyimpan jawaban
function nextQuestion() {
    saveAnswer();
    if (currentQuestion < 9) currentQuestion++;
    renderQuestion();
}

// prevQuestion pindah ke pertanyaan sebelumnya setelah menyimpan jawaban
function prevQuestion() {
    saveAnswer();
    if (currentQuestion > 0) currentQuestion--;
    renderQuestion();
}

// mencatat jawaban yang dipilih ke dalam userAnswers
function saveAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        userAnswers[currentQuestion] = parseInt(selected.value);
    }
    updateButtonStyles();
}


//menyimpan jawaban pengguna, menghitung skor berdasarkan jawaban yang benar, lalu menampilkan hasil dan penjelasan setiap soal
function submitAnswer() {
    saveAnswer();
    let score = 0;
    for (let i = 0; i < 10; i++) {
        if (userAnswers[i] === questions[i].answer) {
            score++;
        }
    }

    const container = document.querySelector('.col-md-8');
    container.innerHTML = `<div class="card p-4 mb-3">
        <h3 class="mb-3">Skor Anda: ${score} / 10</h3>
        ${questions.map((q, i) => {
            const userAnswer = userAnswers[i];
            const correct = userAnswer === q.answer;
            return `
                <div class="mb-4">
                    <h5>Soal ${i + 1}:</h5>
                    <p>${escapeHtml(q.question)}</p>
                    <ul>
                        ${q.options.map((opt, idx) => {
                            let style = '';
                            if (idx === q.answer) style = 'font-weight: bold; color: green;';
                            if (idx === userAnswer && userAnswer !== q.answer) style = 'color: red;';
                            return `<li style="${style}">${escapeHtml(opt)}</li>`;
                        }).join('')}
                    </ul>
                    <p><strong>Jawaban Anda:</strong> ${userAnswer !== null ? escapeHtml(q.options[userAnswer]) : 'Tidak dijawab'}</p>
                    <p><strong>Status:</strong> ${correct ? '<span class="text-success">Benar</span>' : '<span class="text-danger">Salah</span>'}</p>
                </div>
            `;
        }).join('')}
    </div>`;
}


function startTimer() {
    const timerDisplay = document.getElementById('timer');
    const interval = setInterval(() => {
        if (timerSeconds <= 0) {
            clearInterval(interval);
            submitAnswer();
        }
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerSeconds--;
    }, 1000);
}

// 
function escapeHtml(text){
    const map = {
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#039;'

    };
    return text.replace(/[&<>"']/g, function(m) { return map[m];});
}

window.onload = loadQuestions;