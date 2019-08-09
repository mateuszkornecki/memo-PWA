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

const parent = document.querySelector('.parent');
const array = [];
let pairs = [];
let counter = 0;


parent.addEventListener('click', (e) => {
    counter++;
    if (counter <= 2 && e.target.className === 'card') {
        let id = parseInt(e.toElement.id);
        const card = document.getElementById(id);
        card.classList.add('card--reverse');
        array.push(id);
        pairs.push(card.innerHTML);
        if (pairs[0] === pairs[1]) {
            console.log('PARA')
            pairs = [];
            counter = 0;
        }
    } else {
        counter = 0;
        pairs = [];
        array.forEach(element => {
            const a = document.getElementById(element);
            a.classList.remove('card--reverse');
        })
    }
});