// Global variables
let currentSubject = '';
let currentTheme = '';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];

// Subject selection from index.html
function selectSubject(subject) {
    currentSubject = subject;
    localStorage.setItem('selectedSubject', subject);
    window.location.href = 'themes.html';
}

// Theme page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('themes.html')) {
        initializeThemePage();
    } else if (window.location.pathname.endsWith('quiz.html')) {
        initializeQuizPage();
    }
});

function initializeThemePage() {
    const subject = localStorage.getItem('selectedSubject');
    if (!subject) {
        window.location.href = 'index.html';
        return;
    }
    
    currentSubject = subject;
    const subjectTitle = document.getElementById('subject-title');
    subjectTitle.textContent = subject.charAt(0).toUpperCase() + subject.slice(1) + ' Quiz';
    
    // Load available themes for this subject
    const themeButtons = document.getElementById('theme-buttons');
    
    // For this example, we'll hardcode the themes for history
    // In a real app, you might want to fetch this from a config file
    const themes = {
        history: ['battles', 'contemporaryHistory', 'modernHistory'],
        science: ['physics', 'chemistry']
    };
    
    themes[subject].forEach(theme => {
        const button = document.createElement('button');
        button.textContent = theme.charAt(0).toUpperCase() + 
                            theme.slice(1).replace(/([A-Z])/g, ' $1');
        button.onclick = () => selectTheme(theme);
        themeButtons.appendChild(button);
    });
}

function selectTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('selectedTheme', theme);
    window.location.href = 'quiz.html';
}

// Quiz page functionality remains the same except for the JSON path
function initializeQuizPage() {
    const subject = localStorage.getItem('selectedSubject');
    const theme = localStorage.getItem('selectedTheme');
    
    if (!subject || !theme) {
        window.location.href = 'index.html';
        return;
    }
    
    currentSubject = subject;
    currentTheme = theme;
    
    document.getElementById('theme-title').textContent = 
        `${subject.charAt(0).toUpperCase() + subject.slice(1)}: ${theme.charAt(0).toUpperCase() + theme.slice(1).replace(/([A-Z])/g, ' $1')}`;
    
    // Load questions for the selected subject and theme
    fetch(`subjects/${subject}/themes/${theme}.json`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            setupQuestionCountSelection();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Failed to load questions. Please try again.');
        });
}

// Rest of the quiz functions remain the same as before
// (setupQuestionCountSelection, startQuiz, displayQuestion, checkAnswer, nextQuestion, showResults, shuffleArray)
