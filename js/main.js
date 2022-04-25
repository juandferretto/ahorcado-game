const getWord = async () => {
    try {
        preLoader('init');
        const call = await fetch('https://restcountries.com/v3.1/all');
        const respJson = await call.json();
        const index = Math.round(Math.random() * (respJson.length - 0) + 0);
        preLoader('finish');
        document.querySelector("#help").addEventListener("click", () => {
            helper(respJson[index]);
        });
        initGame(respJson[index]);
    } catch (error) {
        console.log(error);
    }

}

let amount = 1;
let score = 0;
let correctLetters = [];

const initGame = (word) => {
    const containerWord = document.querySelector("#word");
    const img = document.getElementById("hanged-img");
    img.children[0].style.display = 'none';
    containerWord.innerHTML = '';
    let cont = 0;
    for (const divLetter of word.translations.spa.common) {
        if (divLetter != " ") {
            containerWord.innerHTML += `<div id="${cont}" class="each-letter-word"></div>`
        } else {
            containerWord.innerHTML += `<div class="space"></div>`
        }
        cont++;
    }
    const containerLetters = document.querySelector("#container-letters");
    containerLetters.innerHTML = '';
    for (const letter of letters) {
        containerLetters.innerHTML += `<button name=${letter} class="each-letter">
                                            ${letter}
                                       </button>`

        const addEvent = document.querySelectorAll(".each-letter");
        addEvent.forEach(eventLetter => eventLetter.addEventListener("click", (e) => {
            findIndexLetter(e, normalizeWord(word.translations.spa.common));
        }))
    }
}

const findIndexLetter = (e, word) => {
    const target = e.target;
    const letter = target.name;
    const arrayWord = Array.from(word);
    const findLetter = [];
    for (let i = 0; i < arrayWord.length; i++) {
        if (arrayWord[i].toUpperCase() == letter.toUpperCase()) {
            findLetter.push(i);
        }
    }
    putLetter(findLetter, letter, target, word);
}

const putLetter = (arrayLetter, letter, target, word) => {
    if (amount != 7) {
        if (arrayLetter.length == 0) {
            const img = document.getElementById("hanged-img");
            img.children[0].setAttribute('src', `./assets/${amount}.jpg`)
            img.children[0].style.display = 'block';
            img.children[0].setAttribute('alt', './assets/1.jpg')
            target.setAttribute('disabled', '');
            target.setAttribute('id', 'disabled');
            amount++;
            errorLetter(letter);
            if (amount == 7) {
                amount = 1;
                correctLetters = [];
                showLostMsg(word);
            }
        } else {
            for (const id of arrayLetter) {
                document.getElementById(`${id}`).innerHTML = `<div class="${id}">${letter}</div>`;
                target.setAttribute('disabled', '');
                target.setAttribute('id', 'disabled');
            }
            correctLetters.length === 0 ? correctLetters.push(arrayLetter.length) : correctLetters[0] += arrayLetter.length;
            addScore();
            checkWin(word);
        }
    }
}

const showLostMsg = (word) => {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: `¡Perdiste! La palabra era ${word}`,
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        showButton();
        getWord();
    })
}

const checkWin = (word) => {
    const wordSplit = word.split(' ').join('');
    if (Array.from(wordSplit).length === correctLetters[0]) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `¡Ganaste! Felicitaciones`,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            correctLetters = [];
            amount = 1;
            showButton();
            getWord();
        })
    }
}

const helper = (flag) => {
    document.querySelector("#flag").innerHTML = `<img src="${flag.flags.png}" class="img-flag">`
    document.querySelector('#help').style.display = 'none';
}

const normalizeWord = (word) => {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const showButton = () => {
    document.querySelector("#flag").innerHTML = '';
    document.querySelector("#help").style.display = 'block';
}

const errorLetter = () => {
    const containerError = document.querySelector("#error");
    containerError.style.display = "flex";
    setTimeout(() => {
        containerError.style.display = "none";
    }, 1500);
}

const addScore = () => {
    const numberScore = document.querySelector("#number-score");
    score += 10;
    numberScore.innerHTML = score;
}

const preLoader = (condition) => {
    if (condition == "init") {
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('container-board').style.display = 'none';
    } else {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('container-board').style.display = 'flex';
    }
}

getWord();
