#pragma once

#include "key.h"
#include "pitch.h"
#include <unordered_map>

using std::string;
using std::vector;
using std::unordered_map;

namespace harmonizer {
    class Model { //A class containing music theory rules, with lists of valid Key, Chord, and Pitch objects
    private:
        vector<Key> keys;
        vector<Chord> chords;
        vector<Pitch> pitches;

        unordered_map<string, Key> keys_by_name;
        unordered_map<string, Chord> chords_by_name;
        unordered_map<string, Pitch> pitches_by_name;
        unordered_map<double, Pitch> pitches_by_frequency;

    public:
        //Constructors
        Model(); 
        Model(string file_location); //Constructor from JSON file

        //Basic getters
        vector<Key> getKeys();
        vector<Chord> getChords();
        vector<Pitch> getPitches();

        //Member getters
        vector<string> getKeyNames();
        vector<string> getChordNames();
        vector<string> getPitchNames();
        vector<double> getPitchFrequencies();

        //Map getters
        unordered_map<string, Key>& getKeyMap();
        unordered_map<string, Chord>& getChordMap();
        unordered_map<string, Pitch>& getPitchNameMap();
        unordered_map<double, Pitch>& getPitchFrequencyMap();

        //Retrieve by member
        const Key& getKeyByName(string key_name);
        const Chord& getChordByName(string chord_name);
        const Pitch& getPitchByName(string pitch_name);
        const Pitch& getPitchByFrequency(double pitch_frequency);
    };
}