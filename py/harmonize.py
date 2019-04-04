import numpy as np
from essentia.standard import MonoWriter
from math import ceil
from utils.analyze import analyze
from utils.generate import generate
from utils.model import model
from utils.synthesize import synthesize


def harmonize(
    input_filename,
    key=None,
    tempo=None,
    time_signature=None,
    harmony_filename=None,
    harmonized_filename=None,
):
    analysis = analyze(input_filename)

    # must be obtained from analyze
    input_signal = np.array(analysis["audio"])

    frequencies = analysis["frequencies"]

    # optionally user-defined fields
    if key is None:
        key = analysis["key"]

    if tempo is None:
        tempo = analysis["bpm"]

    if time_signature is None:
        time_signature = 4

    if harmony_filename is None:
        harmony_filename = input_filename[:-4] + "_harmony.wav"

    if harmonized_filename is None:
        harmonized_filename = input_filename[:-4] + "_harmonized.wav"

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

    guitar = synthesize()

    guitar_signal = [i[0] for i in guitar.render()]

    #guitar.write("test.wav")
    #print(guitar_signal)
    MonoWriter(filename="test.wav")(guitar_signal)

harmonize("simple.wav")  # example
