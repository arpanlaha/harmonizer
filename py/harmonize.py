from utils.analyzer import analyze


def harmonize(filename, key=None, tempo=None, time_signature=None):
    analyze(filename)


harmonize("simple.wav")
