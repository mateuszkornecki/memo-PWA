"use strict";

// service worker registration - remove if you're not going to use it

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
//             // Registration was successful
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function(err) {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }

// place your code below

const memo = {
    cards: [],
    discoveredCards: [],
    pairs: [],

    shuffle: function(array) {
        // Using Fisher-Yates Algorithm to shuffle an array >> got it from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * array.length)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    },
    setAmount: function(value) {
        this.cards.length = 0;
        for (let i = 0; i < value; i++) {
            this.cards.push(i);
        }
    },
    createCards: function() {
        this.shuffle(this.cards);
        this.cards.forEach((cardId) => {
            const board = document.querySelector('.board');
            const card = document.createElement('div');
            card.className = 'card';
            card.id = memo.cards[cardId];
            //! god mode remember to delete!
            card.innerHTML = memo.cards[cardId];
            board.appendChild(card);
        });
    },
    searchPairs: function() {
        const board = document.querySelector('.board');
        board.addEventListener('click', (e) => {
            if (this.discoveredCards.length < 2 && e.target.className === 'card') {
                let id = parseInt(e.toElement.id);
                const card = document.getElementById(id);
                card.classList.add('card-reverse', `card-reverse--${id}`);
                this.discoveredCards.push(id);
                this.checkPairs();
                this.pairCounter();
            }
        })
    },
    checkPairs: function() {
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
                setTimeout(() => {
                    this.discoveredCards.forEach(card => {
                        const a = document.getElementById(card);
                        a.classList.remove('card-reverse', `card-reverse--${card}`);
                    })
                    this.discoveredCards.length = 0;
                }, 1000);
            }
        }

    },
    pairCounter: function() {
        const pairsCounter = document.querySelector('.pairs-counter');
        let pairsAmount = this.pairs.length / 2
        if (pairsAmount >= 1) {
            pairsCounter.innerHTML = `Liczba odkrytych par: ${pairsAmount}`;
            if (pairsAmount === this.cards.length / 2) {
                console.log('Gratulacje - wygrałeś grę');
                //clean up board
                const board = document.querySelector('.board');
                board.innerHTML = '';
                handlers.playAgain();


            }
        }
    }
};

const handlers = {
    startGame: function() {
        const startButton = document.querySelector('.start-button');
        startButton.addEventListener('click', (e) => {
            memo.createCards();
            memo.searchPairs();
            startButton.classList.add('start-button--hidden');
            const setLevel = document.querySelector('.set-level');
            setLevel.classList.add('start-button--hidden');
        })
    },
    playAgain: function() {
        memo.discoveredCards.length = 0;
        memo.pairs.length = 0;
        const startButton = document.querySelector('.start-button');
        const setLevel = document.querySelector('.set-level');
        const playAgainButton = document.querySelector('.play-again-button');
        startButton.classList.remove('start-button--hidden');
        startButton.innerHTML = 'Play Again';
        setLevel.classList.remove('start-button--hidden');
    },
    setDifficultysetLevel: function() {
        const setLevel = document.querySelector('.set-level');
        const radioButtonBegginer = document.querySelector('.radio-button--begginer');
        const radioButtonMedium = document.querySelector('.radio-button--medium');
        //default difficultysetLevel value
        if (radioButtonBegginer.checked === true) {
            memo.setAmount(8);
            console.log('begginer');
        } else {
            memo.setAmount(16);
            console.log('medium');
        }
        // difficultysetLevel value after clicking
        setLevel.addEventListener('click', (e) => {
            if (e.target.id === 'radio-button') {
                if (radioButtonMedium.checked === true) {
                    memo.setAmount(16);
                } else {
                    memo.setAmount(8);
                }
            }
        })
    }
};
handlers.setDifficultysetLevel();
handlers.startGame();