#include "model.h"
#include "../../lib/json/json.hpp"
#include <fstream>

using json = nlohmann::json;
using std::ifstream;

namespace harmonizer {
    Model::Model() {}

    Model::Model(string file_location) {
        ifstream ifs(file_location);
        json j;
        ifs >> j;

        for (auto key_info : j["keys"]) {
            Key key;
            key.setName(key_info["name"]);
            for (auto chord_name : key_info["chords"]) {
                key.addChord(chord_name);
            }
            keys.push_back(key);
            keys_by_name.emplace(key.getName(), key);
        }

        for (auto chord_info : j["chords"]) {
            Chord chord;
            chord.setName(chord_info["name"]);
            for (auto note : chord_info["notes"]) {
                chord.addNote(note);
            }
            chords.push_back(chord);
            chords_by_name.emplace(chord.getName(), chord);
        }

        for (auto pitch_info : j["pitches"]) {
            Pitch pitch;
            pitch.setName(pitch_info["name"]);
            for (auto note_number : pitch_info["note_numbers"]) {
                pitch.addNoteNumber(note_number);
            }
            pitch.setBaseFrequency(pitch_info["base_frequency"]);
            pitches.push_back(pitch);
            pitches_by_name.emplace(pitch.getName(), pitch);
            pitches_by_frequency.emplace(pitch.getFrequencies()[0], pitch);
            //pitch.setMinBaseFrequency(pitch_info["min_base_frequency"]);
            //pitch.setMaxBaseFrequency(pitch_info["max_base_frequency"]);
        }
    }

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

    const Key& Model::getKeyByName(string key_name) {
        return keys_by_name.at(key_name);
    }

    const Chord& Model::getChordByName(string chord_name) {
        return chords_by_name.at(chord_name);
    }

    const Pitch& Model::getPitchByName(string pitch_name) {
        return pitches_by_name.at(pitch_name);
    }

    const Pitch& Model::getPitchByFrequency(double pitch_frequency) {
        return pitches_by_frequency.at(pitch_frequency);
    }
}