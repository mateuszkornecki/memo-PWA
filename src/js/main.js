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
        // console.log(this);
        for (let i = 0; i < value; i++) {
            this.cards.push(i);
        }
        this.shuffle(memo.cards);
    },
    createCards: function() {
        this.cards.forEach((cardId) => {
            parent = document.querySelector('.parent');
            const card = document.createElement('div');
            card.className = 'card';
            card.id = memo.cards[cardId];
            parent.appendChild(card);
        });
    },
    searchPairs: function() {
        parent = document.querySelector('.parent');
        parent.addEventListener('click', (e) => {
            if (memo.discoveredCards.length < 2 && e.target.className === 'card') {
                let id = parseInt(e.toElement.id);
                const card = document.getElementById(id);
                card.classList.add('card-reverse', `card-reverse--${id}`);
                memo.discoveredCards.push(id);
                memo.checkPairs();
                memo.pairCounter();
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
                alert('Gratulacje - wygrałeś grę');
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
        })
    },
    setDifficultyLevel: function() {
        const level = document.querySelector('.level');
        const radioButtonBegginer = document.querySelector('.radio-button--begginer');
        const radioButtonMedium = document.querySelector('.radio-button--medium');
        level.addEventListener('click', (e) => {
            if (e.toElement.checked === true && e.toElement.className === 'radio-button--begginer') {
                memo.setAmount(8);
                console.log('begg');

            } else if (e.toElement.className === 'radio-button--medium') {
                memo.setAmount(16);
                console.log('medium');
            }
        })


    }
};
handlers.setDifficultyLevel();
handlers.startGame();