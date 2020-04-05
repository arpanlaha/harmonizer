export type ChordName =
  | "Abb major"
  | "Ab major"
  | "Ab minor"
  | "A major"
  | "A minor"
  | "A# major"
  | "A# minor"
  | "Bbb major"
  | "Bbb minor"
  | "Bb major"
  | "Bb minor"
  | "B major"
  | "B minor"
  | "B# major"
  | "B# minor"
  | "Cb major"
  | "Cb minor"
  | "C major"
  | "C minor"
  | "C# major"
  | "C# minor"
  | "C## minor"
  | "Dbb major"
  | "Db major"
  | "Db minor"
  | "D major"
  | "D minor"
  | "D# major"
  | "D# minor"
  | "D## minor"
  | "Ebb major"
  | "Eb major"
  | "Eb minor"
  | "E major"
  | "E minor"
  | "E# major"
  | "E# minor"
  | "Fb major"
  | "Fb minor"
  | "F major"
  | "F minor"
  | "F# major"
  | "F# minor"
  | "F## major"
  | "F## minor"
  | "Gb major"
  | "Gb minor"
  | "G major"
  | "G minor"
  | "G# major"
  | "G# minor"
  | "G## minor";

export interface Key {
  readonly name: KeyName;
  readonly chords: ChordName[];
}

export type KeyName =
  | "Ab major"
  | "Ab minor"
  | "A major"
  | "A minor"
  | "A# major"
  | "A# minor"
  | "Bb major"
  | "Bb minor"
  | "B major"
  | "B minor"
  | "B# major"
  | "B# minor"
  | "Cb major"
  | "Cb minor"
  | "C major"
  | "C minor"
  | "C# major"
  | "C# minor"
  | "Db major"
  | "Db minor"
  | "D major"
  | "D minor"
  | "D# major"
  | "D# minor"
  | "Eb major"
  | "Eb minor"
  | "E major"
  | "E minor"
  | "E# major"
  | "E# minor"
  | "Fb major"
  | "Fb minor"
  | "F major"
  | "F minor"
  | "F# major"
  | "F# minor"
  | "Gb major"
  | "Gb minor"
  | "G major"
  | "G minor"
  | "G# major"
  | "G# minor";

export type PitchName =
  | "A"
  | "A#"
  | "B"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#";

export interface Chord {
  readonly name: ChordName;
  readonly notes: PitchName[];
}

export interface Pitch {
  readonly name: PitchName;
  readonly noteNumbers: readonly [number, number, number];
  readonly baseFrequency: number;
}

