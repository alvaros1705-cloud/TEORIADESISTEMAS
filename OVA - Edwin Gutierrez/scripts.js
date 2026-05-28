/* =========================================
   QUIZ - PREGUNTAS
   ========================================= */

const questions = [

    {
        question: "¿Qué propiedad indica que un sistema funciona como un todo integrado?",
        answers: [
            { text: "Entropía",     correct: false },
            { text: "Totalidad",    correct: true  },
            { text: "Caos",         correct: false },
            { text: "Redundancia",  correct: false }
        ]
    },

    {
        question: "¿Qué propiedad representa la tendencia al desorden?",
        answers: [
            { text: "Sinergia",       correct: false },
            { text: "Homeostasis",    correct: false },
            { text: "Entropía",       correct: true  },
            { text: "Adaptabilidad",  correct: false }
        ]
    },

    {
        question: "¿Qué propiedad permite mantener estabilidad en un sistema?",
        answers: [
            { text: "Homeostasis",  correct: true  },
            { text: "Entropía",     correct: false },
            { text: "Caos",         correct: false },
            { text: "Globalidad",   correct: false }
        ]
    },

    {
        question: "¿Qué propiedad mejora resultados mediante cooperación?",
        answers: [
            { text: "Sinergia",       correct: true  },
            { text: "Entropía",       correct: false },
            { text: "Aislamiento",    correct: false },
            { text: "Fragmentación",  correct: false }
        ]
    }

];

/* =========================================
   ELEMENTOS QUIZ
   ========================================= */

const questionElement   = document.getElementById("question");
const answersElement    = document.getElementById("answers");
const nextButton        = document.getElementById("next-btn");
const scoreElement      = document.getElementById("score");
const progressFill      = document.getElementById("quiz-progress-fill");
const progressText      = document.getElementById("quiz-progress-text");
const scoreLive         = document.getElementById("quiz-score-live");

/* =========================================
   VARIABLES
   ========================================= */

let currentQuestionIndex = 0;
let score = 0;

/* =========================================
   FUNCIONES QUIZ
   ========================================= */

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
    scoreElement.innerHTML = "";
    updateProgress();
    showQuestion();
}

function updateProgress() {
    const total   = questions.length;
    const current = currentQuestionIndex + 1;
    const pct     = Math.round(((currentQuestionIndex) / total) * 100);

    if (progressFill)  progressFill.style.width   = pct + "%";
    if (progressText)  progressText.textContent    = `Pregunta ${Math.min(current, total)} de ${total}`;
    if (scoreLive)     scoreLive.textContent        = `Puntos: ${score}`;
}

function showQuestion() {
    resetState();
    updateProgress();

    const currentQuestion = questions[currentQuestionIndex];

    // Fade in question
    questionElement.style.opacity = "0";
    questionElement.style.transform = "translateY(10px)";
    questionElement.innerHTML = currentQuestion.question;

    requestAnimationFrame(() => {
        questionElement.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        questionElement.style.opacity = "1";
        questionElement.style.transform = "translateY(0)";
    });

    currentQuestion.answers.forEach((answer, i) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("answer-btn");
        button.style.opacity = "0";
        button.style.transform = "translateX(-10px)";

        answersElement.appendChild(button);

        if (answer.correct) {
            button.dataset.correct = true;
        }

        // Stagger entrance
        setTimeout(() => {
            button.style.transition = "opacity 0.3s ease, transform 0.3s ease, background 0.35s, border-color 0.35s, color 0.35s, box-shadow 0.35s";
            button.style.opacity = "1";
            button.style.transform = "translateX(0)";
        }, i * 80);

        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answersElement.firstChild) {
        answersElement.removeChild(answersElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
        if (scoreLive) scoreLive.textContent = `Puntos: ${score}`;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answersElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
        button.style.cursor = "default";
    });

    nextButton.style.display = "inline-flex";
}

function showScore() {
    resetState();

    const pct = Math.round((score / questions.length) * 100);
    let emoji = pct >= 75 ? "🎉" : pct >= 50 ? "📚" : "💪";

    questionElement.innerHTML = `${emoji} Quiz finalizado`;

    if (progressFill) progressFill.style.width = "100%";
    if (progressText) progressText.textContent = `Completado`;
    if (scoreLive)    scoreLive.textContent    = `Puntos: ${score}`;

    scoreElement.innerHTML = `Obtuviste <strong>${score} de ${questions.length}</strong> respuestas correctas — ${pct}%`;

    nextButton.innerHTML = 'Reiniciar Quiz <i class="fa-solid fa-rotate-right"></i>';
    nextButton.style.display = "inline-flex";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();

/* =========================================
   SCROLL REVEAL
   ========================================= */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal-fade, .reveal-up").forEach(el => {
    revealObserver.observe(el);
});

/* =========================================
   HEADER — scroll effect
   ========================================= */

const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}, { passive: true });

/* =========================================
   NAV TOGGLE (mobile)
   ========================================= */

const navToggle = document.getElementById("nav-toggle");
const navMenu   = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

// Close menu on link click
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
    });
});

/* =========================================
   NAV ACTIVE LINK — highlight on scroll
   ========================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll("nav a");

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(link => {
                link.style.color = "";
                link.style.background = "";
                if (link.getAttribute("href") === `#${id}`) {
                    link.style.color = "var(--blue-bright)";
                    link.style.background = "rgba(59,130,246,0.1)";
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(s => activeObserver.observe(s));
