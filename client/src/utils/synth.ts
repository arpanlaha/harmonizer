import { FMSynth, Transport, Offline, ToneAudioBuffer } from "tone";
import { HarmonyResult } from "./api";
import { Chords } from "./theory";
const Synth = FMSynth;

export const synthesizeHarmony = (
  result: HarmonyResult,
  duration: number
): Promise<ToneAudioBuffer> => {
  const { bpm, chords, meter, start } = result;

  Transport.bpm.value = bpm;
  const measureLength = Math.min((60 * meter) / bpm, duration);

  // synthesize audio and render into overlay buffer
  return Offline((): void => {
    // one synth per chord note
    const synths = [
      new Synth().toDestination(),
      new Synth().toDestination(),
      new Synth().toDestination(),
    ];

    // decreasing order of volume: tonic, dominant, mediant
    const decibelDiff = 2;
    synths[1].volume.value -= decibelDiff * 2;
    synths[2].volume.value -= decibelDiff;

    // trigger 3 * chord progression length attack/releases
    chords.forEach((chord, chordIndex): void =>
      synths.forEach(
        (synth, synthIndex): FMSynth =>
          synth.triggerAttackRelease(
            `${Chords[chord].notes[synthIndex]}3`,
            measureLength,
            measureLength * chordIndex + start
          )
      )
    );
  }, duration);
};
