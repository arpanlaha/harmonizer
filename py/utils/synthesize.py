import sound
from sound.notes import *
from sound.instrument import Instrument, Guitar
from sound.sample import Digitar, SquareWave, SAMPLE_RATE
from sound.signal import SliceSignal, Purifier, ReverseSignal, ConstantSignal

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

def synthesize():
    guitar = sound.async.GuitarStrummer(Digitar)
    strum_stuff(guitar, 'C', 2, 140)
    strum_stuff(guitar, 'F', 2, 140, 2)
    strum_stuff(guitar, 'G', 2, 140, 4)
    strum_stuff(guitar, 'C', 2, 140, 6)
    return guitar