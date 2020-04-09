from flask import Flask, request, jsonify
from flask_cors import CORS
from views import harmony, overlay

app = Flask(__name__)
CORS(app)
app.register_blueprint(harmony)
app.register_blueprint(overlay)
