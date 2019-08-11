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

    shuffle: (array) => {
        // Using Fisher-Yates Algorithm to shuffle an array >> got it from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * array.length)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    },
    setAmount: (value) => {
        for (let i = 0; i < value; i++) {
            memo.cards.push(i);
        }
        memo.shuffle(memo.cards);
    },
    createCards: () => {
        memo.cards.forEach((cardId) => {
            parent = document.querySelector('.parent');
            const card = document.createElement('div');
            card.className = 'card';
            card.id = memo.cards[cardId];
            parent.appendChild(card);
        });
    },
    searchPairs: () => {
        parent = document.querySelector('.parent');
        parent.addEventListener('click', (e) => {
            if (memo.discoveredCards.length < 2 && e.target.className === 'card') {
                let id = parseInt(e.toElement.id);
                const card = document.getElementById(id);
                card.classList.add('card-reverse', `card-reverse--${id}`);
                memo.discoveredCards.push(id);
            }
            memo.checkPairs();
            memo.pairCounter();

        })
    },
    checkPairs: () => {
        if (memo.discoveredCards.length > 1) {
            let card1 = document.getElementById(memo.discoveredCards[0]);
            let card2 = document.getElementById(memo.discoveredCards[1]);
            let card1BackgroundColor = window.getComputedStyle(card1).getPropertyValue('background-color');
            let card2BackgroundColor = window.getComputedStyle(card2).getPropertyValue('background-color');
            if (card1BackgroundColor === card2BackgroundColor) {
                memo.pairs.push(memo.discoveredCards[0], memo.discoveredCards[1]);
                console.log(memo.pairs);
                card1.classList.add('card--hidden');
                card2.classList.add('card--hidden');
                card1.classList.remove('card');
                card2.classList.remove('card');
                memo.discoveredCards.length = 0;
            } else {
                setTimeout(() => {
                    memo.discoveredCards.forEach(card => {
                        const a = document.getElementById(card);
                        a.classList.remove('card-reverse', `card-reverse--${card}`);
                    })
                    memo.discoveredCards.length = 0;
                }, 1000);
            }
        }
    },
    pairCounter: () => {
        const pairsCounter = document.querySelector('.pairs-counter');
        let pairsAmount = memo.pairs.length / 2
        if (pairsAmount >= 1) {
            console.log(typeof(pairsAmount));
            console.log(pairsAmount);
            pairsCounter.innerHTML = `Liczba odkrytych par: ${pairsAmount}`;
            if (pairsAmount === memo.cards.length / 2) {
                alert('Gratulacje - wygrałeś grę');
            }
        }
    },
};

const handlers = {
    startGame: () => {
        const startButton = document.querySelector('.start-button');
        startButton.addEventListener('click', (e) => {
            memo.setAmount(4);
            memo.createCards();
            memo.searchPairs();
            startButton.classList.add('start-button--hidden');
        })
    }
}
handlers.startGame();
// memo.setAmount(16);
// memo.createCards();
// memo.searchPairs();