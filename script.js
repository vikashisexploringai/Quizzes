// Global variables
let currentSubject = '';
let currentTheme = '';
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
            'contemporaryHistory': { displayName: 'Contemporary History' },
            'indianRulers': { displayName: 'Indian Rulers Timeline' },
            'britishGovernors': { displayName: 'Governor Generals and Viceroys' },
            'ancientAndMedievalPersonalities': { displayName: 'Ancient and Medieval Personalities' }
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
            'squares': { displayName: 'Squares'},
            'cubes': {displayName: 'Cubes'}
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
    window.location.href = 'quiz.html';
}

// QUIZ PAGE FUNCTIONS
function initializeQuizPage() {
    const subject = localStorage.getItem('selectedSubject');
    const theme = localStorage.getItem('selectedTheme');
    
    if (!subject || !theme) {
        window.location.href = 'index.html';
        return;
    }
    
    currentSubject = subject;
    currentTheme = theme;
    
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
            window.location.href = 'theme.html';
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
    document.getElementById('quiz-container').style.display = 'block';
    
    // Shuffle questions and select the requested number
    selectedQuestions = shuffleArray([...questions]).slice(0, questionCount);
    currentQuestionIndex = 0;
    score = 0;
    
    displayQuestion();
    startStopwatch(); // Start timer when quiz begins
}

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
    const progress = ((currentQuestionIndex) / selectedQuestions.length) * 100;
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
    document.querySelector('#result-container button:nth-child(3)').onclick = function() {
        location.reload();
    };
    
    document.querySelector('#result-container button:nth-child(4)').onclick = function() {
        window.location.href = 'index.html';
    };
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
