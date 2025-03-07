from flask import Flask, request, jsonify,render_template
import pandas as pd
import random

app = Flask(__name__)

# Load CSV into DataFrame
df = pd.read_csv('words/municipalities.csv')
df["name_romaji"] = df["name_romaji"].str.lower()
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/random', methods=['GET'])
def get_random_place():
    place = df.sample(1).iloc[0]
    return jsonify({"kanji": place["name_kanji"],
                    "latitude": place["latitude"],
                    "longitude": place["longitude"],
                    "hiragana": place["name_kana"],
                    "romaji": place["name_romaji"]})

@app.route('/guess', methods=['POST'])
def guess():
    data = request.json
    kanji = data.get("kanji")
    guess = data.get("guess")

    if not kanji or not guess:
        return jsonify({"error": "Invalid request"}), 400

    place = df[df["name_kanji"] == kanji]

    if place.empty:
        return jsonify({"error": "Kanji not found"}), 404

    correct_readings = {place["name_kana"].values[0], place["name_romaji"].values[0]}

    if guess in correct_readings:
        return jsonify({"result": "correct"})
    else:
        return jsonify({"result": "incorrect"})

if __name__ == '__main__':
    app.run(debug=True)
