from essentia.standard import MonoLoader, PitchMelodia, KeyExtractor, RhythmExtractor


def analyze(file):
    audio = MonoLoader(filename=file)()

    pitches = PitchMelodia()(audio)[0]
    key, scale, strength = KeyExtractor()(audio)
    bpm = RhythmExtractor()(audio)[0]
    return {"key": key + " " + scale, "pitches": pitches, "bpm": bpm}
