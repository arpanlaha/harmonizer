#pragma once

#include "chord.h"

namespace harmonizer {
	class Key { //Class representing a musical key/scale, with its name and name of chords that belong to it
		std::string name;
		std::vector<std::string> chords;
	public:
		Key(); //Default constructor
		std::string getName(); //Basic getters and setters/modifiers
		std::vector<std::string> getChords();
		void setName(std::string new_name);
		void addChord(std::string chord_name);
		bool isMajor(); //Return true if the key is in a Major scale, and false otherwise
	};
}

