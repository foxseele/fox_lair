document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // --- Экраны ---
    const menuScreen = document.getElementById('menu-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    // --- Контейнеры и Кнопки ---
    const quizListContainer = document.getElementById('quiz-list-container');
    const shareBtn = document.getElementById('share-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

    // --- Элементы викторины ---
    const questionTitle = document.getElementById('question-title');
    const optionsContainer = document.getElementById('options-container');
    const progressBar = document.getElementById('progress-bar-inner');

    // --- Элементы результата ---
    const resultTitle = document.getElementById('result-title');
    const resultImage = document.getElementById('result-image');
    const resultDescription = document.getElementById('result-description');

    // =================================================================
    // БАЗА ДАННЫХ ВСЕХ ТЕСТОВ
    // В будущем, чтобы добавить новый тест, просто скопируйте структуру
    // 'birthOfTheMinotaur' и добавьте новый объект сюда.
    // =================================================================
    const quizzes = {
        'birthOfTheMinotaur': {
            title: "Тест: Рождение Минотавра",
            description: "Какой силой вы движимы в этом мифе?",
            questions: [
                {
                    text: "Высшая сила предлагает вам дар, но с условием. Ваши действия?",
                    options: [
                        { text: "Приму дар, но попробую схитрить и обойти условие.", type: 'minos' },
                        { text: "Меня не волнуют дары, я сам создаю свою судьбу и желания.", type: 'pasiphae' },
                        { text: "Я просто инструмент. Скажите, что нужно сделать, и я сделаю.", type: 'daedalus' },
                        { text: "Нарушившего уговор ждёт изящная и неотвратимая кара.", type: 'poseidon' }
                    ]
                },
                {
                    text: "Вас охватила всепоглощающая, но запретная страсть. Что будете делать?",
                    options: [
                        { text: "Неважно, насколько это безумно. Я найду способ получить желаемое.", type: 'pasiphae' },
                        { text: "Нужно скрыть это и сделать вид, что всё в порядке. Репутация важнее.", type: 'minos' },
                        { text: "Чужие страсти — не моя проблема. Моя задача — решить технический вопрос.", type: 'daedalus' },
                        { text: "Страсть — это энергия. Её можно направить на созидание... или на месть.", type: 'poseidon' }
                    ]
                },
                {
                    text: "К вам пришли с невыполнимой и странной просьбой. Ваша реакция?",
                    options: [
                        { text: "«Невыполнимо» — это лишь вопрос времени и ресурсов. Сделаю.", type: 'daedalus' },
                        { text: "Какое безумие! Но мне любопытно посмотреть, что из этого выйдет.", type: 'poseidon' },
                        { text: "Это нарушает все мои планы и принципы! Я в ярости.", type: 'minos' },
                        { text: "Просьба? Я никого не прошу. Я требую и получаю.", type: 'pasiphae' }
                    ]
                }
            ],
            results: {
                minos: {
                    title: "Вы — Царь Минос!",
                    description: "Вы — стратег и правитель, который пытается контролировать всё. Вы умны, но ваша гордыня и попытки обмануть судьбу приводят к катастрофическим и неловким последствиям, с которыми вам потом приходится разбираться.",
                    image: "https://i.ibb.co/L51J1g2/minos.jpg" // Пример ссылки, замените своей
                },
                pasiphae: {
                    title: "Вы — Царица Пасифая!",
                    description: "Вы — воплощение страсти и желания, которое не знает преград. Если вы чего-то хотите, вас не остановят ни общественное мнение, ни законы природы. Ваша воля способна породить как чудо, так и чудовище.",
                    image: "https://i.ibb.co/VvZqGqT/pasiphae.jpg" // Пример ссылки, замените своей
                },
                daedalus: {
                    title: "Вы — Дедал!",
                    description: "Вы — гениальный мастер. Для вас нет нерешаемых задач, есть лишь интересные вызовы. Вы способны создать что угодно, но редко задумываетесь о последствиях своих изобретений, оставаясь блестящим, но отстранённым исполнителем.",
                    image: "https://i.ibb.co/9gP2Pq9/daedalus.jpg" // Пример ссылки, замените своей
                },
                poseidon: {
                    title: "Вы — Посейдон!",
                    description: "Вы — первобытная сила, которая следит за соблюдением клятв. Вас лучше не злить. Ваша месть не груба, а изящна и иронична. Вы не разрушаете врага, а заставляете его страдать от последствий его же собственных поступков.",
                    image: "https://i.ibb.co/W29FmMk/poseidon.jpg" // Пример ссылки, замените своей
                }
            }
        },
        // СЮДА В БУДУЩЕМ ВЫ СМОЖЕТЕ ДОБАВИТЬ НОВЫЙ ТЕСТ
        // 'theseusVsMinotaur': { ... }
    };

    let currentQuizId = null;
    let currentQuestionIndex = 0;
    let scores = {};

    // --- Инициализация ---
    function init() {
        // Рендерим список тестов в главном меню
        quizListContainer.innerHTML = '';
        for (const quizId in quizzes) {
            const quiz = quizzes[quizId];
            const button = document.createElement('button');
            button.className = 'quiz-button';
            button.innerHTML = `
                ${quiz.title}
                <div class="description">${quiz.description}</div>
            `;
            button.onclick = () => startQuiz(quizId);
            quizListContainer.appendChild(button);
        }
        
        // Показываем меню
        showScreen('menu');
    }

    function startQuiz(quizId) {
        currentQuizId = quizId;
        currentQuestionIndex = 0;
        scores = {}; // Сбрасываем очки
        showScreen('quiz');
        displayQuestion();
    }
    
    function displayQuestion() {
        const quizData = quizzes[currentQuizId];
        const question = quizData.questions[currentQuestionIndex];
        questionTitle.textContent = question.text;
        optionsContainer.innerHTML = '';
        progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`;

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.onclick = () => selectOption(option.type);
            optionsContainer.appendChild(button);
        });
    }

    function selectOption(type) {
        // Увеличиваем счетчик для выбранного типа
        scores[type] = (scores[type] || 0) + 1;
        
        currentQuestionIndex++;
        const quizData = quizzes[currentQuizId];
        if (currentQuestionIndex < quizData.questions.length) {
            displayQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        let maxScore = -1;
        let resultType = '';
        for (const type in scores) {
            if (scores[type] > maxScore) {
                maxScore = scores[type];
                resultType = type;
            }
        }
        
        const result = quizzes[currentQuizId].results[resultType];
        resultTitle.textContent = result.title;
        resultDescription.textContent = result.description;
        resultImage.src = result.image;
        showScreen('result');
    }

    function shareResult() {
        const resultText = resultTitle.textContent;
        const quizTitle = quizzes[currentQuizId].title;
        const shareText = `Я прошёл "${quizTitle}" и я — ${resultText.replace('Вы — ', '').replace('!', '')}! 🏛️ Узнай, кто ты!`;
        tg.openTelegramLink(`https://t.me/share/url?url=https://t.me/YourChannelName&text=${encodeURIComponent(shareText)}`);
        // ЗАМЕНИТЕ YourChannelName на юзернейм вашего канала
    }
    
    function showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`${screenName}-screen`).classList.add('active');
    }

    // --- Навешиваем события ---
    backToMenuBtn.addEventListener('click', init);
    shareBtn.addEventListener('click', shareResult);

    // --- Запускаем приложение ---
    init();
});