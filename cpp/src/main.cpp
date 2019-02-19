#include "analyzer.h"
#include "generator.h"
#include <iostream>

using namespace harmonizer;
using std::cout;
using std::endl;

int main(int argc, char* argv[]) {
    //Invalid case
    if (argc <= 1) {
        cout << "Arguments not provided. Use --help for options." << endl;
        return 1;
    }

    //Otherwise
    string arg_2 = argv[1];
    if (arg_2 == "--help") {
        string help;
        cout << help << endl;
    } else if (arg_2.substr(arg_2.size() - 4, arg_2.size()) == ".wav") {
        //run program normally
        Analyzer analyzer(arg_2);
        Generator generator(analyzer.getBpm(), analyzer.getBeats(), 4, analyzer.getKey(), analyzer.getFrequencies());
        cout << generator.print();
    } else {
        cout << "Invalid arguments. Use --help for options." << endl;
    }
    return 0;
}