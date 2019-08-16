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
        // Using Fisher-Yates Algorithm to shuffle an array >> got it from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
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
            //! god mode remember to delete!
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
    // pairCounter() {
    //     const pairsCounter = document.querySelector('.pairs-counter');
    //     let pairsAmount = this.pairs.length / 2


    //     if (pairsAmount >= 1) {
    //         pairsCounter.innerHTML = `${pairsAmount*10}`;
    //         if (pairsAmount === this.cards.length / 2) {
    //             console.log('Gratulacje - wygrałeś grę');
    //             //clean up board
    //             const board = document.querySelector('.board');
    //             board.innerHTML = '';
    //             handlers.playAgain();
    //         }
    //     }
    // },

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
            this.saveScore();
            console.log(this.finalScore);
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
        if (this.finalScore.length > 0) {
            localStorage.setItem('user1', this.finalScore[0])

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
            startButton.classList.add('start-button--hidden');
            const setLevel = document.querySelector('.set-level');
            setLevel.classList.add('start-button--hidden');
            footer.classList.add('start-button--hidden');
        })
    },
    playAgain() {
        memo.discoveredCards.length = 0;
        memo.pairs.length = 0;
        counters.wrongMoves[0] = 0;
        const startButton = document.querySelector('.start-button');
        const setLevel = document.querySelector('.set-level');
        const playAgainButton = document.querySelector('.play-again-button');
        startButton.classList.remove('start-button--hidden');
        startButton.innerHTML = 'play again';
        setLevel.classList.remove('start-button--hidden');
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
        //TODO: REMEMBER CHOOSEN DIFFICULTY!!
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
    }
};
handlers.setDifficulty();
handlers.startGame();