import os
from flask import Flask, Response
from views.harmony import harmony

app = Flask(__name__)
# app.register_blueprint(harmony)
@app.route("/")
def hello():
    return "Hello World!"
