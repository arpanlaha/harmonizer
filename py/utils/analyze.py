from essentia.standard import KeyExtractor, MonoLoader, PitchMelodia, RhythmExtractor


def analyze(file):
    audio = MonoLoader(filename=file)()  # signal

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
