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

@app.route("/get_tracks", methods=["GET"])
def get_tracks():
    tracks = {"tracks": {}}
    length=0
    static = Path(app.static_folder) / 'tracks'
    for playset in [path for path in static.iterdir() if path.is_dir()]:
        tracks["tracks"][playset.name] = []
        length += 1
        for track in [track.name for track in playset.glob("*")]:
            tracks["tracks"][playset.name].append(track)

    # tracks['length'] = length
    if request.method == "GET":
        return jsonify(tracks)

app.run(host="0.0.0.0")
