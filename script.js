// We've replaced the quotable.io API with the Wikipedia API
// This fetches the introduction of a random Wikipedia article.
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
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

// Function to fetch a new random summary from the Wikipedia API
async function getRandomQuote() {
    try {
        const response = await fetch(WIKIPEDIA_API_URL);
        const data = await response.json();
        // We get the 'extract' which is the summary of the article
        const passage = data.extract;
        
        // Let's make sure the passage is a decent length. If not, try again.
        if (passage.length < 200) {
            console.log("Passage too short, fetching another one...");
            return getRandomQuote(); // Recursive call to get a longer one
        }
        return passage;
    } catch (error) {
        console.error("Error fetching quote from Wikipedia:", error);
        return "An error occurred while fetching a new passage. Please try again.";
    }
}

// Function to render the new quote
async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    // Split quote into characters and wrap each in a span
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
            // Not typed yet
            if (index === typedValue.length) {
                characterSpan.classList.add('current'); // Add cursor to current char
            }
        } else if (character === characterSpan.innerText) {
            // Correct character
            characterSpan.classList.add('correct');
        } else {
            // Incorrect character
            characterSpan.classList.add('incorrect');
            localErrors++;
        }
    });

    errors = localErrors;

    // Calculate and display accuracy
    let correctChars = totalTypedChars - errors;
    let accuracy = totalTypedChars > 0 ? ((correctChars / totalTypedChars) * 100) : 100;
    accuracyElement.innerText = Math.round(accuracy);

    // Check if test is complete
    if (typedValue.length === quoteSpans.length) {
        clearInterval(timer); // Stop the timer
    }
});

// Function to start the timer
function startTimer() {
    startTime = new Date();
    timerElement.innerText = 0;
    
    timer = setInterval(() => {
        const elapsedTime = getTimerTime();
        timerElement.innerText = elapsedTime;
        
        // Calculate WPM and CPM
        const cpm = Math.round((totalTypedChars / elapsedTime) * 60) || 0;
        const wpm = Math.round(cpm / 5) || 0; // Standard word is 5 chars
        
        cpmElement.innerText = cpm;
        wpmElement.innerText = wpm;
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Function to reset the test state
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
    // Add cursor to the first character
    const firstChar = quoteDisplayElement.querySelector('span');
    if(firstChar) firstChar.classList.add('current');
}


// Event listener for the restart button
restartButton.addEventListener('click', renderNewQuote);

// Initial load
renderNewQuote();
