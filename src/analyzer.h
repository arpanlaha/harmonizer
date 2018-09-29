#include <essentia/algorithmfactory.h>
#include <essentia/pool.h>
#include <vector>
#include <string>

using std::vector;
using std::string;
using namespace essentia;

namespace harmonizer {
    class Analyzer {
    private:
        float bpm; 
        vector<float> beats;
        string key;
        vector<float> frequencies;

    public:
        Analyzer(const string& file_name);
    };
}