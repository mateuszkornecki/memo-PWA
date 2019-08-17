"use strict";

// service worker registration - remove if you're not going to use it

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// place your code below

const memo = {
    cards: [],
    discoveredCards: [],
    pairs: [],

    shuffle(array) {
        // Using Fisher-Yates Algorithm to shuffle an array 
        // got it from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * array.length)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    },
    setAmount(value) {
        this.cards.length = 0;
        for (let i = 0; i < value; i++) {
            this.cards.push(i);
        }
    },
    createCards() {
        this.shuffle(this.cards);
        this.cards.forEach((cardId) => {
            const board = document.querySelector('.board');
            const card = document.createElement('div');
            card.className = 'card';
            card.id = memo.cards[cardId];
            //! uncomment line below to turn on godmode
            // card.innerHTML = memo.cards[cardId];
            board.appendChild(card);
        });
    },
    searchPairs() {
        const board = document.querySelector('.board');
        board.addEventListener('click', (e) => {
            if (this.discoveredCards.length < 2 && e.target.className === 'card') {
                let id = parseInt(e.target.id);
                const card = document.getElementById(id);
                card.classList.add('card-reverse', `card-reverse--${id}`);
                this.discoveredCards.push(id);
                this.checkPairs();
                counters.score();
            }
        })
    },
    checkPairs() {
        if (this.discoveredCards.length > 1) {
            let card1 = document.getElementById(this.discoveredCards[0]);
            let card2 = document.getElementById(this.discoveredCards[1]);
            let card1BackgroundColor = window.getComputedStyle(card1).getPropertyValue('background-color');
            let card2BackgroundColor = window.getComputedStyle(card2).getPropertyValue('background-color');
            if (card1BackgroundColor === card2BackgroundColor) {
                this.pairs.push(this.discoveredCards[0], this.discoveredCards[1]);
                card1.classList.add('card--hidden');
                card2.classList.add('card--hidden');
                card1.classList.remove('card');
                card2.classList.remove('card');
                this.discoveredCards.length = 0;
            } else {
                counters.moveCounter();
                setTimeout(() => {
                    this.discoveredCards.forEach(card => {
                        const a = document.getElementById(card);
                        a.classList.remove('card-reverse', `card-reverse--${card}`);
                    })
                    this.discoveredCards.length = 0;
                }, 1000);
            }
        }
    }
};

const counters = {
    wrongMoves: [0],
    finalScore: [],
    score() {
        const pairsCounter = document.querySelector('.pairs-counter');
        let pairsAmount = memo.pairs.length / 2
            //add 10 point for every pair and remove 2 points for every miss
        let score = pairsAmount * 10 - this.wrongMoves * 2;
        pairsCounter.innerHTML = score;

        if (pairsAmount === memo.cards.length / 2) {
            console.log('Gratulacje - wygrałeś grę');
            this.finalScore.push(score);
            //clean up board
            const board = document.querySelector('.board');
            board.innerHTML = '';

            handlers.playAgain();
        }
    },
    moveCounter() {
        //count moves without finding pairs
        this.wrongMoves[0]++
    },
    saveScore() {
        //TODO allow user to use same name multiple time
        if (this.finalScore.length > 0) {
            let userName = localStorage.getItem('User Name');
            class User {
                constructor(name, score) {
                    this.name = name;
                    this.score = score;
                }
            }
            let user = new User(userName, this.finalScore[0]);
            console.log(user);
            localStorage.setItem(userName, JSON.stringify(user));
            this.finalScore.length = 0;
        }
    }
}

const handlers = {
    startGame() {
        const startButton = document.querySelector('.start-button');
        const scoreTitle = document.querySelector('.header__heading');
        const pairsCounter = document.querySelector('.pairs-counter');
        const footer = document.querySelector('.footer');
        startButton.addEventListener('click', (e) => {
            //reset counter value
            pairsCounter.innerHTML = 0;
            scoreTitle.innerHTML = 'score';
            memo.createCards();
            memo.searchPairs();
            startButton.classList.add('hidden');
            const setLevel = document.querySelector('.set-level');
            setLevel.classList.add('hidden');
            footer.classList.add('hidden');
            this.hideScoreBoard()
        })
    },
    playAgain() {
        this.createUser();
        memo.discoveredCards.length = 0;
        memo.pairs.length = 0;
        counters.wrongMoves[0] = 0;
        const startButton = document.querySelector('.start-button');
        const setLevel = document.querySelector('.set-level');
        const playAgainButton = document.querySelector('.play-again-button');
        startButton.classList.remove('hidden');
        startButton.innerHTML = 'play again';
        setLevel.classList.remove('hidden');

    },
    setDifficulty() {
        const setLevel = document.querySelector('.set-level');
        const radioButtonEasy = document.querySelector('.radio-button--easy');
        const radioButtonMedium = document.querySelector('.radio-button--medium');
        const radioButtonHard = document.querySelector('.radio-button--hard');
        const board = document.querySelector('.board');
        //default difficulty value - EASY
        memo.setAmount(8);
        board.classList.add('board--easy');
        //change difficulty value on click 
        setLevel.addEventListener('click', (e) => {
            switch (e.target.id) {
                case 'radio-button--easy':
                    memo.setAmount(8);
                    board.classList.add('board--easy');
                    if (board.classList === 'board--medium') {
                        board.classList.remove('board--medium');
                    }
                    if (board.classList === 'board--hard') {
                        board.classList.remove('board--hard');
                    }
                    break;
                case 'radio-button--medium':
                    memo.setAmount(12);
                    board.classList.add('board--medium');
                    if (board.classList === 'board--easy') {
                        board.classList.remove('board--easy');
                    }
                    if (board.classList === 'board--hard') {
                        board.classList.remove('board--hard');
                    }
                    break;
                case 'radio-button--hard':
                    memo.setAmount(16);
                    board.classList.add('board--hard');
                    if (board.classList === 'board--easy') {
                        board.classList.remove('board--easy');
                    }
                    if (board.classList === 'board--medium') {
                        board.classList.remove('board--medium');
                    }
                    break;
            }
        })
    },
    createUser() {
        const userInput = document.querySelector('.username');
        const userSection = document.querySelector('.user');
        userSection.classList.remove('hidden');
        userInput.addEventListener('keyup', (e) => {
            let userName = userInput.value;
            if (e.keyCode === 13) {
                if (localStorage.getItem(userName)) {
                    alert('Nazwa zajęta, wprowadź nową');
                } else {
                    localStorage.setItem('User Name', userName);
                    counters.saveScore();
                    userSection.classList.add('hidden');
                    userInput.value = '';
                }
                handlers.createScoreBoard();
            }
        })

    },
    createScoreBoard() {
        const scoreBoard = document.querySelector('.scoreboard');
        const scoreBoardList = document.querySelector('.scoreboard__list');
        scoreBoard.classList.remove('hidden');
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            // IF its not empty object - "User Name", print all entries and parse it to JSON
            if (key != 'User Name') {
                let user = JSON.parse(localStorage.getItem(localStorage.key(i)));
                users.push(user);
            }
            // THEN sort array of objects by value
            //got it from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            users.sort(function(a, b) {
                return a.score - b.score;
            });
            users.reverse();
            //slice it to show only top 10 scores
            if (users.length > 10) {
                users.splice(10);
            }
        }
        // create ordered list with top scores
        users.forEach((user, index) => {
            const li = document.createElement('li');
            li.classname = 'scoreboard__item';
            scoreBoardList.appendChild(li);
            li.innerHTML = ` ${user.name} ${user.score}`;
        })

    },
    hideScoreBoard() {
        const scoreBoard = document.querySelector('.scoreboard');
        scoreBoard.classList.add('hidden')
    }

};
handlers.setDifficulty();
handlers.startGame();