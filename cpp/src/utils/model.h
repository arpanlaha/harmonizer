#pragma once

#include "key.h"
#include "pitch.h"
#include <unordered_map>

using std::string;
using std::vector;
using std::unordered_map;

namespace harmonizer {

    #define A_PITCH       55.00;
    #define A_SHARP_PITCH 58.27;
    #define B_PITCH       61.74;
    #define C_PITCH       65.41;
    #define C_SHARP_PITCH 69.30;
    #define D_PITCH       73.42;
    #define D_SHARP_PITCH 77.78;
    #define E_PITCH       82.41;
    #define F_PITCH       87.31;
    #define F_SHARP_PITCH 92.50;
    #define G_PITCH       98.00;
    #define G_SHARP_PITCH 103.83;

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