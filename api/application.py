from flask import Flask, request, jsonify
from flask_cors import CORS
from views import harmony

app = Flask(__name__)
CORS(app)
app.register_blueprint(harmony)


@app.route("foo", methods=["GET"])
def foo():
    return jsonify({"success": True, "result": {"message": "foo"}})