export const Keys: Record<KeyName, Key> = {
  "Ab major": {
    name: "Ab major",
    chords: [
      "Ab major",
      "Bb minor",
      "C minor",
      "Db major",
      "Eb major",
      "F minor",
    ],
  },
  "Ab minor": {
    name: "Ab minor",
    chords: [
      "Ab minor",
      "Cb major",
      "Db minor",
      "Eb minor",
      "Fb major",
      "Gb major",
    ],
  },
  "A major": {
    name: "A major",
    chords: [
      "A major",
      "B minor",
      "C# minor",
      "D major",
      "E major",
      "F# minor",
    ],
  },
  "A minor": {
    name: "A minor",
    chords: ["A minor", "C major", "D minor", "E minor", "F major", "G major"],
  },
  "A# major": {
    name: "A# major",
    chords: [
      "A# major",
      "B# minor",
      "C## minor",
      "D# major",
      "E# major",
      "F## minor",
    ],
  },
  "A# minor": {
    name: "A# minor",
    chords: [
      "A# minor",
      "C# major",
      "D# minor",
      "E# minor",
      "F# major",
      "G# major",
    ],
  },
  "Bb major": {
    name: "Bb major",
    chords: [
      "Bb major",
      "C minor",
      "D minor",
      "Eb major",
      "F major",
      "G minor",
    ],
  },
  "Bb minor": {
    name: "Bb minor",
    chords: [
      "Bb minor",
      "Db major",
      "Eb minor",
      "F minor",
      "Gb major",
      "Ab major",
    ],
  },
  "B major": {
    name: "B major",
    chords: [
      "B major",
      "C# minor",
      "D# minor",
      "E major",
      "F# major",
      "G# minor",
    ],
  },
  "B minor": {
    name: "B minor",
    chords: ["B minor", "D major", "E minor", "F# minor", "G major", "A major"],
  },
  "B# major": {
    name: "B# major",
    chords: [
      "B# major",
      "C## minor",
      "D## minor",
      "E# major",
      "F## major",
      "G## minor",
    ],
  },
  "B# minor": {
    name: "B# minor",
    chords: [
      "B# minor",
      "D# major",
      "E# minor",
      "F## minor",
      "G# major",
      "A# major",
    ],
  },
  "Cb major": {
    name: "Cb major",
    chords: [
      "Cb major",
      "Db minor",
      "Eb minor",
      "Fb major",
      "Gb major",
      "Ab minor",
    ],
  },
  "Cb minor": {
    name: "Cb minor",
    chords: [
      "Cb minor",
      "Ebb major",
      "Fb minor",
      "Gb minor",
      "Abb major",
      "Bbb major",
    ],
  },
  "C major": {
    name: "C major",
    chords: ["C major", "D minor", "E minor", "F major", "G major", "A minor"],
  },
  "C minor": {
    name: "C minor",
    chords: [
      "C minor",
      "Eb major",
      "F minor",
      "G minor",
      "Ab major",
      "Bb major",
    ],
  },
  "C# major": {
    name: "C# major",
    chords: [
      "C# major",
      "D# minor",
      "E# minor",
      "F# major",
      "G# major",
      "A# minor",
    ],
  },
  "C# minor": {
    name: "C# minor",
    chords: [
      "C# minor",
      "E major",
      "F# minor",
      "G# minor",
      "A major",
      "B major",
    ],
  },
  "Db major": {
    name: "Db major",
    chords: [
      "Db major",
      "Eb minor",
      "F minor",
      "Gb major",
      "Ab major",
      "Bb minor",
    ],
  },
  "Db minor": {
    name: "Db minor",
    chords: [
      "Db minor",
      "Fb major",
      "Gb minor",
      "Ab minor",
      "Bbb major",
      "Cb major",
    ],
  },
  "D major": {
    name: "D major",
    chords: ["D major", "E minor", "F# minor", "G major", "A major", "B minor"],
  },
  "D minor": {
    name: "D minor",
    chords: ["D minor", "F major", "G minor", "A minor", "Bb major", "C major"],
  },
  "D# major": {
    name: "D# major",
    chords: [
      "D# major",
      "E# minor",
      "F## minor",
      "G# major",
      "A# major",
      "B# minor",
    ],
  },
  "D# minor": {
    name: "D# minor",
    chords: [
      "D# minor",
      "F# major",
      "G# minor",
      "A# minor",
      "B major",
      "C# major",
    ],
  },
  "Eb major": {
    name: "Eb major",
    chords: [
      "Eb major",
      "F minor",
      "G minor",
      "Ab major",
      "Bb major",
      "C minor",
    ],
  },
  "Eb minor": {
    name: "Eb minor",
    chords: [
      "Eb minor",
      "Gb major",
      "Ab minor",
      "Bb minor",
      "Cb major",
      "Db major",
    ],
  },
  "E major": {
    name: "E major",
    chords: [
      "E major",
      "F# minor",
      "G# minor",
      "A major",
      "B major",
      "C# minor",
    ],
  },
  "E minor": {
    name: "E minor",
    chords: ["E minor", "G major", "A minor", "B minor", "C major", "D major"],
  },
  "E# major": {
    name: "E# major",
    chords: [
      "E# major",
      "F## minor",
      "G## minor",
      "A# major",
      "B# major",
      "C## minor",
    ],
  },
  "E# minor": {
    name: "E# minor",
    chords: [
      "E# minor",
      "G# major",
      "A# minor",
      "B# minor",
      "C# major",
      "D# major",
    ],
  },
  "Fb major": {
    name: "Fb major",
    chords: [
      "Fb major",
      "Gb minor",
      "Ab minor",
      "Bbb major",
      "Cb major",
      "Db minor",
    ],
  },
  "Fb minor": {
    name: "Fb minor",
    chords: [
      "Fb minor",
      "Abb major",
      "Bbb minor",
      "Cb minor",
      "Dbb major",
      "Ebb major",
    ],
  },
  "F major": {
    name: "F major",
    chords: ["F major", "G minor", "A minor", "Bb major", "C major", "D minor"],
  },
  "F minor": {
    name: "F minor",
    chords: [
      "F minor",
      "Ab major",
      "Bb minor",
      "C minor",
      "Db major",
      "Eb major",
    ],
  },
  "F# major": {
    name: "F# major",
    chords: [
      "F# major",
      "G# minor",
      "A# minor",
      "Bb major",
      "C# major",
      "D# minor",
    ],
  },
  "F# minor": {
    name: "F# minor",
    chords: [
      "F# minor",
      "A major",
      "B minor",
      "C# minor",
      "D major",
      "E major",
    ],
  },
  "Gb major": {
    name: "Gb major",
    chords: [
      "Gb major",
      "Ab minor",
      "Bb minor",
      "B major",
      "Db major",
      "Eb minor",
    ],
  },
  "Gb minor": {
    name: "Gb minor",
    chords: [
      "Gb minor",
      "Bbb major",
      "Cb minor",
      "Db minor",
      "Ebb major",
      "Fb major",
    ],
  },
  "G major": {
    name: "G major",
    chords: ["G major", "A minor", "B minor", "C major", "D major", "E minor"],
  },
  "G minor": {
    name: "G minor",
    chords: [
      "G minor",
      "Bb major",
      "C minor",
      "D minor",
      "Eb major",
      "F major",
    ],
  },
  "G# major": {
    name: "G# major",
    chords: [
      "G# major",
      "A# minor",
      "B# minor",
      "C# major",
      "D# major",
      "E# minor",
    ],
  },
  "G# minor": {
    name: "G# minor",
    chords: [
      "G# minor",
      "B major",
      "C# minor",
      "Eb minor",
      "E major",
      "Gb major",
    ],
  },
};

