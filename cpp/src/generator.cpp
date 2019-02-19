#include "generator.h"
#include <cmath>

using std::ceil;
using std::round;
using std::to_string;

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

    const float& Generator::getBpm() {
        return bpm;
    }

    const vector<float>& Generator::getBeats() {
        return beats;
    }

    const Key& Generator::getKey() {
        return key;
    }

    const vector<float>& Generator::getFrequencies() {
        return frequencies;
    }

    const vector<Chord>& Generator::getProgression() {
        return progression;
    }

    void Generator::generateProgression() {
        vector<string> chord_names = key.getChords();
        progression.reserve(ceil((double) (beats.size() + 1) / meter));

        progression[0] = model.getChordByName(chord_names[0]);
        
        progression[progression.size() - 1] = model.getChordByName(chord_names[0]);

        for (int measure = progression.size() - 1; measure > 0; measure--) {
            
        }
    }

    string Generator::print() {
        string key_info = "Key: " + key.getName() + "\n";
        string bpm_info = "Tempo: " + to_string((int) round(bpm)) + " beats per minute\n";
        string meter_info = "Meter: " + to_string(meter) + " beats per measure\n";
        //add progression print
        return key_info + bpm_info + meter_info;
    }
}