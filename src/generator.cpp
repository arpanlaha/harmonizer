#include "generator.h"
#include <cmath>

using std::ceil;

namespace harmonizer {
    Generator::Generator() {}

    Generator::Generator(float in_bpm, vector<float> in_beats, int in_meter, string in_key_name, vector<float> in_frequencies) {
        bpm = in_bpm;
        beats = in_beats;
        meter = in_meter;
        frequencies = in_frequencies;
        model = Model("data/model.json");
        key = model.getKeyByName(in_key_name);
    }

    float& Generator::getBpm() {
        return bpm;
    }

    vector<float>& Generator::getBeats() {
        return beats;
    }

    Key& Generator::getKey() {
        return key;
    }

    vector<float>& Generator::getFrequencies() {
        return frequencies;
    }

    vector<Chord>& Generator::getProgression() {
        return progression;
    }

    void Generator::generateProgression() {
        vector<string> chord_names = key.getChords();
        progression.reserve(ceil((double) beats.size() / meter));

        progression[0] = model.getChordByName(chord_names[0]);
        
        progression[progression.size() - 1] = model.getChordByName(chord_names[0]);

        for (int measure = progression.size() - 1; measure > 0; measure--) {

        }
    }
}