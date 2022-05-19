from pathlib import Path
from flask import Flask, render_template, make_response, request, url_for, jsonify


app = Flask(__name__)

@app.route("/")
def index():
    title = "SoundBoard"
    return render_template("index.html", title=title)

@app.route("/get_sounds", methods=["GET"])
def get_sounds():
    static = Path(app.static_folder) / 'music'
    music = {"music": [path.name for path in static.glob("*")]}
    if request.method == "GET":
        return jsonify(music)
    else:
        return "Not found", 404

app.run(host="0.0.0.0")
