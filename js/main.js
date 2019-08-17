!function(g){var I={};function C(A){if(I[A])return I[A].exports;var c=I[A]={i:A,l:!1,exports:{}};return g[A].call(c.exports,c,c.exports,C),c.l=!0,c.exports}C.m=g,C.c=I,C.d=function(g,I,A){C.o(g,I)||Object.defineProperty(g,I,{enumerable:!0,get:A})},C.r=function(g){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(g,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(g,"__esModule",{value:!0})},C.t=function(g,I){if(1&I&&(g=C(g)),8&I)return g;if(4&I&&"object"==typeof g&&g&&g.__esModule)return g;var A=Object.create(null);if(C.r(A),Object.defineProperty(A,"default",{enumerable:!0,value:g}),2&I&&"string"!=typeof g)for(var c in g)C.d(A,c,function(I){return g[I]}.bind(null,c));return A},C.n=function(g){var I=g&&g.__esModule?function(){return g.default}:function(){return g};return C.d(I,"a",I),I},C.o=function(g,I){return Object.prototype.hasOwnProperty.call(g,I)},C.p="",C(C.s=0)}([function(module,exports,__webpack_require__){"use strict";eval("\n\n// service worker registration - remove if you're not going to use it\n\nif ('serviceWorker' in navigator) {\n    window.addEventListener('load', function() {\n        navigator.serviceWorker.register('serviceworker.js').then(function(registration) {\n            // Registration was successful\n            console.log('ServiceWorker registration successful with scope: ', registration.scope);\n        }, function(err) {\n            // registration failed :(\n            console.log('ServiceWorker registration failed: ', err);\n        });\n    });\n}\n\n// place your code below\n\nconst memo = {\n    cards: [],\n    discoveredCards: [],\n    pairs: [],\n\n    shuffle(array) {\n        // Using Fisher-Yates Algorithm to shuffle an array \n        // got it from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb\n        for (let i = array.length - 1; i > 0; i--) {\n            const j = Math.floor(Math.random() * array.length)\n            const temp = array[i]\n            array[i] = array[j]\n            array[j] = temp\n        }\n    },\n    setAmount(value) {\n        this.cards.length = 0;\n        for (let i = 0; i < value; i++) {\n            this.cards.push(i);\n        }\n    },\n    createCards() {\n        this.shuffle(this.cards);\n        this.cards.forEach((cardId) => {\n            const board = document.querySelector('.board');\n            const card = document.createElement('div');\n            card.className = 'card';\n            card.id = memo.cards[cardId];\n            //! uncomment line below to turn on godmode\n            // card.innerHTML = memo.cards[cardId];\n            board.appendChild(card);\n        });\n    },\n    searchPairs() {\n        const board = document.querySelector('.board');\n        board.addEventListener('click', (e) => {\n            if (this.discoveredCards.length < 2 && e.target.className === 'card') {\n                let id = parseInt(e.target.id);\n                const card = document.getElementById(id);\n                card.classList.add('card-reverse', `card-reverse--${id}`);\n                this.discoveredCards.push(id);\n                this.checkPairs();\n                counters.score();\n            }\n        })\n    },\n    checkPairs() {\n        if (this.discoveredCards.length > 1) {\n            let card1 = document.getElementById(this.discoveredCards[0]);\n            let card2 = document.getElementById(this.discoveredCards[1]);\n            let card1BackgroundColor = window.getComputedStyle(card1).getPropertyValue('background-color');\n            let card2BackgroundColor = window.getComputedStyle(card2).getPropertyValue('background-color');\n            if (card1BackgroundColor === card2BackgroundColor) {\n                this.pairs.push(this.discoveredCards[0], this.discoveredCards[1]);\n                card1.classList.add('card--hidden');\n                card2.classList.add('card--hidden');\n                card1.classList.remove('card');\n                card2.classList.remove('card');\n                this.discoveredCards.length = 0;\n            } else {\n                counters.moveCounter();\n                setTimeout(() => {\n                    this.discoveredCards.forEach(card => {\n                        const a = document.getElementById(card);\n                        a.classList.remove('card-reverse', `card-reverse--${card}`);\n                    })\n                    this.discoveredCards.length = 0;\n                }, 1000);\n            }\n        }\n    }\n};\n\nconst counters = {\n    wrongMoves: [0],\n    finalScore: [],\n    score() {\n        const pairsCounter = document.querySelector('.pairs-counter');\n        let pairsAmount = memo.pairs.length / 2\n            //add 10 point for every pair and remove 2 points for every miss\n        let score = pairsAmount * 10 - this.wrongMoves * 2;\n        pairsCounter.innerHTML = score;\n\n        if (pairsAmount === memo.cards.length / 2) {\n            console.log('Gratulacje - wygrałeś grę');\n            this.finalScore.push(score);\n            //clean up board\n            const board = document.querySelector('.board');\n            board.innerHTML = '';\n\n            handlers.playAgain();\n        }\n    },\n    moveCounter() {\n        //count moves without finding pairs\n        this.wrongMoves[0]++\n    },\n    saveScore() {\n        //TODO allow user to use same name multiple time\n        if (this.finalScore.length > 0) {\n            let userName = localStorage.getItem('User Name');\n            class User {\n                constructor(name, score) {\n                    this.name = name;\n                    this.score = score;\n                }\n            }\n            let user = new User(userName, this.finalScore[0]);\n            console.log(user);\n            localStorage.setItem(userName, JSON.stringify(user));\n            this.finalScore.length = 0;\n        }\n    }\n}\n\nconst handlers = {\n    startGame() {\n        const startButton = document.querySelector('.start-button');\n        const scoreTitle = document.querySelector('.header__heading');\n        const pairsCounter = document.querySelector('.pairs-counter');\n        const footer = document.querySelector('.footer');\n        startButton.addEventListener('click', (e) => {\n            //reset counter value\n            pairsCounter.innerHTML = 0;\n            scoreTitle.innerHTML = 'score';\n            memo.createCards();\n            memo.searchPairs();\n            startButton.classList.add('hidden');\n            const setLevel = document.querySelector('.set-level');\n            setLevel.classList.add('hidden');\n            footer.classList.add('hidden');\n            this.hideScoreBoard()\n        })\n    },\n    playAgain() {\n        this.createUser();\n        memo.discoveredCards.length = 0;\n        memo.pairs.length = 0;\n        counters.wrongMoves[0] = 0;\n        const startButton = document.querySelector('.start-button');\n        const setLevel = document.querySelector('.set-level');\n        const playAgainButton = document.querySelector('.play-again-button');\n        startButton.classList.remove('hidden');\n        startButton.innerHTML = 'play again';\n        setLevel.classList.remove('hidden');\n\n    },\n    setDifficulty() {\n        const setLevel = document.querySelector('.set-level');\n        const radioButtonEasy = document.querySelector('.radio-button--easy');\n        const radioButtonMedium = document.querySelector('.radio-button--medium');\n        const radioButtonHard = document.querySelector('.radio-button--hard');\n        const board = document.querySelector('.board');\n        //default difficulty value - EASY\n        memo.setAmount(8);\n        board.classList.add('board--easy');\n        //change difficulty value on click \n        setLevel.addEventListener('click', (e) => {\n            switch (e.target.id) {\n                case 'radio-button--easy':\n                    memo.setAmount(8);\n                    board.classList.add('board--easy');\n                    if (board.classList === 'board--medium') {\n                        board.classList.remove('board--medium');\n                    }\n                    if (board.classList === 'board--hard') {\n                        board.classList.remove('board--hard');\n                    }\n                    break;\n                case 'radio-button--medium':\n                    memo.setAmount(12);\n                    board.classList.add('board--medium');\n                    if (board.classList === 'board--easy') {\n                        board.classList.remove('board--easy');\n                    }\n                    if (board.classList === 'board--hard') {\n                        board.classList.remove('board--hard');\n                    }\n                    break;\n                case 'radio-button--hard':\n                    memo.setAmount(16);\n                    board.classList.add('board--hard');\n                    if (board.classList === 'board--easy') {\n                        board.classList.remove('board--easy');\n                    }\n                    if (board.classList === 'board--medium') {\n                        board.classList.remove('board--medium');\n                    }\n                    break;\n            }\n        })\n    },\n    createUser() {\n        const userInput = document.querySelector('.username');\n        const userSection = document.querySelector('.user');\n        userSection.classList.remove('hidden');\n        userInput.addEventListener('keyup', (e) => {\n            let userName = userInput.value;\n            if (e.keyCode === 13) {\n                if (localStorage.getItem(userName)) {\n                    alert('Nazwa zajęta, wprowadź nową');\n                } else {\n                    localStorage.setItem('User Name', userName);\n                    counters.saveScore();\n                    userSection.classList.add('hidden');\n                    userInput.value = '';\n                }\n                handlers.createScoreBoard();\n            }\n        })\n\n    },\n    createScoreBoard() {\n        const scoreBoard = document.querySelector('.scoreboard');\n        const scoreBoardList = document.querySelector('.scoreboard__list');\n        scoreBoard.classList.remove('hidden');\n        const users = [];\n        for (let i = 0; i < localStorage.length; i++) {\n            let key = localStorage.key(i);\n            // IF its not empty object - \"User Name\", print all entries and parse it to JSON\n            if (key != 'User Name') {\n                let user = JSON.parse(localStorage.getItem(localStorage.key(i)));\n                users.push(user);\n            }\n            // THEN sort array of objects by value\n            //got it from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort\n            users.sort(function(a, b) {\n                return a.score - b.score;\n            });\n            users.reverse();\n            //slice it to show only top 10 scores\n            if (users.length > 10) {\n                users.splice(10);\n            }\n        }\n        // create ordered list with top scores\n        users.forEach((user, index) => {\n            const li = document.createElement('li');\n            li.classname = 'scoreboard__item';\n            scoreBoardList.appendChild(li);\n            li.innerHTML = ` ${user.name} ${user.score}`;\n        })\n\n    },\n    hideScoreBoard() {\n        const scoreBoard = document.querySelector('.scoreboard');\n        scoreBoard.classList.add('hidden')\n    }\n\n};\nhandlers.setDifficulty();\nhandlers.startGame();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLE9BQU87QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLEdBQUc7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLEtBQUs7QUFDakYscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixVQUFVLEdBQUcsV0FBVztBQUN2RCxTQUFTOztBQUVULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vLyBzZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gLSByZW1vdmUgaWYgeW91J3JlIG5vdCBnb2luZyB0byB1c2UgaXRcblxuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3Rlcignc2VydmljZXdvcmtlci5qcycpLnRoZW4oZnVuY3Rpb24ocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgICAgICAvLyBSZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGU6ICcsIHJlZ2lzdHJhdGlvbi5zY29wZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJywgZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8vIHBsYWNlIHlvdXIgY29kZSBiZWxvd1xuXG5jb25zdCBtZW1vID0ge1xuICAgIGNhcmRzOiBbXSxcbiAgICBkaXNjb3ZlcmVkQ2FyZHM6IFtdLFxuICAgIHBhaXJzOiBbXSxcblxuICAgIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgICAgLy8gVXNpbmcgRmlzaGVyLVlhdGVzIEFsZ29yaXRobSB0byBzaHVmZmxlIGFuIGFycmF5IFxuICAgICAgICAvLyBnb3QgaXQgZnJvbSBodHRwczovL21lZGl1bS5jb20vQG5pdGlucGF0ZWxfMjAyMzYvaG93LXRvLXNodWZmbGUtY29ycmVjdGx5LXNodWZmbGUtYW4tYXJyYXktaW4tamF2YXNjcmlwdC0xNWVhM2Y4NGJmYlxuICAgICAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aClcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBhcnJheVtpXVxuICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtqXVxuICAgICAgICAgICAgYXJyYXlbal0gPSB0ZW1wXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEFtb3VudCh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNhcmRzLmxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWU7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjcmVhdGVDYXJkcygpIHtcbiAgICAgICAgdGhpcy5zaHVmZmxlKHRoaXMuY2FyZHMpO1xuICAgICAgICB0aGlzLmNhcmRzLmZvckVhY2goKGNhcmRJZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQnKTtcbiAgICAgICAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xuICAgICAgICAgICAgY2FyZC5pZCA9IG1lbW8uY2FyZHNbY2FyZElkXTtcbiAgICAgICAgICAgIC8vISB1bmNvbW1lbnQgbGluZSBiZWxvdyB0byB0dXJuIG9uIGdvZG1vZGVcbiAgICAgICAgICAgIC8vIGNhcmQuaW5uZXJIVE1MID0gbWVtby5jYXJkc1tjYXJkSWRdO1xuICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2FyZCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2VhcmNoUGFpcnMoKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXJkJyk7XG4gICAgICAgIGJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2NvdmVyZWRDYXJkcy5sZW5ndGggPCAyICYmIGUudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NhcmQnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcGFyc2VJbnQoZS50YXJnZXQuaWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdjYXJkLXJldmVyc2UnLCBgY2FyZC1yZXZlcnNlLS0ke2lkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzY292ZXJlZENhcmRzLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQYWlycygpO1xuICAgICAgICAgICAgICAgIGNvdW50ZXJzLnNjb3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBjaGVja1BhaXJzKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNjb3ZlcmVkQ2FyZHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IGNhcmQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXNjb3ZlcmVkQ2FyZHNbMF0pO1xuICAgICAgICAgICAgbGV0IGNhcmQyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXNjb3ZlcmVkQ2FyZHNbMV0pO1xuICAgICAgICAgICAgbGV0IGNhcmQxQmFja2dyb3VuZENvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY2FyZDEpLmdldFByb3BlcnR5VmFsdWUoJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAgICAgICAgIGxldCBjYXJkMkJhY2tncm91bmRDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhcmQyKS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgICAgICAgICBpZiAoY2FyZDFCYWNrZ3JvdW5kQ29sb3IgPT09IGNhcmQyQmFja2dyb3VuZENvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWlycy5wdXNoKHRoaXMuZGlzY292ZXJlZENhcmRzWzBdLCB0aGlzLmRpc2NvdmVyZWRDYXJkc1sxXSk7XG4gICAgICAgICAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnY2FyZC0taGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnY2FyZC0taGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgY2FyZDEuY2xhc3NMaXN0LnJlbW92ZSgnY2FyZCcpO1xuICAgICAgICAgICAgICAgIGNhcmQyLmNsYXNzTGlzdC5yZW1vdmUoJ2NhcmQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2NvdmVyZWRDYXJkcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3VudGVycy5tb3ZlQ291bnRlcigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2NvdmVyZWRDYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5jbGFzc0xpc3QucmVtb3ZlKCdjYXJkLXJldmVyc2UnLCBgY2FyZC1yZXZlcnNlLS0ke2NhcmR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY292ZXJlZENhcmRzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBjb3VudGVycyA9IHtcbiAgICB3cm9uZ01vdmVzOiBbMF0sXG4gICAgZmluYWxTY29yZTogW10sXG4gICAgc2NvcmUoKSB7XG4gICAgICAgIGNvbnN0IHBhaXJzQ291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWlycy1jb3VudGVyJyk7XG4gICAgICAgIGxldCBwYWlyc0Ftb3VudCA9IG1lbW8ucGFpcnMubGVuZ3RoIC8gMlxuICAgICAgICAgICAgLy9hZGQgMTAgcG9pbnQgZm9yIGV2ZXJ5IHBhaXIgYW5kIHJlbW92ZSAyIHBvaW50cyBmb3IgZXZlcnkgbWlzc1xuICAgICAgICBsZXQgc2NvcmUgPSBwYWlyc0Ftb3VudCAqIDEwIC0gdGhpcy53cm9uZ01vdmVzICogMjtcbiAgICAgICAgcGFpcnNDb3VudGVyLmlubmVySFRNTCA9IHNjb3JlO1xuXG4gICAgICAgIGlmIChwYWlyc0Ftb3VudCA9PT0gbWVtby5jYXJkcy5sZW5ndGggLyAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR3JhdHVsYWNqZSAtIHd5Z3JhxYJlxZsgZ3LEmScpO1xuICAgICAgICAgICAgdGhpcy5maW5hbFNjb3JlLnB1c2goc2NvcmUpO1xuICAgICAgICAgICAgLy9jbGVhbiB1cCBib2FyZFxuICAgICAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQnKTtcbiAgICAgICAgICAgIGJvYXJkLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgICAgICBoYW5kbGVycy5wbGF5QWdhaW4oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbW92ZUNvdW50ZXIoKSB7XG4gICAgICAgIC8vY291bnQgbW92ZXMgd2l0aG91dCBmaW5kaW5nIHBhaXJzXG4gICAgICAgIHRoaXMud3JvbmdNb3Zlc1swXSsrXG4gICAgfSxcbiAgICBzYXZlU2NvcmUoKSB7XG4gICAgICAgIC8vVE9ETyBhbGxvdyB1c2VyIHRvIHVzZSBzYW1lIG5hbWUgbXVsdGlwbGUgdGltZVxuICAgICAgICBpZiAodGhpcy5maW5hbFNjb3JlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCB1c2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVc2VyIE5hbWUnKTtcbiAgICAgICAgICAgIGNsYXNzIFVzZXIge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKG5hbWUsIHNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgPSBzY29yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdXNlciA9IG5ldyBVc2VyKHVzZXJOYW1lLCB0aGlzLmZpbmFsU2NvcmVbMF0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh1c2VyTmFtZSwgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xuICAgICAgICAgICAgdGhpcy5maW5hbFNjb3JlLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGhhbmRsZXJzID0ge1xuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtYnV0dG9uJyk7XG4gICAgICAgIGNvbnN0IHNjb3JlVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19oZWFkaW5nJyk7XG4gICAgICAgIGNvbnN0IHBhaXJzQ291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWlycy1jb3VudGVyJyk7XG4gICAgICAgIGNvbnN0IGZvb3RlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKTtcbiAgICAgICAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgLy9yZXNldCBjb3VudGVyIHZhbHVlXG4gICAgICAgICAgICBwYWlyc0NvdW50ZXIuaW5uZXJIVE1MID0gMDtcbiAgICAgICAgICAgIHNjb3JlVGl0bGUuaW5uZXJIVE1MID0gJ3Njb3JlJztcbiAgICAgICAgICAgIG1lbW8uY3JlYXRlQ2FyZHMoKTtcbiAgICAgICAgICAgIG1lbW8uc2VhcmNoUGFpcnMoKTtcbiAgICAgICAgICAgIHN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgY29uc3Qgc2V0TGV2ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0LWxldmVsJyk7XG4gICAgICAgICAgICBzZXRMZXZlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGZvb3Rlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZVNjb3JlQm9hcmQoKVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgcGxheUFnYWluKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZVVzZXIoKTtcbiAgICAgICAgbWVtby5kaXNjb3ZlcmVkQ2FyZHMubGVuZ3RoID0gMDtcbiAgICAgICAgbWVtby5wYWlycy5sZW5ndGggPSAwO1xuICAgICAgICBjb3VudGVycy53cm9uZ01vdmVzWzBdID0gMDtcbiAgICAgICAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtYnV0dG9uJyk7XG4gICAgICAgIGNvbnN0IHNldExldmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNldC1sZXZlbCcpO1xuICAgICAgICBjb25zdCBwbGF5QWdhaW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheS1hZ2Fpbi1idXR0b24nKTtcbiAgICAgICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIHN0YXJ0QnV0dG9uLmlubmVySFRNTCA9ICdwbGF5IGFnYWluJztcbiAgICAgICAgc2V0TGV2ZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cbiAgICB9LFxuICAgIHNldERpZmZpY3VsdHkoKSB7XG4gICAgICAgIGNvbnN0IHNldExldmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNldC1sZXZlbCcpO1xuICAgICAgICBjb25zdCByYWRpb0J1dHRvbkVhc3kgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFkaW8tYnV0dG9uLS1lYXN5Jyk7XG4gICAgICAgIGNvbnN0IHJhZGlvQnV0dG9uTWVkaXVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJhZGlvLWJ1dHRvbi0tbWVkaXVtJyk7XG4gICAgICAgIGNvbnN0IHJhZGlvQnV0dG9uSGFyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yYWRpby1idXR0b24tLWhhcmQnKTtcbiAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQnKTtcbiAgICAgICAgLy9kZWZhdWx0IGRpZmZpY3VsdHkgdmFsdWUgLSBFQVNZXG4gICAgICAgIG1lbW8uc2V0QW1vdW50KDgpO1xuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKCdib2FyZC0tZWFzeScpO1xuICAgICAgICAvL2NoYW5nZSBkaWZmaWN1bHR5IHZhbHVlIG9uIGNsaWNrIFxuICAgICAgICBzZXRMZXZlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGUudGFyZ2V0LmlkKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncmFkaW8tYnV0dG9uLS1lYXN5JzpcbiAgICAgICAgICAgICAgICAgICAgbWVtby5zZXRBbW91bnQoOCk7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLS1lYXN5Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib2FyZC5jbGFzc0xpc3QgPT09ICdib2FyZC0tbWVkaXVtJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnYm9hcmQtLW1lZGl1bScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChib2FyZC5jbGFzc0xpc3QgPT09ICdib2FyZC0taGFyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2JvYXJkLS1oYXJkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncmFkaW8tYnV0dG9uLS1tZWRpdW0nOlxuICAgICAgICAgICAgICAgICAgICBtZW1vLnNldEFtb3VudCgxMik7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLS1tZWRpdW0nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvYXJkLmNsYXNzTGlzdCA9PT0gJ2JvYXJkLS1lYXN5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnYm9hcmQtLWVhc3knKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYm9hcmQuY2xhc3NMaXN0ID09PSAnYm9hcmQtLWhhcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdib2FyZC0taGFyZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3JhZGlvLWJ1dHRvbi0taGFyZCc6XG4gICAgICAgICAgICAgICAgICAgIG1lbW8uc2V0QW1vdW50KDE2KTtcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQuY2xhc3NMaXN0LmFkZCgnYm9hcmQtLWhhcmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvYXJkLmNsYXNzTGlzdCA9PT0gJ2JvYXJkLS1lYXN5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnYm9hcmQtLWVhc3knKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYm9hcmQuY2xhc3NMaXN0ID09PSAnYm9hcmQtLW1lZGl1bScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2JvYXJkLS1tZWRpdW0nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGNyZWF0ZVVzZXIoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybmFtZScpO1xuICAgICAgICBjb25zdCB1c2VyU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VyJyk7XG4gICAgICAgIHVzZXJTZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICB1c2VySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHVzZXJOYW1lID0gdXNlcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0odXNlck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdOYXp3YSB6YWrEmXRhLCB3cHJvd2Fkxbogbm93xIUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlciBOYW1lJywgdXNlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVycy5zYXZlU2NvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdXNlclNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoYW5kbGVycy5jcmVhdGVTY29yZUJvYXJkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9LFxuICAgIGNyZWF0ZVNjb3JlQm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IHNjb3JlQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NvcmVib2FyZCcpO1xuICAgICAgICBjb25zdCBzY29yZUJvYXJkTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY29yZWJvYXJkX19saXN0Jyk7XG4gICAgICAgIHNjb3JlQm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIGNvbnN0IHVzZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcbiAgICAgICAgICAgIC8vIElGIGl0cyBub3QgZW1wdHkgb2JqZWN0IC0gXCJVc2VyIE5hbWVcIiwgcHJpbnQgYWxsIGVudHJpZXMgYW5kIHBhcnNlIGl0IHRvIEpTT05cbiAgICAgICAgICAgIGlmIChrZXkgIT0gJ1VzZXIgTmFtZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlLmtleShpKSkpO1xuICAgICAgICAgICAgICAgIHVzZXJzLnB1c2godXNlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUSEVOIHNvcnQgYXJyYXkgb2Ygb2JqZWN0cyBieSB2YWx1ZVxuICAgICAgICAgICAgLy9nb3QgaXQgZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zb3J0XG4gICAgICAgICAgICB1c2Vycy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5zY29yZSAtIGIuc2NvcmU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVzZXJzLnJldmVyc2UoKTtcbiAgICAgICAgICAgIC8vc2xpY2UgaXQgdG8gc2hvdyBvbmx5IHRvcCAxMCBzY29yZXNcbiAgICAgICAgICAgIGlmICh1c2Vycy5sZW5ndGggPiAxMCkge1xuICAgICAgICAgICAgICAgIHVzZXJzLnNwbGljZSgxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY3JlYXRlIG9yZGVyZWQgbGlzdCB3aXRoIHRvcCBzY29yZXNcbiAgICAgICAgdXNlcnMuZm9yRWFjaCgodXNlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICAgIGxpLmNsYXNzbmFtZSA9ICdzY29yZWJvYXJkX19pdGVtJztcbiAgICAgICAgICAgIHNjb3JlQm9hcmRMaXN0LmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IGAgJHt1c2VyLm5hbWV9ICR7dXNlci5zY29yZX1gO1xuICAgICAgICB9KVxuXG4gICAgfSxcbiAgICBoaWRlU2NvcmVCb2FyZCgpIHtcbiAgICAgICAgY29uc3Qgc2NvcmVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY29yZWJvYXJkJyk7XG4gICAgICAgIHNjb3JlQm9hcmQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB9XG5cbn07XG5oYW5kbGVycy5zZXREaWZmaWN1bHR5KCk7XG5oYW5kbGVycy5zdGFydEdhbWUoKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n")}]);