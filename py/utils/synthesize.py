from sound.async import GuitarStrummer
from sound.sample import Digitar


def synthesize(chords, measure_length):
    # guitar = Guitar(tempo=((60 * 44100) / (128 * measure_length)))
    #measure_length_frames = measure_length * 44100 / 128
    guitar = GuitarStrummer(Digitar)
    for i in range(len(chords)):
        if chords[i][:-5] == "major":
            chord = chords[i][:-6]
        else:
            chord = chords[i][:-6] + "m"
        print(chord)
        guitar.queue(i * measure_length, (guitar.strum_up, (chord)))
    #print(guitar.play(guitar))
    return guitar.purify()


"""
def strum_stuff(guitar, chord, length, bpm, basebeat=0):
    base = basebeat * SAMPLE_RATE * 60 / bpm
    L1 = length * 0.25 * SAMPLE_RATE * 60 / bpm
    L2 = length * 0.125 * SAMPLE_RATE * 60 / bpm
    guitar.queue(base, (guitar.strum_down, (chord,)))
    guitar.queue(base + L1, (guitar.strum_up, (chord,)))
    guitar.queue(base + L1 + L2, (guitar.strum_down, (chord,)))
    guitar.queue(base + L1 + L2 + L1, (guitar.strum_up, (chord,)))
    guitar.queue(base + L1 + L2 + L1 + L2, (guitar.strum_down, (chord,)))
    guitar.queue(base + L1 + L2 + L1 + L2 + L2, (guitar.strum_up, (chord,)))
"""
