const questions = [
  {
    q: "Кто сфотографировал ДНК?",
    answers: ["Мария Кюри", "Розалинд Франклин", "Ада Лавлейс"],
    correct: 1,
    person: "franklin"
  },
  {
    q: "Кто открыл радиоактивность?",
    answers: ["Мария Кюри", "Фрида Кало", "Клеопатра"],
    correct: 0,
    person: "curie"
  },
  {
    q: "Кто провёл первое успешное кесарево сечение?",
    answers: ["Джеймс Барри", "Ада Лавлейс", "Мария Кюри"],
    correct: 0,
    person: "barry"
  },
  {
    q: "Кто написал первую в истории программу?",
    answers: ["Розалинд Франклин", "Ада Лавлейс", "Клеопатра"],
    correct: 1,
    person: "lovelace"
  },
  {
    q: "Кто был последней царицей Египта?",
    answers: ["Клеопатра", "Фрида Кало", "Мария Кюри"],
    correct: 0,
    person: "cleopatra"
  },
  {
    q: "Кто рисовал себя, а не других?",
    answers: ["Ада Лавлейс", "Розалинд Франклин", "Фрида Кало"],
    correct: 2,
    person: "frieda"
  }
];

const people = {
  frieda:    { name: "Фрида Кало",        img: "images/frieda.jpg",    fact: "Рисовала автопортреты, превращая боль в искусство." },
  curie:     { name: "Мария Кюри",        img: "images/curie.jpg",     fact: "Единственная женщина с двумя Нобелевскими премиями." },
  barry:     { name: "Джеймс Барри",      img: "images/barry.jpg",     fact: "Жила под мужским именем, чтобы стать хирургом." },
  franklin:  { name: "Розалинд Франклин", img: "images/franklin.jpg",  fact: "Её снимок ДНК украл лавры для троих мужчин." },
  cleopatra: { name: "Клеопатра",         img: "images/cleopatra.jpg", fact: "Знала несколько языков и правила Египтом." },
  lovelace:  { name: "Ада Лавлейс",       img: "images/lovelace.jpg",  fact: "Первый программист в истории — ещё в 1840-х." }
};

let current = 0;
let score = 0;

// ===== Курсор-звёздочка + шлейф =====
const starCursor = document.getElementById("cursor-star");
const trailContainer = document.getElementById("cursor-trail");

if (starCursor && trailContainer && window.innerWidth > 900) {
  const TRAIL_COUNT = 8;
  const trail = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const s = document.createElement("div");
    s.classList.add("trail-star");
    s.textContent = "✦";
    const size = 14 - i * 1.2;
    s.style.fontSize = size + "px";
    s.style.opacity = (1 - i / TRAIL_COUNT) * 0.7;
    trailContainer.appendChild(s);
    trail.push({ el: s, x: 0, y: 0 });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  starCursor.style.left = mouseX + "px";
  starCursor.style.top = mouseY + "px";

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    starCursor.style.left = mouseX + "px";
    starCursor.style.top = mouseY + "px";
  });

  function animateTrail() {
    let prevX = mouseX;
    let prevY = mouseY;

    trail.forEach((point) => {
      point.x += (prevX - point.x) * 0.35;
      point.y += (prevY - point.y) * 0.35;

      point.el.style.left = point.x + "px";
      point.el.style.top = point.y + "px";

      prevX = point.x;
      prevY = point.y;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();

  const hoverTargets = "a, button, .answer-btn, .quiz-btn, .back-link, .back-link-bottom";
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener("mouseenter", () => starCursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => starCursor.classList.remove("hover"));
  });
}

// ===== Частицы =====
const particlesContainer = document.getElementById("particles");
if (particlesContainer) {
  for (let i = 0; i < 35; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = Math.random() * 100 + "%";
    p.style.bottom = "-10px";
    p.style.animationDuration = (Math.random() * 16 + 10) + "s";
    p.style.animationDelay = (Math.random() * 12) + "s";
    const size = Math.random() * 4 + 2;
    p.style.width = size + "px";
    p.style.height = size + "px";
    particlesContainer.appendChild(p);
  }
}

// ===== Звуки =====
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
  try {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {}
}

function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("question-screen").style.display = "block";
  current = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  const q = questions[current];

  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  progressFill.style.width = ((current) / questions.length * 100) + "%";
  progressText.textContent = `${current + 1} / ${questions.length}`;

  document.getElementById("question").textContent = q.q;
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("reveal-card").style.display = "none";

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(index, btn);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(index, btn) {
  const q = questions[current];
  const allBtns = document.querySelectorAll(".answer-btn");
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById("feedback");
  const revealCard = document.getElementById("reveal-card");
  const person = people[q.person];

  if (index === q.correct) {
    btn.classList.add("correct");
    feedback.textContent = "Правильно! ✓";
    feedback.classList.add("correct");
    score++;
    playSound("correct");
  } else {
    btn.classList.add("wrong");
    allBtns[q.correct].classList.add("correct");
    feedback.textContent = `Неправильно. Правильный ответ: ${q.answers[q.correct]}`;
    feedback.classList.add("wrong");
    playSound("wrong");
  }

  document.getElementById("reveal-img").src = person.img;
  document.getElementById("reveal-name").textContent = person.name;
  document.getElementById("reveal-fact").textContent = person.fact;
  revealCard.style.display = "flex";

  document.getElementById("next-btn").style.display = "inline-block";
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("question-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "block";

  document.getElementById("result-text").textContent =
    `Ты ответил правильно на ${score} из ${questions.length}`;

  let verdict = "";
  if (score === questions.length) verdict = "Идеально! Ты знаешь их всех. ✦";
  else if (score >= 4) verdict = "Отлично! Ты почти всех знаешь.";
  else if (score >= 2) verdict = "Неплохо! Но есть куда расти.";
  else verdict = "Загляни в галерею — там всё есть.";

  document.getElementById("verdict").textContent = verdict;

  if (score >= 5) launchConfetti();
}

function restartQuiz() {
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("confetti").innerHTML = "";
}

function launchConfetti() {
  const container = document.getElementById("confetti");
  const colors = ["#d4af37", "#f5d76e", "#b8860b", "#fff3c4", "#e8c766"];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 2) + "s";
    piece.style.animationDelay = (Math.random() * 0.8) + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    if (Math.random() > 0.5) piece.style.borderRadius = "50%";
    container.appendChild(piece);
  }

  setTimeout(() => { container.innerHTML = ""; }, 5000);
}