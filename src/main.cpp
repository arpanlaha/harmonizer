#include "analyzer.h"
#include "generator.h"
#include <iostream>

using namespace harmonizer;

int main(int argc, char* argv[]) {
    //Invalid case
    if (argc <= 1) {
        std::cout << "Arguments not provided. Use --help for options." << std::endl;
        return 1;
    }

    //Otherwise
    string arg_2 = argv[1];
    if (arg_2 == "--help") {
        string help;
        std::cout << help << std::endl;
    } else if (arg_2.substr(arg_2.size() - 4, arg_2.size()) == ".wav") {
        //run program normally
        Analyzer analyzer(arg_2);
    } else {
        std::cout << "Invalid arguments. Use --help for options." << std::endl;
    }
    return 0;
}