const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const accuracyElement = document.getElementById('accuracy');
const restartButton = document.getElementById('restart-btn');

let timer;
let startTime;
let errors = 0;
let totalTypedChars = 0;

// 📖 Stories/Passages Array
const stories = [
    "Once upon a time, in a small village, there lived a wise old man who was loved by everyone. People came to him for advice, and he always guided them with kindness and wisdom.",
    "In the heart of the forest, a young deer wandered freely. The trees whispered secrets of the past, and the streams sang lullabies to every creature that lived there.",
    "On a rainy evening, a little boy sat near the window watching the raindrops race each other down the glass. He dreamed of adventures in faraway lands.",
    "Long ago, there was a brave knight who fought not for glory, but for peace. His courage inspired generations, and his story was told for centuries.",
    "A curious cat explored every corner of the city, climbing rooftops and sneaking into markets. Wherever it went, it left behind stories of mischief and wonder."
];

// Function to get a random story
function getRandomStory() {
    const randomIndex = Math.floor(Math.random() * stories.length);
    return stories[randomIndex];
}

// Function to render the new story
function renderNewQuote() {
    const quote = getRandomStory();
    quoteDisplayElement.innerHTML = '';
    // Split story into characters and wrap each in a span
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    resetTest();
}

// Event listener for user input
quoteInputElement.addEventListener('input', () => {
    const quoteSpans = quoteDisplayElement.querySelectorAll('span');
    const typedValue = quoteInputElement.value.split('');
    totalTypedChars = typedValue.length;

    // Start timer on first typed character
    if (!startTime) {
        startTimer();
    }

    let localErrors = 0;
    quoteSpans.forEach((characterSpan, index) => {
        const character = typedValue[index];

        // Remove previous styling
        characterSpan.classList.remove('correct', 'incorrect', 'current');

        if (character == null) {
            if (index === typedValue.length) {
                characterSpan.classList.add('current'); // Cursor
            }
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
        } else {
            characterSpan.classList.add('incorrect');
            localErrors++;
        }
    });

    errors = localErrors;

    // Accuracy calculation
    let correctChars = totalTypedChars - errors;
    let accuracy = totalTypedChars > 0 ? ((correctChars / totalTypedChars) * 100) : 100;
    accuracyElement.innerText = Math.round(accuracy);

    // Check if typing complete
    if (typedValue.length === quoteSpans.length) {
        clearInterval(timer);
    }
});

// Timer Functions
function startTimer() {
    startTime = new Date();
    timerElement.innerText = 0;

    timer = setInterval(() => {
        const elapsedTime = getTimerTime();
        timerElement.innerText = elapsedTime;

        const cpm = Math.round((totalTypedChars / elapsedTime) * 60) || 0;
        const wpm = Math.round(cpm / 5) || 0;

        cpmElement.innerText = cpm;
        wpmElement.innerText = wpm;
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Reset test
function resetTest() {
    clearInterval(timer);
    timerElement.innerText = 0;
    wpmElement.innerText = 0;
    cpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    quoteInputElement.value = '';
    quoteInputElement.focus();
    startTime = null;
    errors = 0;
    totalTypedChars = 0;

    const firstChar = quoteDisplayElement.querySelector('span');
    if(firstChar) firstChar.classList.add('current');
}

// Restart button
restartButton.addEventListener('click', renderNewQuote);

// Initial load
renderNewQuote();