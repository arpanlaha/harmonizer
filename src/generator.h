#pragma once
#include "utils/model.h"

namespace harmonizer {
    class Generator {
    private:
        float bpm;
        vector<float> beats;
        int meter;
        Key key;
        vector<float> frequencies;
        Model model;
        vector<Chord> progression;

    public:
        Generator();
        Generator(float in_bpm, vector<float> in_beats, int in_meter, string in_key_name, vector<float> in_frequencies);

        float& getBpm();
        vector<float>& getBeats();
        Key& getKey();
        vector<float>& getFrequencies();
        vector<Chord>& getProgression();

        void generateProgression();
    };
}