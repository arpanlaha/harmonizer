from utils.analyzer import analyze
from utils.model import model
from math import ceil


def harmonize(filename, key=None, tempo=None, time_signature=None):
    analysis = analyze(filename)

    frequencies = analysis["frequencies"]

    if key is None:
        key = analysis["key"]

    if tempo is None:
        tempo = analysis["bpm"]

    if time_signature is None:
        time_signature = 4

    measure_length = (
        time_signature * (60 / tempo) * (44100 / 128)
    )  # (beats/measure) (seconds/ebat) * (bins/second) = frequency bins/measure

    num_measures = ceil(len(frequenci) / measure_length)

    measures = [
        frequencies[
            int(i * measure_length) : int(
                max(len(frequencies), (i + 1) * measure_length)
            )
        ]
        for i in range(num_measures)
    ]  # split frequencies into measures

    chords = [""] * num_measures
    chords[0] = model["keys"][key]["chords"][0]
    chords[len(measures) - 1] = chords[0]
    print(chords)

    # time = len(frequencies) / (44100 / 128)


harmonize("simple.wav")
