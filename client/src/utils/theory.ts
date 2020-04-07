export type ChordName =
  | "Abb Major"
  | "Ab Major"
  | "Ab minor"
  | "A Major"
  | "A minor"
  | "A# Major"
  | "A# minor"
  | "Bbb Major"
  | "Bbb minor"
  | "Bb Major"
  | "Bb minor"
  | "B Major"
  | "B minor"
  | "B# Major"
  | "B# minor"
  | "Cb Major"
  | "Cb minor"
  | "C Major"
  | "C minor"
  | "C# Major"
  | "C# minor"
  | "C## minor"
  | "Dbb Major"
  | "Db Major"
  | "Db minor"
  | "D Major"
  | "D minor"
  | "D# Major"
  | "D# minor"
  | "D## minor"
  | "Ebb Major"
  | "Eb Major"
  | "Eb minor"
  | "E Major"
  | "E minor"
  | "E# Major"
  | "E# minor"
  | "Fb Major"
  | "Fb minor"
  | "F Major"
  | "F minor"
  | "F# Major"
  | "F# minor"
  | "F## Major"
  | "F## minor"
  | "Gb Major"
  | "Gb minor"
  | "G Major"
  | "G minor"
  | "G# Major"
  | "G# minor"
  | "G## minor";

export interface Key {
  readonly name: KeyName;
  readonly chords: ChordName[];
}

