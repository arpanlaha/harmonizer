from music21.pitch import Pitch
from operator import itemgetter
from .model import model


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
