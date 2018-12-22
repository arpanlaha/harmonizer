#pragma once
#include <vector>
#include <string>

using std::vector;
using std::string;

namespace harmonizer {
    class Analyzer {
    private:
        float bpm; 
        vector<float> beats;
        string key;
        vector<float> frequencies;

    public:
        Analyzer();
        Analyzer(const string& file_name);

        const float& getBpm();
        const vector<float>& getBeats();
        const string& getKey();
        const vector<float>& getFrequencies();
    };
}