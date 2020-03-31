from flask import Blueprint, request, jsonify
import os
import numpy as np
from essentia.standard import MonoLoader, KeyExtractor, PitchMelodia, RhythmExtractor
from music21.pitch import Pitch
from operator import itemgetter
from utils.model import model

harmony = Blueprint("harmony", __name__)

ALLOWED_EXTENSIONS = {"mp3", "wav"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@harmony.route("/harmony", methods=["POST"])
def harmonize():
    file = request.files.get("file")

    if file is None or file.filename == "":
        return jsonify({"success": False, "message": "No file provided"}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Invalid file type"}), 400

    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)
    file.close()

    analysis = analyze(file_path)

    input_signal = np.array(analysis["audio"])

    frequencies = analysis["frequencies"]
    key = analysis["key"]
    tempo = analysis["bpm"]
    time_signature = 4

    measure_length_bins = (
        time_signature * (60 / tempo) * (44100 / 128)
    )  # (beats/measure) (seconds/ebat) * (bins/second) = frequency bins/measure

    measure_length_seconds = time_signature * (60 / tempo)

    num_measures = int(np.ceil(len(frequencies) / measure_length_bins))

    measures = [
        frequencies[
            int(i * measure_length_bins) : int(
                min(len(frequencies), (i + 1) * measure_length_bins)
            )
        ]
        for i in range(num_measures)
    ]  # split frequencies into measures

    measure_lengths_seconds = [len(measure) / (44100 / 128) for measure in measures]

    chords = [""] * num_measures  # stores string representation of chord progression

    # assume first and last chords are tonic
    chords[0] = model["keys"][key]["chords"][0]
    chords[len(measures) - 1] = chords[0]

    for i in range(num_measures - 2):
        # start from second last and go backwards (important for contextual scoring)
        measure_number = len(chords) - 2 - i
        chords[measure_number] = generate(measures[measure_number], key)

    os.remove(file_path)

    return (
        jsonify(
            {
                "success": True,
                "message": "Input harmonized",
                "result": {"harmony": chords},
            }
        ),
        200,
    )


def analyze(file):
    audio = MonoLoader(filename=file)()

    frequencies = PitchMelodia()(audio)[0]  # binned list of frequencies

    key, scale, strength = KeyExtractor()(
        audio
    )  # key (note) and scale (major vs. minor) matter

    bpm = RhythmExtractor()(audio)[0]  # tempo in beats per minute

    return {
        "audio": audio,
        "bpm": bpm,
        "frequencies": frequencies,
        "key": key + " " + scale,
    }


def generate(frequencies, key, next=None):
    pitch_histogram = {}  # stores number of occurences of each pitch

    for frequency in frequencies:
        if frequency == 0.0:  # disregard invalid values
            continue

        pitch = Pitch()
        pitch.frequency = frequency

        if pitch.name in pitch_histogram:
            pitch_histogram[pitch.name] += 1
        else:
            pitch_histogram[pitch.name] = 1

    chord_scores = {}  # arbitrarily defined scores for each possible chord
    chords = model["keys"][key]["chords"]

    for chord in chords:
        chord_score = 0
        notes = model["chords"][chord]["notes"]

        for note in notes:
            if note not in pitch_histogram:  # disregard note if not detected in measure
                continue

            if note == notes[0]:
                chord_score += 1.2 * pitch_histogram[note]
            else:
                chord_score += pitch_histogram[note]

        chord_scores[chord] = chord_score

    """
    To do: contextual scoring
    """
    print(chord_scores)
    return max(chord_scores.items(), key=itemgetter(1))[0]