export type KeyName =
  | "Ab Major"
  | "Ab minor"
  | "A Major"
  | "A minor"
  | "A# Major"
  | "A# minor"
  | "Bb Major"
  | "Bb minor"
  | "B Major"
  | "B minor"
  | "B# Major"
  | "B# minor"
  | "Cb Major"
  | "Cb minor"
  | "C Major"
  | "C minor"
  | "C# Major"
  | "C# minor"
  | "Db Major"
  | "Db minor"
  | "D Major"
  | "D minor"
  | "D# Major"
  | "D# minor"
  | "Eb Major"
  | "Eb minor"
  | "E Major"
  | "E minor"
  | "E# Major"
  | "E# minor"
  | "Fb Major"
  | "Fb minor"
  | "F Major"
  | "F minor"
  | "F# Major"
  | "F# minor"
  | "Gb Major"
  | "Gb minor"
  | "G Major"
  | "G minor"
  | "G# Major"
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
  "Ab Major": {
    name: "Ab Major",
    chords: [
      "Ab Major",
      "Bb minor",
      "C minor",
      "Db Major",
      "Eb Major",
      "F minor",
    ],
  },
  "Ab minor": {
    name: "Ab minor",
    chords: [
      "Ab minor",
      "Cb Major",
      "Db minor",
      "Eb minor",
      "Fb Major",
      "Gb Major",
    ],
  },
  "A Major": {
    name: "A Major",
    chords: [
      "A Major",
      "B minor",
      "C# minor",
      "D Major",
      "E Major",
      "F# minor",
    ],
  },
  "A minor": {
    name: "A minor",
    chords: ["A minor", "C Major", "D minor", "E minor", "F Major", "G Major"],
  },
  "A# Major": {
    name: "A# Major",
    chords: [
      "A# Major",
      "B# minor",
      "C## minor",
      "D# Major",
      "E# Major",
      "F## minor",
    ],
  },
  "A# minor": {
    name: "A# minor",
    chords: [
      "A# minor",
      "C# Major",
      "D# minor",
      "E# minor",
      "F# Major",
      "G# Major",
    ],
  },
  "Bb Major": {
    name: "Bb Major",
    chords: [
      "Bb Major",
      "C minor",
      "D minor",
      "Eb Major",
      "F Major",
      "G minor",
    ],
  },
  "Bb minor": {
    name: "Bb minor",
    chords: [
      "Bb minor",
      "Db Major",
      "Eb minor",
      "F minor",
      "Gb Major",
      "Ab Major",
    ],
  },
  "B Major": {
    name: "B Major",
    chords: [
      "B Major",
      "C# minor",
      "D# minor",
      "E Major",
      "F# Major",
      "G# minor",
    ],
  },
  "B minor": {
    name: "B minor",
    chords: ["B minor", "D Major", "E minor", "F# minor", "G Major", "A Major"],
  },
  "B# Major": {
    name: "B# Major",
    chords: [
      "B# Major",
      "C## minor",
      "D## minor",
      "E# Major",
      "F## Major",
      "G## minor",
    ],
  },
  "B# minor": {
    name: "B# minor",
    chords: [
      "B# minor",
      "D# Major",
      "E# minor",
      "F## minor",
      "G# Major",
      "A# Major",
    ],
  },
  "Cb Major": {
    name: "Cb Major",
    chords: [
      "Cb Major",
      "Db minor",
      "Eb minor",
      "Fb Major",
      "Gb Major",
      "Ab minor",
    ],
  },
  "Cb minor": {
    name: "Cb minor",
    chords: [
      "Cb minor",
      "Ebb Major",
      "Fb minor",
      "Gb minor",
      "Abb Major",
      "Bbb Major",
    ],
  },
  "C Major": {
    name: "C Major",
    chords: ["C Major", "D minor", "E minor", "F Major", "G Major", "A minor"],
  },
  "C minor": {
    name: "C minor",
    chords: [
      "C minor",
      "Eb Major",
      "F minor",
      "G minor",
      "Ab Major",
      "Bb Major",
    ],
  },
  "C# Major": {
    name: "C# Major",
    chords: [
      "C# Major",
      "D# minor",
      "E# minor",
      "F# Major",
      "G# Major",
      "A# minor",
    ],
  },
  "C# minor": {
    name: "C# minor",
    chords: [
      "C# minor",
      "E Major",
      "F# minor",
      "G# minor",
      "A Major",
      "B Major",
    ],
  },
  "Db Major": {
    name: "Db Major",
    chords: [
      "Db Major",
      "Eb minor",
      "F minor",
      "Gb Major",
      "Ab Major",
      "Bb minor",
    ],
  },
  "Db minor": {
    name: "Db minor",
    chords: [
      "Db minor",
      "Fb Major",
      "Gb minor",
      "Ab minor",
      "Bbb Major",
      "Cb Major",
    ],
  },
  "D Major": {
    name: "D Major",
    chords: ["D Major", "E minor", "F# minor", "G Major", "A Major", "B minor"],
  },
  "D minor": {
    name: "D minor",
    chords: ["D minor", "F Major", "G minor", "A minor", "Bb Major", "C Major"],
  },
  "D# Major": {
    name: "D# Major",
    chords: [
      "D# Major",
      "E# minor",
      "F## minor",
      "G# Major",
      "A# Major",
      "B# minor",
    ],
  },
  "D# minor": {
    name: "D# minor",
    chords: [
      "D# minor",
      "F# Major",
      "G# minor",
      "A# minor",
      "B Major",
      "C# Major",
    ],
  },
  "Eb Major": {
    name: "Eb Major",
    chords: [
      "Eb Major",
      "F minor",
      "G minor",
      "Ab Major",
      "Bb Major",
      "C minor",
    ],
  },
  "Eb minor": {
    name: "Eb minor",
    chords: [
      "Eb minor",
      "Gb Major",
      "Ab minor",
      "Bb minor",
      "Cb Major",
      "Db Major",
    ],
  },
  "E Major": {
    name: "E Major",
    chords: [
      "E Major",
      "F# minor",
      "G# minor",
      "A Major",
      "B Major",
      "C# minor",
    ],
  },
  "E minor": {
    name: "E minor",
    chords: ["E minor", "G Major", "A minor", "B minor", "C Major", "D Major"],
  },
  "E# Major": {
    name: "E# Major",
    chords: [
      "E# Major",
      "F## minor",
      "G## minor",
      "A# Major",
      "B# Major",
      "C## minor",
    ],
  },
  "E# minor": {
    name: "E# minor",
    chords: [
      "E# minor",
      "G# Major",
      "A# minor",
      "B# minor",
      "C# Major",
      "D# Major",
    ],
  },
  "Fb Major": {
    name: "Fb Major",
    chords: [
      "Fb Major",
      "Gb minor",
      "Ab minor",
      "Bbb Major",
      "Cb Major",
      "Db minor",
    ],
  },
  "Fb minor": {
    name: "Fb minor",
    chords: [
      "Fb minor",
      "Abb Major",
      "Bbb minor",
      "Cb minor",
      "Dbb Major",
      "Ebb Major",
    ],
  },
  "F Major": {
    name: "F Major",
    chords: ["F Major", "G minor", "A minor", "Bb Major", "C Major", "D minor"],
  },
  "F minor": {
    name: "F minor",
    chords: [
      "F minor",
      "Ab Major",
      "Bb minor",
      "C minor",
      "Db Major",
      "Eb Major",
    ],
  },
  "F# Major": {
    name: "F# Major",
    chords: [
      "F# Major",
      "G# minor",
      "A# minor",
      "Bb Major",
      "C# Major",
      "D# minor",
    ],
  },
  "F# minor": {
    name: "F# minor",
    chords: [
      "F# minor",
      "A Major",
      "B minor",
      "C# minor",
      "D Major",
      "E Major",
    ],
  },
  "Gb Major": {
    name: "Gb Major",
    chords: [
      "Gb Major",
      "Ab minor",
      "Bb minor",
      "B Major",
      "Db Major",
      "Eb minor",
    ],
  },
  "Gb minor": {
    name: "Gb minor",
    chords: [
      "Gb minor",
      "Bbb Major",
      "Cb minor",
      "Db minor",
      "Ebb Major",
      "Fb Major",
    ],
  },
  "G Major": {
    name: "G Major",
    chords: ["G Major", "A minor", "B minor", "C Major", "D Major", "E minor"],
  },
  "G minor": {
    name: "G minor",
    chords: [
      "G minor",
      "Bb Major",
      "C minor",
      "D minor",
      "Eb Major",
      "F Major",
    ],
  },
  "G# Major": {
    name: "G# Major",
    chords: [
      "G# Major",
      "A# minor",
      "B# minor",
      "C# Major",
      "D# Major",
      "E# minor",
    ],
  },
  "G# minor": {
    name: "G# minor",
    chords: [
      "G# minor",
      "B Major",
      "C# minor",
      "Eb minor",
      "E Major",
      "Gb Major",
    ],
  },
};

