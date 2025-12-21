// Global variables
let currentSubject = '';
let currentTheme = '';
let currentMode = '';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let startTime;
let stopwatchInterval;

// Available subjects and their themes (updated structure)
const subjects = {
    'history': {
        displayName: 'History',
        themes: {
            'battles': { displayName: 'Battles Treaties Revolts' },
            'birthAndDeath': { displayName: 'Personalities Birth and Death' },
            'modernHistory': { displayName: 'Modern History' },
            'dynasty': { displayName: 'Dynasty Rule' },
            'historicalPlaces': { displayName: 'Historical Places' },
            'contemporaryHistory': { displayName: 'Contemporary History' },
            'indianRulers': { displayName: 'Indian Rulers Timeline' },
            'britishGovernors': { displayName: 'Governor Generals and Viceroys' },
            'ancientAndMedievalHistory': { displayName: 'Ancient and Medieval History' }
        }
    },
    'polity': {
        displayName: 'Polity',
        themes: {
            'partsOfConstitution': { displayName: 'Parts of Constitution' }
        }
    },
    'geography': {
        displayName: 'Geography',
        themes: {
            'citiesLatitude': { displayName: 'Important Latitudes and Longitudes' }
        }
    },
    'languages': {
        displayName: 'Languages',
        themes: {
            'bengaliLetterRecognition': { displayName: 'Bengali Letter Recognition' },
             'englishVocabulary': { displayName: 'English Vocabulary' },
            'odiaLetterRecognition': { displayName: 'Odia Letter Recognition' },
            'gujaratiLetterRecognition': { displayName: 'Gujarati Letter Recognition' }
        }
    },
    'maths': {
        displayName: 'Maths',
        themes: {
            'tables': { displayName: 'Tables' },
            'squares': { displayName: 'Squares till 50'},
            'squares2': { displayName: 'Squares 31 to 40'},
            'squares3': { displayName: 'Squares 41 to 50'},
            'cubes': {displayName: 'Cubes'},
            'percentage': {displayName: 'Percentage Basic Questions'},
            'standardPercentage': {displayName: 'Standard Percentages'}
        }
    },
    'reasoning': {
        displayName: 'Verbal Reasoning',
        themes: {
            'alphabetPositions': { displayName: 'Alphabet Positions' }
        }
    },
    'bihar': {
        displayName: 'Bihar Specific',
        themes: {
            'biharSpecific': { displayName: 'Bihar Specific' } 
        }
        },
    'gst': {
        displayName: 'CGST',
        themes: {
            'forms': { displayName: 'Forms' },
            'sections': { displayName: 'Sections' }
        }
        }
    // Add more subjects as needed
};

// Initialize the appropriate page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop();
    
    if (path === 'index.html' || path === '') {
        setupSubjectSelection();
    } else if (path === 'theme.html') {
        setupThemeSelection();
    } else if (path === 'mode.html') {
        setupModeSelection();
    } else if (path === 'quiz.html') {
        initializeQuizPage();
    }
});

function startStopwatch() {
  startTime = Date.now();
  stopwatchInterval = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  document.getElementById('stopwatch').textContent = `${minutes}:${seconds}`;
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
}

// SUBJECT SELECTION PAGE FUNCTIONS
function setupSubjectSelection() {
    const subjectButtonsContainer = document.getElementById('subject-buttons');
    
    // Clear any existing buttons
    subjectButtonsContainer.innerHTML = '';
    
    // Create buttons for each subject
    Object.entries(subjects).forEach(([subjectId, subjectData]) => {
        const button = document.createElement('button');
        button.textContent = subjectData.displayName;
        button.onclick = () => selectSubject(subjectId);
        subjectButtonsContainer.appendChild(button);
    });
}

function selectSubject(subject) {
    if (!subjects[subject]) {
        console.error('Invalid subject selected');
        return;
    }
    
    currentSubject = subject;
    localStorage.setItem('selectedSubject', subject);
    window.location.href = 'theme.html';
}

