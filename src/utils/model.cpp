#include "model.h"

namespace harmonizer {
    Model::Model() {}

    vector<Key> Model::getKeys() {
        return keys;
    }

    vector<Chord> Model::getChords() {
        return chords;
    }

    vector<Pitch> Model::getPitches() {
        return pitches;
    }

    vector<string> Model::getKeyNames() {
        vector<string> key_names;
        key_names.reserve(keys.size());
        for (Key key : keys) {
            key_names.push_back(key.getName());
        }
        return key_names;
    }

    vector<string> Model::getChordNames() {
        vector<string> chord_names;
        chord_names.reserve(chords.size());
        for (Chord chord : chords) {
            chord_names.push_back(chord.getName());
        }
        return chord_names;
    }

    vector<string> Model::getPitchNames() {
        vector<string> pitch_names;
        pitch_names.reserve(pitches.size());
        for (Pitch pitch : pitches) {
            pitch_names.push_back(pitch.getName());
        }
        return pitch_names;
    }

    vector<double> Model::getPitchFrequencies() {
        vector<double> pitch_frequencies;
        pitch_frequencies.reserve(pitches.size());
        for (Pitch pitch : pitches) {
            pitch_frequencies.push_back(pitch.getFrequencies()[0]);
        }
        return pitch_frequencies;
    }

    unordered_map<string, Key>& Model::getKeyMap() {
        return keys_by_name;
    }

    unordered_map<string, Chord>& Model::getChordMap() {
        return chords_by_name;
    }

    unordered_map<string, Pitch>& Model::getPitchNameMap() {
        return pitches_by_name;
    }

    unordered_map<double, Pitch>& Model::getPitchFrequencyMap() {
        return pitches_by_frequency;
    }

    Key& Model::getKeyByName(string key_name) {
        return keys_by_name.at(key_name);
    }

    Chord& Model::getChordByName(string chord_name) {
        return chords_by_name.at(chord_name);
    }

    Pitch& Model::getPitchByName(string pitch_name) {
        return pitches_by_name.at(pitch_name);
    }

    Pitch& Model::getPitchByFrequency(double pitch_frequency) {
        return pitches_by_frequency.at(pitch_frequency);
    }
}