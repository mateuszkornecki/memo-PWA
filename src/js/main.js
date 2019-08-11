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

    shuffle: (array) => {
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
            if (memo.discoveredCards.length < 2) {
                console.log(e);
                let id = parseInt(e.toElement.id);
                const card = document.getElementById(id);
                card.classList.add('card-reverse', `card-reverse--${id}`);
                memo.discoveredCards.push(id);
            }
        })
    }
};

// const parent = document.querySelector('.parent');
// let discoveredCards = [];
// let cardsValue = [];
// const displayPairCounter = document.querySelector('.pair-counter');
// let pairCounter = 0;

//! Using Fisher-Yates Algorithm to shuffle an array >> got it from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
// const shuffle = (array) => {
//         for (let i = array.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * array.length)
//             const temp = array[i]
//             array[i] = array[j]
//             array[j] = temp
//         }
//     }
//     // Create 
// const createCards = (value) => {
//     const array = [];
//     for (let i = 0; i < (value); i++) {
//         array.push(i);
//     }
//     shuffle(array);
//     for (let i = 0; i < value; i++) {
//         const card = document.createElement('div');
//         card.className = 'card';
//         card.id = array[i];
//         parent.appendChild(card);
//         // GODMODE - comment code below to disable it
//         // card.innerHTML = array[i];
//     }
// }

// const game = () => {
//         parent.addEventListener('click', (e) => {
//             if (discoveredCards.length < 2 && e.target.className === 'card') {
//                 let id = parseInt(e.toElement.id);
//                 const card = document.getElementById(id);
//                 card.classList.add('card-reverse', `card-reverse--${id}`);
//                 discoveredCards.push(id);
//                 let card1 = document.getElementById(discoveredCards[0]);
//                 let card2 = document.getElementById(discoveredCards[1]);


//                 if (discoveredCards.length > 1) {
//                     let card1BackgroundColor = window.getComputedStyle(card1).getPropertyValue('background-color');
//                     let card2BackgroundColor = window.getComputedStyle(card2).getPropertyValue('background-color');
//                     console.log(card1BackgroundColor);
//                     console.log(card2BackgroundColor);
//                     // After finding pair
//                     if (card1BackgroundColor === card2BackgroundColor) {
//                         pairCounter++;
//                         displayPairCounter.innerHTML = `Znaleziono ${pairCounter} par!`
//                         discoveredCards.forEach(element => {
//                             const a = document.getElementById(element);
//                             a.classList.remove('card');
//                             discoveredCards = [];
//                         })
//                     } else {
//                         setTimeout(function() {
//                             discoveredCards.forEach(card => {
//                                 const a = document.getElementById(card);
//                                 a.classList.remove('card-reverse', `card-reverse--${card}`);
//                             })
//                             discoveredCards = [];
//                             cardsValue = [];

//                         }, 1500);

//                     }
//                 }
//             }
//         });
//     }
// createCards(12);
// game();