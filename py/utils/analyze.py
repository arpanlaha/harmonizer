from essentia.standard import MonoLoader, PitchMelodia, KeyExtractor, RhythmExtractor


def analyze(file):
    audio = MonoLoader(filename=file)()

    frequencies = PitchMelodia()(audio)[0]
    key, scale, strength = KeyExtractor()(audio)

    bpm = RhythmExtractor()(audio)[0]

    return {"key": key + " " + scale, "frequencies": frequencies, "bpm": bpm}
