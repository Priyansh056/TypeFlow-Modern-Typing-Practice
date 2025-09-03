const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const cpmElement = document.getElementById("cpm");
const accuracyElement = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");
const pauseBtn = document.getElementById("pause-btn");
const darkModeBtn = document.getElementById("darkmode-btn");
const difficultySelect = document.getElementById("difficulty");

let timer = 0, interval = null, isPaused = false;
let totalTyped = 0, correctChars = 0, startTime = null;

// Fetch random quote (Wikipedia API)
async function loadQuote() {
  const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary");
  const data = await res.json();
  quoteDisplay.textContent = data.extract.slice(0, 200); // Limit length
  quoteInput.value = "";
  resetStats();
}
loadQuote();

// Typing handler
quoteInput.addEventListener("input", () => {
  if (!startTime) {
    startTime = new Date();
    startTimer();
  }
  totalTyped++;
  const quote = quoteDisplay.textContent;
  const input = quoteInput.value;
  
  correctChars = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === quote[i]) correctChars++;
  }

  const elapsed = (new Date() - startTime) / 1000 / 60; // minutes
  const wpm = Math.round((correctChars / 5) / elapsed);
  const cpm = Math.round(correctChars / elapsed);
  const accuracy = Math.round((correctChars / totalTyped) * 100);

  wpmElement.textContent = wpm || 0;
  cpmElement.textContent = cpm || 0;
  accuracyElement.textContent = accuracy >= 0 ? accuracy : 100;
});

// Timer
function startTimer() {
  interval = setInterval(() => {
    if (!isPaused) {
      timer++;
      timerElement.textContent = timer;
    }
  }, 1000);
}
function resetStats() {
  clearInterval(interval);
  timer = 0; totalTyped = 0; correctChars = 0; startTime = null; isPaused = false;
  timerElement.textContent = "0";
  wpmElement.textContent = "0";
  cpmElement.textContent = "0";
  accuracyElement.textContent = "100%";
}

// Buttons
restartBtn.addEventListener("click", loadQuote);

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Difficulty (affects quote length)
difficultySelect.addEventListener("change", () => {
  loadQuote();
});