// THEME SELECTION PAGE FUNCTIONS
function setupThemeSelection() {
    const subject = localStorage.getItem('selectedSubject');
    if (!subject || !subjects[subject]) {
        window.location.href = 'index.html';
        return;
    }
    
    currentSubject = subject;
    document.getElementById('subject-title').textContent = subjects[subject].displayName;
    
    const themeButtonsContainer = document.getElementById('theme-buttons');
    themeButtonsContainer.innerHTML = '';
    
    // Updated to work with new structure
    Object.entries(subjects[subject].themes).forEach(([themeId, themeData]) => {
        const button = document.createElement('button');
        button.textContent = themeData.displayName;
        button.onclick = () => selectTheme(themeId);
        themeButtonsContainer.appendChild(button);
    });
}

function selectTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('selectedTheme', theme);
    window.location.href = 'mode.html';
}

// MODE SELECTION PAGE FUNCTIONS
function setupModeSelection() {
    const subject = localStorage.getItem('selectedSubject');
    const theme = localStorage.getItem('selectedTheme');
    
    if (!subject || !theme) {
        window.location.href = 'index.html';
        return;
    }
    
    currentSubject = subject;
    currentTheme = theme;
    
    // Set the mode selection title
    const subjectName = subjects[subject].displayName;
    const themeName = subjects[subject].themes[theme].displayName;
    document.getElementById('theme-title-mode').textContent = `${subjectName}: ${themeName}`;
    
    const modeButtonsContainer = document.getElementById('mode-buttons');
    modeButtonsContainer.innerHTML = '';
    
    // Create mode selection buttons
    const modes = [
        { id: 'practice', name: 'Practice Mode', description: 'Test yourself with interactive questions and scoring' },
        { id: 'revision', name: 'Revision Mode', description: 'Learn with flashcards - perfect for quick review' }
    ];
    
    modes.forEach(mode => {
        const button = document.createElement('button');
        button.innerHTML = `
            <strong>${mode.name}</strong>
            <br>
            <small>${mode.description}</small>
        `;
        button.onclick = () => selectMode(mode.id);
        modeButtonsContainer.appendChild(button);
    });
}

function selectMode(mode) {
    currentMode = mode;
    localStorage.setItem('selectedMode', mode);
    window.location.href = 'quiz.html';
}

