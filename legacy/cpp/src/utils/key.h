#pragma once

#include "chord.h"
using std::string;
using std::vector;

namespace harmonizer {
	class Key { //Class representing a musical key/scale, with its name and name of chords that belong to it
		string name;
		vector<string> chords;
	public:
		Key(); //Default constructor
		string getName(); //Basic getters and setters/modifiers
		vector<string> getChords();
		void setName(string new_name);
		void addChord(string chord_name);
		bool isMajor(); //Return true if the key is in a Major scale, and false otherwise
	};
}

