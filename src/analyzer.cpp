#include "analyzer.h"

using namespace essentia;
using namespace essentia::standard;

namespace harmonizer {  
    Analyzer::Analyzer() {}

    Analyzer::Analyzer(const string& file_name) {
        essentia::init();
        Pool pool;        

        AlgorithmFactory& factory = AlgorithmFactory::instance();

        Algorithm* loader = factory.create("MonoLoader", "filename", file_name);

        Algorithm* pre_pitch = factory.create("PitchMelodia");
        Algorithm* pitch = factory.create("PitchFilter");

        Algorithm* rhythm = factory.create("RhythmExtractor");

        Algorithm* key_extractor = factory.create("KeyExtractor");
        
        vector<Real> signal;
        vector<Real> pitches;
        vector<Real> pitch_confidences;
        vector<Real> estimates;
        vector<Real> bpmIntervals;
        string key_note;
        string key_scale;
        Real strength;

        loader->output("audio").set(signal);

        pre_pitch->input("signal").set(signal);
        pre_pitch->output("pitch").set(pitches);
        pre_pitch->output("pitchConfidence").set(pitch_confidences);
        pitch->input("pitch").set(pitches);
        pitch->input("pitchConfidence").set(pitch_confidences);
        pitch->output("pitchFiltered").set(frequencies);

        rhythm->input("signal").set(signal);
        rhythm->output("bpm").set(bpm);
        rhythm->output("ticks").set(beats);
        rhythm->output("estimates").set(estimates); //unused
        rhythm->output("bpmIntervals").set(bpmIntervals); //unused

        key_extractor->input("audio").set(signal);
        key_extractor->output("key").set(key_note);
        key_extractor->output("scale").set(key_scale);
        key_extractor->output("strength").set(strength); //unused

        loader->compute();
        pre_pitch->compute();
        pitch->compute();
        rhythm->compute();
  
        key_extractor->compute();

        key = key_note + " " + key_scale;

        delete loader;
        delete pre_pitch;
        delete pitch;
        delete rhythm;
        delete key_extractor;
        essentia::shutdown();
    }
    
    float& Analyzer::getBpm() {
        return bpm;
    }

    vector<float>& Analyzer::getBeats() {
        return beats;
    }

    string& Analyzer::getKey() {
        return key;
    }

    vector<float>& Analyzer::getFrequencies() {
        return frequencies;
    }
}