export const Chords: Record<ChordName, Chord> = {
  "Abb Major": { name: "Abb Major", notes: ["G", "B", "D"] },
  "Ab Major": { name: "Ab Major", notes: ["G#", "C", "D#"] },
  "Ab minor": { name: "Ab minor", notes: ["G#", "B", "D#"] },
  "A Major": { name: "A Major", notes: ["A", "C#", "E"] },
  "A minor": { name: "A minor", notes: ["A", "C", "E"] },
  "A# Major": { name: "A# Major", notes: ["A#", "D", "F"] },
  "A# minor": { name: "A# minor", notes: ["A#", "C#", "F"] },
  "Bbb Major": { name: "Bbb Major", notes: ["A", "C#", "E"] },
  "Bbb minor": { name: "Bbb minor", notes: ["A", "C", "E"] },
  "Bb Major": { name: "Bb Major", notes: ["A#", "D", "F"] },
  "Bb minor": { name: "Bb minor", notes: ["A#", "C#", "F"] },
  "B Major": { name: "B Major", notes: ["B", "D#", "F#"] },
  "B minor": { name: "B minor", notes: ["B", "D", "F#"] },
  "B# Major": { name: "B# Major", notes: ["C", "E", "G"] },
  "B# minor": { name: "B# minor", notes: ["C", "D#", "G"] },
  "Cb Major": { name: "Cb Major", notes: ["B", "D#", "F#"] },
  "Cb minor": { name: "Cb minor", notes: ["B", "D", "F#"] },
  "C Major": { name: "C Major", notes: ["C", "E", "G"] },
  "C minor": { name: "C minor", notes: ["C", "D#", "G"] },
  "C# Major": { name: "C# Major", notes: ["C#", "F", "G#"] },
  "C# minor": { name: "C# minor", notes: ["C#", "E", "G#"] },
  "C## minor": { name: "C## minor", notes: ["D", "F", "A"] },
  "Dbb Major": { name: "Dbb Major", notes: ["C", "E", "G"] },
  "Db Major": { name: "Db Major", notes: ["C#", "F", "G#"] },
  "Db minor": { name: "Db minor", notes: ["C#", "E", "G#"] },
  "D Major": { name: "D Major", notes: ["D", "F#", "A"] },
  "D minor": { name: "D minor", notes: ["D", "F", "A"] },
  "D# Major": { name: "D# Major", notes: ["D#", "G", "A#"] },
  "D# minor": { name: "D# minor", notes: ["D#", "F#", "A#"] },
  "D## minor": { name: "D## minor", notes: ["E", "G", "B"] },
  "Ebb Major": { name: "Ebb Major", notes: ["D", "F#", "A"] },
  "Eb Major": { name: "Eb Major", notes: ["D#", "G", "A#"] },
  "Eb minor": { name: "Eb minor", notes: ["D#", "F#", "A#"] },
  "E Major": { name: "E Major", notes: ["E", "G#", "B"] },
  "E minor": { name: "E minor", notes: ["E", "G", "B"] },
  "E# Major": { name: "E# Major", notes: ["F", "A", "C"] },
  "E# minor": { name: "E# minor", notes: ["F", "G#", "C"] },
  "Fb Major": { name: "Fb Major", notes: ["E", "G#", "B"] },
  "Fb minor": { name: "Fb minor", notes: ["E", "G", "B"] },
  "F Major": { name: "F Major", notes: ["F", "A", "C"] },
  "F minor": { name: "F minor", notes: ["F", "G#", "C"] },
  "F# Major": { name: "F# Major", notes: ["F#", "A#", "C#"] },
  "F# minor": { name: "F# minor", notes: ["F#", "A", "C#"] },
  "F## Major": { name: "F## Major", notes: ["G", "B", "D"] },
  "F## minor": { name: "F## minor", notes: ["G", "A#", "D"] },
  "Gb Major": { name: "Gb Major", notes: ["F#", "A#", "C#"] },
  "Gb minor": { name: "Gb minor", notes: ["F#", "A", "C#"] },
  "G Major": { name: "G Major", notes: ["G", "B", "D"] },
  "G minor": { name: "G minor", notes: ["G", "A#", "D"] },
  "G# Major": { name: "G# Major", notes: ["G#", "C", "D#"] },
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
