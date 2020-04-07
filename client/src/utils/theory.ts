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

export type PitchName =
  | "Abb"
  | "Ab"
  | "A"
  | "A#"
  | "A##"
  | "Bbb"
  | "Bb"
  | "B"
  | "B#"
  | "Cb"
  | "C"
  | "C#"
  | "C##"
  | "Dbb"
  | "Db"
  | "D"
  | "D#"
  | "D##"
  | "Ebb"
  | "Eb"
  | "E"
  | "E#"
  | "Fb"
  | "F"
  | "F#"
  | "F##"
  | "Gb"
  | "G"
  | "G#"
  | "G##";

export interface Key {
  readonly chords: ChordName[];
}

export interface Chord {
  readonly notes: PitchName[];
}

export const Keys: Record<KeyName, Key> = {
  "Ab Major": {
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
    chords: ["A minor", "C Major", "D minor", "E minor", "F Major", "G Major"],
  },
  "A# Major": {
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
    chords: ["B minor", "D Major", "E minor", "F# minor", "G Major", "A Major"],
  },
  "B# Major": {
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
    chords: ["C Major", "D minor", "E minor", "F Major", "G Major", "A minor"],
  },
  "C minor": {
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
    chords: ["D Major", "E minor", "F# minor", "G Major", "A Major", "B minor"],
  },
  "D minor": {
    chords: ["D minor", "F Major", "G minor", "A minor", "Bb Major", "C Major"],
  },
  "D# Major": {
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
    chords: ["E minor", "G Major", "A minor", "B minor", "C Major", "D Major"],
  },
  "E# Major": {
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
    chords: ["F Major", "G minor", "A minor", "Bb Major", "C Major", "D minor"],
  },
  "F minor": {
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
    chords: ["G Major", "A minor", "B minor", "C Major", "D Major", "E minor"],
  },
  "G minor": {
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
  "Abb Major": { notes: ["Abb", "Cb", "Ebb"] },
  "Ab Major": { notes: ["Ab", "C", "Eb"] },
  "Ab minor": { notes: ["Ab", "Cb", "Eb"] },
  "A Major": { notes: ["A", "C#", "E"] },
  "A minor": { notes: ["A", "C", "E"] },
  "A# Major": { notes: ["A#", "C##", "E#"] },
  "A# minor": { notes: ["A#", "C#", "E#"] },
  "Bbb Major": { notes: ["Bbb", "Db", "Fb"] },
  "Bbb minor": { notes: ["Bbb", "Dbb", "Fb"] },
  "Bb Major": { notes: ["Bb", "D", "F"] },
  "Bb minor": { notes: ["Bb", "Db", "F"] },
  "B Major": { notes: ["B", "D#", "F#"] },
  "B minor": { notes: ["B", "D", "F#"] },
  "B# Major": { notes: ["B#", "D##", "F##"] },
  "B# minor": { notes: ["B#", "D#", "F##"] },
  "Cb Major": { notes: ["Cb", "Eb", "Gb"] },
  "Cb minor": { notes: ["Cb", "Ebb", "Gb"] },
  "C Major": { notes: ["C", "E", "G"] },
  "C minor": { notes: ["C", "Eb", "G"] },
  "C# Major": { notes: ["C#", "E#", "G#"] },
  "C# minor": { notes: ["C#", "E", "G#"] },
  "C## minor": { notes: ["C##", "E#", "G##"] },
  "Dbb Major": { notes: ["Dbb", "Fb", "Abb"] },
  "Db Major": { notes: ["Db", "F", "Ab"] },
  "Db minor": { notes: ["Db", "Fb", "Ab"] },
  "D Major": { notes: ["D", "F#", "A"] },
  "D minor": { notes: ["D", "F", "A"] },
  "D# Major": { notes: ["D#", "F##", "A#"] },
  "D# minor": { notes: ["D#", "F#", "A#"] },
  "D## minor": { notes: ["D##", "F##", "A##"] },
  "Ebb Major": { notes: ["Ebb", "Gb", "Bbb"] },
  "Eb Major": { notes: ["Eb", "G", "Bb"] },
  "Eb minor": { notes: ["Eb", "Gb", "Bb"] },
  "E Major": { notes: ["E", "G#", "B"] },
  "E minor": { notes: ["E", "G", "B"] },
  "E# Major": { notes: ["E#", "G##", "B#"] },
  "E# minor": { notes: ["E#", "G#", "B#"] },
  "Fb Major": { notes: ["Fb", "Ab", "Cb"] },
  "Fb minor": { notes: ["Fb", "Abb", "Cb"] },
  "F Major": { notes: ["F", "A", "C"] },
  "F minor": { notes: ["F", "Ab", "C"] },
  "F# Major": { notes: ["F#", "A#", "C#"] },
  "F# minor": { notes: ["F#", "A", "C#"] },
  "F## Major": { notes: ["F##", "A##", "C##"] },
  "F## minor": { notes: ["F##", "A#", "C##"] },
  "Gb Major": { notes: ["Gb", "Bb", "Db"] },
  "Gb minor": { notes: ["Gb", "Bbb", "Db"] },
  "G Major": { notes: ["G", "B", "D"] },
  "G minor": { notes: ["G", "Bb", "D"] },
  "G# Major": { notes: ["G#", "B#", "D#"] },
  "G# minor": { notes: ["G#", "B", "D#"] },
  "G## minor": { notes: ["G##", "B#", "D##"] },
};
