from flask import Blueprint, request, jsonify, send_from_directory
from essentia.standard import AudioWriter, MonoWriter
import numpy as np
import os
from tempfile import TemporaryDirectory

overlay = Blueprint("overlay", __name__, url_prefix="/overlay")


@overlay.route("", methods=["POST"])
def overlay_buffers():
    melody_name = request.form.get("name")
    if melody_name is None:
        return (jsonify({"success": False, "message": "No file name provided"}), 400)

    melody_name_split = melody_name.split(".")
    melody_name_prefix = ".".join(melody_name_split[:-1])
    melody_name_suffix = melody_name_split[-1]
    overlay_name = melody_name_prefix + "_harmonized." + melody_name_suffix
    tempdir = TemporaryDirectory()
    overlay_path = os.path.join(tempdir, overlay_name)

    melody_data = request.form.get("melodyData")
    if melody_data is None:
        return (jsonify({"success": False, "message": "No melody data provided"}), 400)

    harmony_data = request.form.get("harmonyData")
    if harmony_data is None:
        return (jsonify({"success": False, "message": "No harmony data provided"}), 400)

    if len(melody_data) == 2:
        left_channel = np.array(melody_data[0]) + np.array(harmony_data)
        right_channel = np.array(melody_data[1]) + np.array(harmony_data)
        channel_data = np.array([left_channel, right_channel])
        AudioWriter(filename=overlay_path, format=melody_name_suffix)(channel_data)

    else:
        data = np.array(melody_data[0]) + np.array(harmony_data)
        MonoWriter(filename=overlay_path, format=melody_name_suffix)(data)

    overlay_handle = open(overlay_path, "r")
    return send_from_directory(tempdir, overlay_handle, as_attachment=True)
