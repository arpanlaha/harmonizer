#pragma once

#include <vector>
#include <string>

namespace harmonizer {
	class Chord { //A class representing a musical chord, with a name and names of notes it contains
		std::string name;
		std::vector<std::string> notes;
	public:
		Chord(); //Default constructor
		std::string getName(); //Simple getters and setters/modifiers
		std::vector<std::string> getNotes();
		void setName(std::string new_name);
		void addNote(std::string new_note);
		bool containsNote(std::string note); //Return true if inputted note is a member of the chord
		double getNoteScore(std::string note); //Return value of note in chord (nonzero if in chord, higher if root of chord)
	};
}



