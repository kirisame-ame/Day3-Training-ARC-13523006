window.onload = async function () {
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

async function submitGuess() {
    const guess = document.getElementById('guess').value;
    const kanji = sessionStorage.getItem('kanji');

    const response = await fetch('/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanji: kanji, guess: guess })
    });

    const result = await response.json();
    const resultElement = document.getElementById('result');
    resultElement.innerText = result.result === 'correct' ? '✅ Correct!' : '❌ Incorrect!';

    if (result.result === 'correct') {
        setTimeout(() => {
            resultElement.innerText = '';
            document.getElementById('guess').value = '';
            loadNewQuestion();
        }, 2000);
    }
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
