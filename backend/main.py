from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from system_stats import get_system_stats
import os

app = Flask(__name__, static_folder="../frontend/build")
CORS(app)

@app.route("/api/stats")
def stats():
    return jsonify(get_system_stats())
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)