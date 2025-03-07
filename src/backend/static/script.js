const translations = {
    en: {
        title: "BashoGO : Place Kanji Reading Guessing Game!",
        guess: "Enter your guess",
        correct: "Correct!",
        wrong: "Wrong guess, try again!",
        answer: "The answer was",
        giveup: "Give up",
        next: "Next",
        submit: "Submit"
    },
    ja: {
        title: "場所GO：地名漢字の読み方クイズ！",
        guess: "答えを入力してください",
        correct: "正解！",
        wrong: "間違った答えです。もう一度試してください！",
        answer: "答えは",
        giveup: "答えを見る",
        next: "次",
        submit: "提出"
    }
};

function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith("ja")) {
        return "ja";
    }
    return "en";
}

function applyTranslations() {
    const lang = getBrowserLanguage();
    document.querySelector("#title").innerText = translations[lang].title;
    document.querySelector("#guess").placeholder = translations[lang].guess;
    document.querySelector("#giveup").innerHTML = translations[lang].giveup;
    document.querySelector("#next").innerHTML = translations[lang].next;
    document.querySelector("#guessButton").innerHTML = translations[lang].submit;
}


window.onload = async function () {
    applyTranslations();
    document.getElementById("next").style.display = "none";
    await loadNewQuestion();
};
var input = document.getElementById("guess");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("guessButton").click();
  }
});
async function loadNewQuestion() {
    const response = await fetch('/random');
    const data = await response.json();
    document.getElementById('kanji').innerText = data.kanji;
    sessionStorage.setItem('kanji', data.kanji);
    sessionStorage.setItem('hiragana', data.hiragana);
    sessionStorage.setItem('romaji', data.romaji);
    initMap(data.latitude, data.longitude);
}
let score = 0;
async function submitGuess() {
    const guess = document.getElementById('guess').value;
    const kanji = sessionStorage.getItem('kanji');

    const response = await fetch('/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanji: kanji, guess: guess })
    });

    const result = await response.json();
    const corrMessage = getBrowserLanguage() === 'ja' ? translations.ja.correct : translations.en.correct;
    const wrMessage = getBrowserLanguage() === 'ja' ? translations.ja.wrong : translations.en.wrong;
    const resultElement = document.getElementById('result');
    resultElement.innerText = result.result === 'correct' ? '✅'+corrMessage : '❌'+wrMessage;

    if (result.result === 'correct') {
        document.getElementById('score').innerText = `Score: ${++score}`;
        setTimeout(() => {
            resultElement.innerText = '';
            document.getElementById('guess').value = '';
            loadNewQuestion();
        }, 2000);
    }
}
async function giveUp() {
    const kanji = sessionStorage.getItem('kanji');
    const hiragana = sessionStorage.getItem('hiragana');
    const romaji = sessionStorage.getItem('romaji');
    const corrMessage = getBrowserLanguage() === 'ja' ? translations.ja.answer : translations.en.answer;
    document.getElementById('preResult').innerText = corrMessage;
    document.getElementById('result').innerText= `${kanji} (${hiragana} - ${romaji})`;
    document.getElementById('next').style.display = "inline";
}
function applyTranslations(lang = getBrowserLanguage()) {
    document.querySelector("#title").innerText = translations[lang].title;
    document.querySelector("#guess").placeholder = translations[lang].guess;
}
function nextKanji() {
    document.getElementById('preResult').innerText = '';
    document.getElementById('result').innerText = '';
    document.getElementById('guess').value = '';
    document.getElementById('next').style.display = "none";
    loadNewQuestion();
}

let map;
function initMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    } else {
        map.setView([lat, lng], 10);
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    L.marker([lat, lng]).addTo(map);
}
