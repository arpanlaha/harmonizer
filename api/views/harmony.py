from flask import Blueprint, request, jsonify
from essentia.standard import (
    MonoLoader,
    KeyExtractor,
    PitchMelodia,
    RhythmExtractor,
    Meter,
    Beatogram,
    BeatsLoudness,
)
from operator import itemgetter
from .utils import model
import os
import tempfile
import math

harmony = Blueprint("harmony", __name__, url_prefix="/harmony")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {
        "aiff",
        "flac",
        "mp3",
        "mp4",
        "ogg",
        "wav",
    }


@harmony.route("", methods=["POST"])
def harmonize():
    file = request.files.get("melody")

    if file is None or file.filename == "":
        return (
            jsonify(
                {
                    "success": False,
                    "message": "No file provided",
                    "data": {
                        "files": request.files,
                        "file": ("missing" if file is None else file.filename),
                    },
                }
            ),
            400,
        )

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Invalid file type"}), 400

    file_path = os.path.join(tempfile.mkdtemp(), file.filename)
    file.save(file_path)
    file.close()

    analysis = analyze(file_path)

    frequencies = analysis["frequencies"]
    start = analysis["start"].item()

    key = request.form.get("key", analysis["key"])
    bpm = float(request.form.get("bpm", analysis["bpm"]))
    meter = float(request.form.get("meter", analysis["meter"]))

    measure_length_bins = (
        meter * (60 / bpm) * (44100 / 128)
    )  # (beats/measure) (seconds/ebat) * (bins/second) = frequency bins/measure

    num_measures = round(len(frequencies) / measure_length_bins)

    measures = [
        frequencies[
            int(i * measure_length_bins) : int(
                min(len(frequencies), (i + 1) * measure_length_bins)
            )
        ]
        for i in range(num_measures)
    ]  # split frequencies into measures

    # measure_lengths_seconds = [len(measure) / (44100 / 128) for measure in measures]

    chords = [""] * num_measures  # stores string representation of chord progression

    # assume first and last chords are tonic
    chords[0] = model["keys"][key]["chords"][0]
    chords[len(measures) - 1] = chords[0]

    chords = request.form.get("chords", chords)

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
                "result": {
                    "chords": chords,
                    "bpm": bpm,
                    "key": key,
                    "meter": meter,
                    "start": start,
                },
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

    bpm, beats = RhythmExtractor()(audio)[:2]  # tempo in beats per minute

    loudness, loudness_band_ratio = BeatsLoudness(beats=beats)(audio)
    beatogram = Beatogram()(loudness, loudness_band_ratio)
    meter = Meter()(beatogram)

    return {
        "audio": audio,
        "bpm": bpm,
        "frequencies": frequencies,
        "key": key + " " + scale,
        "meter": meter,
        "start": beats[0],
    }


def generate(frequencies, key, next=None):
    pitch_histogram = {}  # stores number of occurences of each pitch
    index_histogram = {}  # stores number of occurences of each pitch

    for frequency in frequencies:
        if frequency == 0.0:  # disregard invalid values
            continue

        A1 = 55
        pitches = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

        pitch_index = round(12 * math.log2(frequency / A1)) % 12

        pitch_name = pitches[pitch_index]

        if pitch_name in pitch_histogram:
            pitch_histogram[pitch_name] += 1
        else:
            pitch_histogram[pitch_name] = 1

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
    return max(chord_scores.items(), key=itemgetter(1))[0]
