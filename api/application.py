import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import math
from essentia.standard import MonoLoader, KeyExtractor, PitchMelodia, RhythmExtractor
from operator import itemgetter

ALLOWED_EXTENSIONS = {"mp3", "mp4", "wav"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


app = Flask(__name__)
CORS(app)


@app.route("/api/harmony", methods=["POST"])
def harmonize():
    file = request.files.get("file")

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
    key = analysis["key"]
    bpm = analysis["bpm"]
    time_signature = 4

    measure_length_bins = (
        time_signature * (60 / bpm) * (44100 / 128)
    )  # (beats/measure) (seconds/ebat) * (bins/second) = frequency bins/measure

    num_measures = math.ceil(len(frequencies) / measure_length_bins)

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
                "result": {"chords": chords, "bpm": bpm},
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


model = {
    "keys": {
        "Ab major": {
            "name": "Ab major",
            "chords": [
                "Ab major",
                "Bb minor",
                "C minor",
                "Db major",
                "Eb major",
                "F minor",
            ],
        },
        "Ab minor": {
            "name": "Ab minor",
            "chords": [
                "Ab minor",
                "Cb major",
                "Db minor",
                "Eb minor",
                "Fb major",
                "Gb major",
            ],
        },
        "A major": {
            "name": "A major",
            "chords": [
                "A major",
                "B minor",
                "C# minor",
                "D major",
                "E major",
                "F# minor",
            ],
        },
        "A minor": {
            "name": "A minor",
            "chords": [
                "A minor",
                "C major",
                "D minor",
                "E minor",
                "F major",
                "G major",
            ],
        },
        "A# major": {
            "name": "A# major",
            "chords": [
                "A# major",
                "B# minor",
                "C## minor",
                "D# major",
                "E# major",
                "F## minor",
            ],
        },
        "A# minor": {
            "name": "A# minor",
            "chords": [
                "A# minor",
                "C# major",
                "D# minor",
                "E# minor",
                "F# major",
                "G# major",
            ],
        },
        "Bb major": {
            "name": "Bb major",
            "chords": [
                "Bb manor",
                "C minor",
                "D minor",
                "Eb major",
                "F major",
                "G minor",
            ],
        },
        "Bb minor": {
            "name": "Bb minor",
            "chords": [
                "Bb minor",
                "Db major",
                "Eb minor",
                "F minor",
                "Gb major",
                "Ab major",
            ],
        },
        "B major": {
            "name": "B major",
            "chords": [
                "B major",
                "C# minor",
                "D# minor",
                "E major",
                "F# major",
                "G# minor",
            ],
        },
        "B minor": {
            "name": "B minor",
            "chords": [
                "B minor",
                "D major",
                "E minor",
                "F# minor",
                "G major",
                "A major",
            ],
        },
        "B# major": {
            "name": "B# major",
            "chords": [
                "B# major",
                "C## minor",
                "D## minor",
                "E# major",
                "F## major",
                "G## minor",
            ],
        },
        "B# minor": {
            "name": "B# minor",
            "chords": [
                "B# minor",
                "D# major",
                "E# minor",
                "F## minor",
                "G# major",
                "A# major",
            ],
        },
        "Cb major": {
            "name": "Cb major",
            "chords": [
                "Cb major",
                "Db minor",
                "Eb minor",
                "Fb major",
                "Gb major",
                "Ab minor",
            ],
        },
        "Cb minor": {
            "name": "Cb minor",
            "chords": [
                "Cb minor",
                "Ebb major",
                "Fb minor",
                "Gb minor",
                "Abb major",
                "Bbb major",
            ],
        },
        "C major": {
            "name": "C major",
            "chords": [
                "C major",
                "D minor",
                "E minor",
                "F major",
                "G major",
                "A minor",
            ],
        },
        "C minor": {
            "name": "C minor",
            "chords": [
                "C minor",
                "Eb major",
                "F minor",
                "G minor",
                "Ab major",
                "Bb major",
            ],
        },
        "C# major": {
            "name": "C# major",
            "chords": [
                "C# major",
                "D# minor",
                "E# minor",
                "F# major",
                "G# major",
                "A# minor",
            ],
        },
        "C# minor": {
            "name": "C# minor",
            "chords": [
                "C# minor",
                "E major",
                "F# minor",
                "G# minor",
                "A major",
                "B major",
            ],
        },
        "Db major": {
            "name": "Db major",
            "chords": [
                "Db major",
                "Eb minor",
                " F minor",
                "Gb major",
                "Ab major",
                "Bb minor",
            ],
        },
        "Db minor": {
            "name": "Db minor",
            "chords": [
                "Db minor",
                "Fb major",
                "Gb minor",
                "Ab minor",
                "Bbb major",
                "Cb major",
            ],
        },
        "D major": {
            "name": "D major",
            "chords": [
                "D major",
                "E minor",
                "F# minor",
                "G major",
                "A major",
                "B minor",
            ],
        },
        "D minor": {
            "name": "D minor",
            "chords": [
                "D minor",
                "F major",
                "G minor",
                "A minor",
                "Bb major",
                "C major",
            ],
        },
        "D# major": {
            "name": "D# major",
            "chords": [
                "D# major",
                "E# minor",
                "F## minor",
                "G# major",
                "A# major",
                "B# minor",
            ],
        },
        "D# minor": {
            "name": "D# minor",
            "chords": [
                "D# minor",
                "F# major",
                "G# minor",
                "A# minor",
                "B major",
                "C# major",
            ],
        },
        "Eb major": {
            "name": "Eb major",
            "chords": [
                "Eb major",
                "F minor",
                "G minor",
                "Ab major",
                "Bb major",
                "C minor",
            ],
        },
        "Eb minor": {
            "name": "Eb minor",
            "chords": [
                "Eb minor",
                "Gb major",
                "Ab minor",
                "Bb minor",
                "Cb major",
                "Db major",
            ],
        },
        "E major": {
            "name": "E major",
            "chords": [
                "E major",
                "F# minor",
                "G# minor",
                "A major",
                "B major",
                "C# minor",
            ],
        },
        "E minor": {
            "name": "E minor",
            "chords": [
                "E minor",
                "G major",
                "A minor",
                "B minor",
                "C major",
                "D major",
            ],
        },
        "E# major": {
            "name": "E# major",
            "chords": [
                "E# major",
                "F## minor",
                "G## minor",
                "A# major",
                "B# major",
                "C## minor",
            ],
        },
        "E# minor": {
            "name": "E# minor",
            "chords": [
                "E# minor",
                "G# major",
                "A# minor",
                "B# minor",
                "C# major",
                "D# major",
            ],
        },
        "Fb major": {
            "name": "Fb major",
            "chords": [
                "Fb major",
                "Gb minor",
                "Ab minor",
                "Bbb major",
                "Cb major",
                "Db minor",
            ],
        },
        "Fb minor": {
            "name": "Fb minor",
            "chords": [
                "Fb minor",
                "Abb major",
                "Bbb minor",
                "Cb minor",
                "Dbb major",
                "Ebb major",
            ],
        },
        "F major": {
            "name": "F major",
            "chords": [
                "F major",
                "G minor",
                "A minor",
                "Bb major",
                "C major",
                "D minor",
            ],
        },
        "F minor": {
            "name": "F minor",
            "chords": [
                "F minor",
                "Ab major",
                "Bb minor",
                "C minor",
                "Db major",
                "Eb major",
            ],
        },
        "F# major": {
            "name": "F# major",
            "chords": [
                "F# major",
                "G# minor",
                "A# minor",
                "Bb major",
                "C# major",
                "D# minor",
            ],
        },
        "F# minor": {
            "name": "F# minor",
            "chords": [
                "F# minor",
                "A major",
                "B minor",
                "C# minor",
                "D major",
                "E major",
            ],
        },
        "Gb major": {
            "name": "Gb major",
            "chords": [
                "Gb major",
                "Ab minor",
                "Bb minor",
                "B major",
                "Db major",
                "Eb minor",
            ],
        },
        "Gb minor": {
            "name": "Gb minor",
            "chords": [
                "Gb minor",
                "Bbb major",
                "Cb minor",
                "Db minor",
                "Ebb major",
                "Fb major",
            ],
        },
        "G major": {
            "name": "G major",
            "chords": [
                "G major",
                "A minor",
                "B minor",
                "C major",
                "D major",
                "E minor",
            ],
        },
        "G minor": {
            "name": "G minor",
            "chords": [
                "G minor",
                "Bb major",
                "C minor",
                "D minor",
                "Eb major",
                "F major",
            ],
        },
        "G# major": {
            "name": "G# major",
            "chords": [
                "G# major",
                "A# minor",
                "B# minor",
                "C# major",
                "D# major",
                "E# minor",
            ],
        },
        "G# minor": {
            "name": "G# minor",
            "chords": [
                "G# minor",
                "B major",
                "C# minor",
                "Eb minor",
                "E major",
                "Gb major",
            ],
        },
    },
    "chords": {
        "Abb major": {"name": "Abb major", "notes": ["G", "B", "D"]},
        "Ab major": {"name": "Ab major", "notes": ["G#", "C", "D#"]},
        "Ab minor": {"name": "Ab minor", "notes": ["G#", "B", "D#"]},
        "A major": {"name": "A major", "notes": ["A", "C#", "E"]},
        "A minor": {"name": "A minor", "notes": ["A", "C", "E"]},
        "A# major": {"name": "A# major", "notes": ["A#", "D", "F"]},
        "A# minor": {"name": "A# minor", "notes": ["A#", "C#", "F"]},
        "Bbb major": {"name": "Bbb major", "notes": ["A", "C#", "E"]},
        "Bbb minor": {"name": "Bbb minor", "notes": ["A", "C", "E"]},
        "Bb major": {"name": "Bb major", "notes": ["A#", "D", "F"]},
        "Bb minor": {"name": "Bb minor", "notes": ["A#", "C#", "F"]},
        "B major": {"name": "B major", "notes": ["B", "D#", "F#"]},
        "B minor": {"name": "B minor", "notes": ["B", "D", "F#"]},
        "B# major": {"name": "B# major", "notes": ["C", "E", "G"]},
        "B# minor": {"name": "B# minor", "notes": ["C", "D#", "G"]},
        "Cb major": {"name": "Cb major", "notes": ["B", "D#", "F#"]},
        "Cb minor": {"name": "Cb minor", "notes": ["B", "D", "F#"]},
        "C major": {"name": "C major", "notes": ["C", "E", "G"]},
        "C minor": {"name": "C minor", "notes": ["C", "D#", "G"]},
        "C# major": {"name": "C# major", "notes": ["C#", "F", "G#"]},
        "C# minor": {"name": "C# minor", "notes": ["C#", "E", "G#"]},
        "C## minor": {"name": "C## minor", "notes": ["D", "F", "A"]},
        "Dbb major": {"name": "Dbb major", "notes": ["C", "E", "G"]},
        "Db major": {"name": "Db major", "notes": ["C#", "F", "G#"]},
        "Db minor": {"name": "Db minor", "notes": ["C#", "E", "G#"]},
        "D major": {"name": "D major", "notes": ["D", "F#", "A"]},
        "D minor": {"name": "D minor", "notes": ["D", "F", "A"]},
        "D# major": {"name": "D# major", "notes": ["D#", "G", "A#"]},
        "D# minor": {"name": "D# minor", "notes": ["D#", "F#", "A#"]},
        "D## minor": {"name": "D## minor", "notes": ["E", "G", "B"]},
        "Ebb major": {"name": "Ebb major", "notes": ["D", "F#", "A"]},
        "Eb major": {"name": "Eb major", "notes": ["D#", "G", "A#"]},
        "Eb minor": {"name": "Eb minor", "notes": ["D#", "F#", "A#"]},
        "E major": {"name": "E major", "notes": ["E", "G#", "B"]},
        "E minor": {"name": "E minor", "notes": ["E", "G", "B"]},
        "E# major": {"name": "E# major", "notes": ["F", "A", "C"]},
        "E# minor": {"name": "E# minor", "notes": ["F", "G#", "C"]},
        "Fb major": {"name": "Fb major", "notes": ["E", "G#", "B"]},
        "Fb minor": {"name": "Fb minor", "notes": ["E", "G", "B"]},
        "F major": {"name": "F major", "notes": ["F", "A", "C"]},
        "F minor": {"name": "F minor", "notes": ["F", "G#", "C"]},
        "F# major": {"name": "F# major", "notes": ["F#", "A#", "C#"]},
        "F# minor": {"name": "F# minor", "notes": ["F#", "A", "C#"]},
        "F## major": {"name": "F## major", "notes": ["G", "B", "D"]},
        "F## minor": {"name": "F## minor", "notes": ["G", "A#", "D"]},
        "Gb major": {"name": "Gb major", "notes": ["F#", "A#", "C#"]},
        "Gb minor": {"name": "Gb minor", "notes": ["F#", "A", "C#"]},
        "G major": {"name": "G major", "notes": ["G", "B", "D"]},
        "G minor": {"name": "G minor", "notes": ["G", "A#", "D"]},
        "G# major": {"name": "G# major", "notes": ["G#", "C", "D#"]},
        "G# minor": {"name": "G# minor", "notes": ["G#", "B", "D#"]},
        "G## minor": {"name": "G## minor", "notes": ["A", "C", "E"]},
    },
    "pitches": {
        "A": {"name": "A", "note_numbers": [33, 45, 57], "base_frequency": 55.00},
        "A#": {"name": "A#", "note_numbers": [34, 46, 58], "base_frequency": 58.27},
        "B": {"name": "B", "note_numbers": [35, 47, 59], "base_frequency": 61.74},
        "C": {"name": "C", "note_numbers": [36, 48, 60], "base_frequency": 65.41},
        "C#": {"name": "C#", "note_numbers": [37, 49, 61], "base_frequency": 69.30},
        "D": {"name": "D", "note_numbers": [38, 50, 62], "base_frequency": 73.42},
        "D#": {"name": "D#", "note_numbers": [39, 51, 63], "base_frequency": 77.78},
        "E": {"name": "E", "note_numbers": [40, 52, 64], "base_frequency": 82.41},
        "F": {"name": "F", "note_numbers": [41, 53, 65], "base_frequency": 87.31},
        "F#": {"name": "F#", "note_numbers": [42, 54, 66], "base_frequency": 92.50},
        "G": {"name": "G", "note_numbers": [43, 55, 67], "base_frequency": 98.00},
        "G#": {"name": "G#", "note_numbers": [44, 56, 68], "base_frequency": 103.83},
    },
}
