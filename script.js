// Variables
let words = ['minecraft', 'fortnite', 'pubg', 'amongus', 'roblox', 'gta', 'valorant', 'osu'];
let hints = ['Mining and possibly even crafting', 'Battle royale game', 'Battle royale game', 'Social deduction game', 'Sandbox platform for user created experiences', 'Open world action-adventure game', 'Tactical shooter game', 'Rhythm game'];
let currentHint = '';
let currentWord = '';
let guessedLetters = [];
let score = 0;
let health = 0;
let totalHealthLost = 0;
let hangmanImages = ['assets/1.webp', 'assets/2.webp', 'assets/3.webp', 'assets/4.webp', 'assets/5.webp', 'assets/6.webp', 'assets/7.webp', 'assets/8.webp', 'assets/9.webp', 'assets/10.webp'];

window.onload = function() {
    const startButton = document.getElementById('start');
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const keys = document.getElementsByClassName('key');

    startButton.addEventListener('click', function() {
        menu.style.display = 'none'; // Hide the menu
        game.style.display = 'block'; // Show the game
        startGame(); // Start the game
    });

    // Add event listener to each key
    for (let i = 0; i < keys.length; i++) {
        keys[i].addEventListener('click', guessLetter);
    }

    
    const hangmanImages = document.querySelectorAll('.hangman-image');
    hangmanImages.forEach(image => {
        image.style.filter = 'invert(1)';
    });
};

// Elements
const title = document.getElementById('title');
const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const customWordset = document.getElementById('customwordset');
const game = document.getElementById('game');
const keyboard = document.getElementById('keyboard');
const guessedWords = document.getElementById('guessedWords');
const scoreElement = document.getElementById('score');
const healthElement = document.getElementById('health');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const hintElement = document.getElementById('hint');

function startGame() {
    // If custom words are provided, use them
    if (customWordset.value.trim() !== '') {
        words = customWordset.value.split(',').map(word => word.trim().toLowerCase());
    }

    // If no more words left to guess, end the game
    if (words.length === 0) {
        modalContent.innerHTML = `
            <p>All words have been guessed!</p>
            <p>Your final score was: ${score}</p>
            <p>Your final health is: ${health}/10</p>
            <button id="modal-restart">Restart</button>
        `;
        modal.style.display = 'block';
        document.getElementById('modal-restart').addEventListener('click', restartGame);
        return;
    }

    let wordIndex = Math.floor(Math.random() * words.length);
    currentWord = words[wordIndex];
    currentHint = hints[wordIndex];
    words.splice(wordIndex, 1); // Remove the selected word from the array
    hints.splice(wordIndex, 1); // Also remove the corresponding hint
    guessedLetters = []; // Reset the guessed letters
    health = 0; // Reset health
    game.style.display = 'block';
    updateDisplay();
    resetKeys();
}

window.addEventListener('keydown', function(event) {
    // Ensure the key pressed is a lowercase letter
    if (event.key >= 'a' && event.key <= 'z') {
        // Find the corresponding key element
        const key = document.querySelector(`.key[data-key="${event.key}"]`);
        if (key) {
            // Trigger a click event on the key element
            key.click();
        }
    }
});
function restartGame() {
    currentWord = '';
    guessedLetters = [];
    score = 0;
    health = 0;
    words = ['apple', 'banana', 'cherry']; // Reset to default words
    game.style.display = 'none';
    modal.style.display = 'none';
    document.getElementById('menu').style.display = 'block'; // Show the menu again
    updateDisplay();
}

// Update the guessLetter function to show different parts of the hangman based on the current health
function guessLetter(event) {
    if (event.target.className === 'key') {
        const key = event.target;
        if (key.disabled) return; // Skip if the key is already pressed
        key.disabled = true; // Disable the key after it's pressed
        const letter = key.textContent;
        if (currentWord.includes(letter)) { // Check if the guessed letter is in the current word
            guessedLetters.push(letter);
            key.style.backgroundColor = 'green'; // Change the color of the key to green
            if (guessedLetters.length === new Set(currentWord.split('')).size) {
                score++;
                startGame(); // Start a new game when the current word is guessed
            }
        } else {
            health++;
            updateHangman(); // Update hangman on incorrect guess
            key.style.backgroundColor = 'red'; // Change the color of the key to red
            checkGameOver(); // Call the checkGameOver function here
        }
        updateDisplay();
    }
}

// Add this function to update the hangman based on the current health
function updateHangman() {
    const parts = ['#head', '#body', '#leftArm', '#rightArm', '#leftLeg', '#rightLeg'];
    for (let i = 0; i < health; i++) {
        document.querySelector(parts[i]).classList.remove('hidden');
    }
}


function resetKeys() {
    const keys = document.getElementsByClassName('key');
    for (let i = 0; i < keys.length; i++) {
        keys[i].style.backgroundColor = ''; // Reset the color of the key
        keys[i].disabled = false; // Enable the key
    }
}

function checkGameOver() {
    if (health >= 10) {
        modalContent.innerHTML = `
            <p>Game over!</p>
            <p>The correct word was: ${currentWord}</p>
            <p>Your score was: ${score}</p>
            <p>Your health is: ${health}</p>
            <button id="modal-restart">Restart</button>
        `;
        modal.style.display = 'block';
        document.getElementById('modal-restart').addEventListener('click', restartGame);
        game.style.display = 'none'; // Hide the game when it's over
    }
}

function updateDisplay() {

    if (health >= 5) {
        hintElement.textContent = 'Hint: ' + currentHint;
    } else {
        hintElement.textContent = '';
    }
    guessedWords.textContent = currentWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    scoreElement.textContent = 'Score: ' + score;
    healthElement.textContent = 'Health: ' + health + '/10'; // Show health out of 10
    updateHangman();
}



function updateHangman() {
    const hangman = document.getElementById('hangman');
    hangman.src = hangmanImages[health];
}




document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        const hangmanImages = document.querySelectorAll('.hangman-image');
        hangmanImages.forEach(image => {
            image.style.filter = 'invert(1)';
        });
    } else {
        const hangmanImages = document.querySelectorAll('.hangman-image');
        hangmanImages.forEach(image => {
            image.style.filter = 'none';
        });
    }
});
