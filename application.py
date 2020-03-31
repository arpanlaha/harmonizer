import os
from flask import Flask, Response
from flask_cors import CORS
from views.harmony import harmony

app = Flask(__name__)
CORS(app)
app.register_blueprint(harmony)
