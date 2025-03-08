from flask import Flask, request, jsonify,render_template
import pandas as pd
import random
import re
import cutlet

app = Flask(__name__)

# Local testing
# df = pd.read_csv('src/backend/words/dataset.csv')
# Production
df = pd.read_csv('backend/words/dataset.csv')

# Re-romanize dataset
# roman = cutlet.Cutlet()
# roman.use_foreign_spelling = False
# df = df.dropna(subset=["name_kana"])
# df["name_romaji"] = df["name_kana"].map(lambda x: roman.map_kana(x) if x else None)
# df["name_romaji"] = df["name_romaji"].str.replace(" ", "").str.lower()
# df["name_romaji"] = df["name_romaji"].apply(lambda x: re.sub(r'[^a-zA-Z]', '', x).strip())
# df.to_csv('src/backend/words/dataset.csv', index=False)
# print(df["name_romaji"].head())

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
    guess = guess.lower().replace(" ", "") if guess else None
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
