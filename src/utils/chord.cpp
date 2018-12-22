#include "chord.h"

namespace harmonizer {

	Chord::Chord() {}

	string Chord::getName() {
		return name;
	}

	vector<string> Chord::getNotes() {
		return notes;
	}

	void Chord::setName(string new_name) {
		name = new_name;
	}

	void Chord::addNote(string new_note) {
		notes.push_back(new_note);
	}

	bool Chord::containsNote(string note) {
		for (string chord_note : notes) {
			if (chord_note == note) {
				return true;
			}
		}
		return false;
	}

	double Chord::getNoteScore(string note) {
		if (notes[0] == note) {
			return 1.5;
		}
		else if (notes[1] == note || notes[2] == note) {
			return 1;
		}
		return 0;
	}
	
}