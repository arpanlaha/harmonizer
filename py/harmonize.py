from math import ceil
from utils.analyze import analyze
from utils.generate import generate
from utils.model import model


def harmonize(filename, key=None, tempo=None, time_signature=None):
    analysis = analyze(filename)

    # must be obtained from analyze
    frequencies = analysis["frequencies"]

    # optionally user-defined fields
    if key is None:
        key = analysis["key"]

    if tempo is None:
        tempo = analysis["bpm"]

    if time_signature is None:
        time_signature = 4

    measure_length = (
        time_signature * (60 / tempo) * (44100 / 128)
    )  # (beats/measure) (seconds/ebat) * (bins/second) = frequency bins/measure

    num_measures = ceil(len(frequencies) / measure_length)

    measures = [
        frequencies[
            int(i * measure_length) : int(
                max(len(frequencies), (i + 1) * measure_length)
            )
        ]
        for i in range(num_measures)
    ]  # split frequencies into measures

    chords = [""] * num_measures  # stores string representation of chord progression

    # assume first and last chords are tonic
    chords[0] = model["keys"][key]["chords"][0]
    chords[len(measures) - 1] = chords[0]

    for i in range(num_measures - 2):
        # start from second last and go backwards (important for contextual scoring)
        measure_number = len(chords) - 2 - i
        chords[measure_number] = generate(measures[measure_number], key)

    print(chords)


harmonize("simple.wav")  # exmple