// QUIZ PAGE FUNCTIONS
function initializeQuizPage() {
    const subject = localStorage.getItem('selectedSubject');
    const theme = localStorage.getItem('selectedTheme');
    const mode = localStorage.getItem('selectedMode');
    
    if (!subject || !theme || !mode) {
        window.location.href = 'index.html';
        return;
    }
    
    currentSubject = subject;
    currentTheme = theme;
    currentMode = mode;
    
    // Set the quiz title using the display names
    const subjectName = subjects[subject].displayName;
    const themeName = subjects[subject].themes[theme].displayName;
    document.getElementById('theme-title').textContent = `${subjectName}: ${themeName}`;
    
    // Load questions for the selected subject and theme
    fetch(`subjects/${subject}/${theme}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load questions');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No questions available');
            }
            questions = data;
            setupQuestionCountSelection();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Failed to load questions. Please try again.');
            window.location.href = 'mode.html';
        });
}

function setupQuestionCountSelection() {
    const countButtonsContainer = document.getElementById('count-buttons');
    countButtonsContainer.innerHTML = '';
    
    const counts = [10, 20, 30];
    let validCounts = 0;
    
    // Add buttons for 10, 20, 30 if there are enough questions
    counts.forEach(count => {
        if (questions.length >= count) {
            const button = document.createElement('button');
            button.textContent = count;
            button.onclick = () => startQuiz(count);
            countButtonsContainer.appendChild(button);
            validCounts++;
        }
    });
    
    // Only show "All" button if there are questions and it's different from the other options
    if (questions.length > 0 && (validCounts === 0 || questions.length > counts[validCounts - 1])) {
        const allButton = document.createElement('button');
        allButton.textContent = `All (${questions.length})`;
        allButton.onclick = () => startQuiz(questions.length);
        countButtonsContainer.appendChild(allButton);
    }
}

function startQuiz(questionCount) {
    document.getElementById('question-count-selection').style.display = 'none';
    
    // Shuffle questions and select the requested number
    selectedQuestions = shuffleArray([...questions]).slice(0, questionCount);
    currentQuestionIndex = 0;
    score = 0;
    
    // Start the appropriate mode
    if (currentMode === 'practice') {
        startPracticeMode();
    } else if (currentMode === 'revision') {
        startRevisionMode();
    }
}

function startPracticeMode() {
    document.getElementById('quiz-container').style.display = 'block';
    displayQuestion();
    startStopwatch(); // Start timer when quiz begins
}

function startRevisionMode() {
    document.getElementById('revision-container').style.display = 'block';
    setupRevisionMode();
}

// PRACTICE MODE FUNCTIONS
function displayQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        showResults();
        return;
    }
    
    const question = selectedQuestions[currentQuestionIndex];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const explanationContainer = document.getElementById('explanation-container');
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    // Hide explanation and show question
    explanationContainer.style.display = 'none';
    questionText.textContent = question.question;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Shuffle options and create buttons
    const shuffledOptions = shuffleArray([...question.choices]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option, question.answer);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption, correctAnswer) {
    const options = document.querySelectorAll('#options-container button');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    const question = selectedQuestions[currentQuestionIndex];
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        } else if (option.textContent === selectedOption && selectedOption !== correctAnswer) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score if correct
    if (selectedOption === correctAnswer) {
        score++;
    }
    
    // Show explanation
    explanationText.textContent = question.explanation || 'No explanation available.';
    explanationContainer.style.display = 'block';
    
    // Set up next question button
    document.getElementById('next-button').onclick = nextQuestion;
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showResults() {
    stopStopwatch();
    const finalTime = document.getElementById('stopwatch').textContent;
    document.getElementById('score').innerHTML += 
      `<br><small>Time: ${finalTime}</small>`;
    
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.querySelector('.question-container');
    const explanationContainer = document.getElementById('explanation-container');
    const resultContainer = document.getElementById('result-container');
    
    // Hide quiz elements
    quizContainer.style.display = 'block'; // Keep container visible
    questionContainer.style.display = 'none';
    explanationContainer.style.display = 'none';
    
    // Show result container
    resultContainer.style.display = 'block';
    
    // Update score display
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = selectedQuestions.length;
    
    // Add event listeners to buttons (more reliable than inline onclick)
    const buttons = document.querySelectorAll('#result-container button');
    buttons[0].onclick = function() {
        location.reload();
    };
    
    buttons[1].onclick = function() {
        window.location.href = 'mode.html';
    };
    
    buttons[2].onclick = function() {
        window.location.href = 'index.html';
    };
}

// REVISION MODE FUNCTIONS
function setupRevisionMode() {
    const flashcard = document.getElementById('flashcard');
    const frontContent = document.getElementById('front-content');
    const backContent = document.getElementById('back-content');
    const explanationText = document.getElementById('flashcard-explanation');
    const prevBtn = document.getElementById('prev-card');
    const nextBtn = document.getElementById('next-card');
    const flipBtn = document.getElementById('flip-card');
    const progressBar = document.getElementById('revision-progress-bar');

    function updateCard() {
        const question = selectedQuestions[currentQuestionIndex];
        frontContent.textContent = question.question;
        backContent.textContent = question.answer;
        explanationText.textContent = question.explanation || 'No explanation available.';
        
        // Reset card to front view
        flashcard.classList.remove('flipped');
        
        // Update progress bar
        const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update button states
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === selectedQuestions.length - 1;
    }

    function flipCard() {
        flashcard.classList.toggle('flipped');
    }

    function nextCard() {
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            currentQuestionIndex++;
            updateCard();
        }
    }

    function prevCard() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateCard();
        }
    }

    // Event listeners
    flashcard.addEventListener('click', flipCard);
    flipBtn.addEventListener('click', flipCard);
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                prevCard();
                break;
            case 'ArrowRight':
                nextCard();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                flipCard();
                break;
        }
    });

    // Initialize first card
    updateCard();
}

// UTILITY FUNCTIONS
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function formatDisplayName(name) {
    return name
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim();
}