export const Chords: Record<ChordName, Chord> = {
  "Abb major": { name: "Abb major", notes: ["G", "B", "D"] },
  "Ab major": { name: "Ab major", notes: ["G#", "C", "D#"] },
  "Ab minor": { name: "Ab minor", notes: ["G#", "B", "D#"] },
  "A major": { name: "A major", notes: ["A", "C#", "E"] },
  "A minor": { name: "A minor", notes: ["A", "C", "E"] },
  "A# major": { name: "A# major", notes: ["A#", "D", "F"] },
  "A# minor": { name: "A# minor", notes: ["A#", "C#", "F"] },
  "Bbb major": { name: "Bbb major", notes: ["A", "C#", "E"] },
  "Bbb minor": { name: "Bbb minor", notes: ["A", "C", "E"] },
  "Bb major": { name: "Bb major", notes: ["A#", "D", "F"] },
  "Bb minor": { name: "Bb minor", notes: ["A#", "C#", "F"] },
  "B major": { name: "B major", notes: ["B", "D#", "F#"] },
  "B minor": { name: "B minor", notes: ["B", "D", "F#"] },
  "B# major": { name: "B# major", notes: ["C", "E", "G"] },
  "B# minor": { name: "B# minor", notes: ["C", "D#", "G"] },
  "Cb major": { name: "Cb major", notes: ["B", "D#", "F#"] },
  "Cb minor": { name: "Cb minor", notes: ["B", "D", "F#"] },
  "C major": { name: "C major", notes: ["C", "E", "G"] },
  "C minor": { name: "C minor", notes: ["C", "D#", "G"] },
  "C# major": { name: "C# major", notes: ["C#", "F", "G#"] },
  "C# minor": { name: "C# minor", notes: ["C#", "E", "G#"] },
  "C## minor": { name: "C## minor", notes: ["D", "F", "A"] },
  "Dbb major": { name: "Dbb major", notes: ["C", "E", "G"] },
  "Db major": { name: "Db major", notes: ["C#", "F", "G#"] },
  "Db minor": { name: "Db minor", notes: ["C#", "E", "G#"] },
  "D major": { name: "D major", notes: ["D", "F#", "A"] },
  "D minor": { name: "D minor", notes: ["D", "F", "A"] },
  "D# major": { name: "D# major", notes: ["D#", "G", "A#"] },
  "D# minor": { name: "D# minor", notes: ["D#", "F#", "A#"] },
  "D## minor": { name: "D## minor", notes: ["E", "G", "B"] },
  "Ebb major": { name: "Ebb major", notes: ["D", "F#", "A"] },
  "Eb major": { name: "Eb major", notes: ["D#", "G", "A#"] },
  "Eb minor": { name: "Eb minor", notes: ["D#", "F#", "A#"] },
  "E major": { name: "E major", notes: ["E", "G#", "B"] },
  "E minor": { name: "E minor", notes: ["E", "G", "B"] },
  "E# major": { name: "E# major", notes: ["F", "A", "C"] },
  "E# minor": { name: "E# minor", notes: ["F", "G#", "C"] },
  "Fb major": { name: "Fb major", notes: ["E", "G#", "B"] },
  "Fb minor": { name: "Fb minor", notes: ["E", "G", "B"] },
  "F major": { name: "F major", notes: ["F", "A", "C"] },
  "F minor": { name: "F minor", notes: ["F", "G#", "C"] },
  "F# major": { name: "F# major", notes: ["F#", "A#", "C#"] },
  "F# minor": { name: "F# minor", notes: ["F#", "A", "C#"] },
  "F## major": { name: "F## major", notes: ["G", "B", "D"] },
  "F## minor": { name: "F## minor", notes: ["G", "A#", "D"] },
  "Gb major": { name: "Gb major", notes: ["F#", "A#", "C#"] },
  "Gb minor": { name: "Gb minor", notes: ["F#", "A", "C#"] },
  "G major": { name: "G major", notes: ["G", "B", "D"] },
  "G minor": { name: "G minor", notes: ["G", "A#", "D"] },
  "G# major": { name: "G# major", notes: ["G#", "C", "D#"] },
  "G# minor": { name: "G# minor", notes: ["G#", "B", "D#"] },
  "G## minor": { name: "G## minor", notes: ["A", "C", "E"] },
};

export const Pitches: Record<PitchName, Pitch> = {
  A: { name: "A", noteNumbers: [33, 45, 57], baseFrequency: 55.0 },
  "A#": { name: "A#", noteNumbers: [34, 46, 58], baseFrequency: 58.27 },
  B: { name: "B", noteNumbers: [35, 47, 59], baseFrequency: 61.74 },
  C: { name: "C", noteNumbers: [36, 48, 60], baseFrequency: 65.41 },
  "C#": { name: "C#", noteNumbers: [37, 49, 61], baseFrequency: 69.3 },
  D: { name: "D", noteNumbers: [38, 50, 62], baseFrequency: 73.42 },
  "D#": { name: "D#", noteNumbers: [39, 51, 63], baseFrequency: 77.78 },
  E: { name: "E", noteNumbers: [40, 52, 64], baseFrequency: 82.41 },
  F: { name: "F", noteNumbers: [41, 53, 65], baseFrequency: 87.31 },
  "F#": { name: "F#", noteNumbers: [42, 54, 66], baseFrequency: 92.5 },
  G: { name: "G", noteNumbers: [43, 55, 67], baseFrequency: 98.0 },
  "G#": { name: "G#", noteNumbers: [44, 56, 68], baseFrequency: 103.83 },
};
