from flask import Blueprint, request, jsonify
from essentia.standard import (
    MonoLoader,
    KeyExtractor,
    PitchMelodia,
    RhythmExtractor2013,
    Meter,
    Beatogram,
    BeatsLoudness,
)
from operator import itemgetter
from .utils import model
import os
from tempfile import TemporaryDirectory
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
    melody = request.files.get("melody")

    if melody is None or melody.filename == "":
        return (
            jsonify({"success": False, "message": "No file provided"}),
            400,
        )

    if not allowed_file(melody.filename):
        return jsonify({"success": False, "message": "Invalid file type"}), 400

    tempdir = TemporaryDirectory()
    melody_path = os.path.join(tempdir.name, melody.filename)
    melody.save(melody_path)
    melody.close()

    audio = MonoLoader(filename=melody_path)()

    frequencies, freq_confidence = PitchMelodia()(audio)  # binned list of frequencies

    key, scale, strength = KeyExtractor()(
        audio
    )  # key (note) and scale (major vs. minor) matter

    if scale == "major":
        scale = "Major"

    bpm, beats = RhythmExtractor2013()(audio)[:2]
    bpm = float(request.form.get("bpm", bpm))

    loudness, loudness_band_ratio = BeatsLoudness(beats=beats)(audio)
    beatogram = Beatogram()(loudness, loudness_band_ratio)
    meter = Meter()(beatogram)
    start = max(float(beats[0]) - 60 / bpm, 0)

    key = request.form.get("key", key + " " + scale)
    meter = float(request.form.get("meter", meter))

    measure_bin_length = (
        meter * (60 / bpm) * (44100 / 128)
    )  # (beats/measure) (seconds/ebat) * (bins/second) = frequency bins/measure

    num_measures = max(round(len(frequencies) / measure_bin_length), 1)

    chords = [""] * num_measures  # stores string representation of chord progression

    # assume first and last chords are tonic
    chords[0] = model["keys"][key]["chords"][0]
    chords[num_measures - 1] = chords[0]

    for i in range(num_measures - 2):
        # start from second last and go backwards (important for contextual scoring)
        measure_number = len(chords) - 2 - i
        measure_frequencies = frequencies[
            int(measure_number * measure_bin_length) : int(
                min(len(frequencies), (measure_number + 1) * measure_bin_length)
            )
        ]
        measure_confidences = freq_confidence[
            int(measure_number * measure_bin_length) : int(
                min(len(frequencies), (measure_number + 1) * measure_bin_length)
            )
        ]

        pitch_histogram = {}  # stores number of occurences of each pitch
        index_histogram = {}  # stores number of occurences of each pitch

        for i in range(len(measure_frequencies)):
            frequency = measure_frequencies[i]
            confidence = measure_confidences[i]
            if frequency == 0.0:  # disregard invalid values
                continue

            A1 = 55
            pitches = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

            pitch_index = round(12 * math.log2(frequency / A1)) % 12

            pitch_name = pitches[pitch_index]

            if pitch_name in pitch_histogram:
                pitch_histogram[pitch_name] += confidence
            else:
                pitch_histogram[pitch_name] = confidence

        chord_scores = {}  # arbitrarily defined scores for each possible chord
        available_chords = model["keys"][key]["chords"]

        for chord in available_chords:
            chord_score = 0
            notes = model["chords"][chord]["notes"]

            for note in notes:
                note_val = pitch_histogram.get(note, 0)

                if note == notes[0]:
                    chord_score += 1.2 * note_val
                else:
                    chord_score += note_val

            chord_scores[chord] = chord_score

        chords[measure_number] = max(chord_scores.items(), key=itemgetter(1))[0]

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
