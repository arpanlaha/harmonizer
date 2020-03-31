#pragma once

#include <vector>
#include <string>

using std::string;
using std::vector;

namespace harmonizer {
	class Chord { //A class representing a musical chord, with a name and names of notes it contains
	private:
		string name;
		vector<string> notes;
	public:
		Chord(); //Default constructor
		string getName(); //Simple getters and setters/modifiers
		vector<string> getNotes();
		void setName(string new_name);
		void addNote(string new_note);
		bool containsNote(string note); //Return true if inputted note is a member of the chord
		double getNoteScore(string note); //Return value of note in chord (nonzero if in chord, higher if root of chord)
	};
}



