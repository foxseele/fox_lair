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
        'labyrinthOfCrete': {
            title: "Тест: Лабиринт Крита",
            description: "Кем бы вы были в мифе о Лабиринте Крита?",
            questions: [
                {
                    text: "Перед вами встала серьёзная проблема. Ваша первая реакция?",
                    options: [
                        { text: "Беру всё в свои руки и иду напролом. Проблема сама себя не решит!", type: 'theseus' },
                        { text: "Ищу того, кто в меня верит, и помогаю ему. Вместе мы сила.", type: 'ariadne' },
                        { text: "Анализирую. Нужно найти нестандартное, гениальное решение. Дайте подумать.", type: 'daedalus' },
                        { text: "Устанавливаю правила и требую их соблюдения. Порядок — прежде всего.", type: 'minos' },
                        { text: "Вау, проблема! Какая интересная возможность! А что если попробовать вот так?!", type: 'icarus' }
                    ]
                },
                {
                    text: "Вы достигли огромного успеха. Как отпразднуете?",
                    options: [
                        { text: "Отлично, справились. Какая следующая задача?", type: 'theseus' },
                        { text: "Я так счастлива! Главное, что мои близкие рядом и разделяют эту радость.", type: 'ariadne' },
                        { text: "Я горд своей работой. Но уже думаю, как в следующий раз можно сделать ещё лучше.", type: 'daedalus' },
                        { text: "Так и должно было быть. Это лишь доказывает мою правоту и силу.", type: 'minos' },
                        { text: "ЭТО НЕВЕРОЯТНО! Нужно немедленно повторить, но в два раза круче!", type: 'icarus' }
                    ]
                },
                {
                    text: "Ваша главная слабость — это...",
                    options: [
                        { text: "Иногда я забываю о мелочах... и о чувствах других.", type: 'theseus' },
                        { text: "Слишком доверяю людям и готова поставить всё на любовь.", type: 'ariadne' },
                        { text: "Мои же изобретения и идеи иногда приводят к катастрофам.", type: 'daedalus' },
                        { text: "Я не прощаю предательства и могу быть жестоким в своей мести.", type: 'minos' },
                        { text: "Меня так увлекает процесс, что я забываю о правилах безопасности.", type: 'icarus' }
                    ]
                },
                {
                    text: "Вам предложили новый проект. Что вы выберете?",
                    options: [
                        { text: "Спасти город или возглавить рискованную экспедицию.", type: 'theseus' },
                        { text: "Помочь близкому человеку достичь его великой цели.", type: 'ariadne' },
                        { text: "Создать то, чего мир ещё не видел. Шедевр инженерной мысли.", type: 'daedalus' },
                        { text: "Построить могущественную империю и эффективно ей управлять.", type: 'minos' },
                        { text: "Попробовать что-то абсолютно новое и захватывающее, неважно, насколько это опасно!", type: 'icarus' }
                    ]
                }
            ],
            results: {
                theseus: {
                    title: "Вы — Тесей!",
                    description: "Вы прирождённый лидер и герой. Вы не боитесь брать на себя ответственность и смело идёте к цели. Люди следуют за вами, но иногда в погоне за великими свершениями вы можете забывать о деталях, что приводит к неожиданным последствиям.",
                    image: "images/theseus.png" // Замените на актуальную ссылку
                },
                ariadne: {
                    title: "Вы — Ариадна!",
                    description: "Ваше сердце полно любви и сострадания. Вы готовы на всё ради тех, кто вам дорог, и умеете найти выход из самой запутанной ситуации. Ваша сила — в вашей вере в других и в вашей интуиции, которая подсказывает верные решения.",
                    image: "images/ariadne.png" // Замените на актуальную ссылку
                },
                daedalus: {
                    title: "Вы — Дедал!",
                    description: "Вы — гений, творец и изобретатель. Ваш ум способен решать задачи, которые другим кажутся невыполнимыми. Вы видите мир как большую мастерскую, полную возможностей. Главное для вас — не запутаться в последствиях собственных творений.",
                    image: "images/daedalus.png" // Замените на актуальную ссылку
                },
                minos: {
                    title: "Вы — Минос!",
                    description: "Вы — прирождённый правитель. Вы цените порядок, закон и власть. Вы умеете строить системы и требовать их исполнения. Вы сильный и гордый лидер, но ваша непреклонность и жажда справедливости могут легко превратиться в жестокость.",
                    image: "images/minos.png" // Замените на актуальную ссылку
                },
                icarus: {
                    title: "Вы — Икар!",
                    description: "Вы — мечтатель, полный энтузиазма и восторга. Для вас жизнь — это захватывающее приключение. Вы готовы рискнуть всем ради одного момента чистого, незамутнённого счастья и нового опыта. Ваш девиз — «лететь как можно выше!»",
                    image: "images/icarus.png" // Замените на актуальную ссылку
                }
            }
        }
    }
    // СЮДА В БУДУЩЕМ ВЫ СМОЖЕТЕ ДОБАВИТЬ НОВЫЙ ТЕСТ
    // 'theseusVsMinotaur': { ... }

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