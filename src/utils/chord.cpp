#include "chord.h"

namespace harmonizer {

	Chord::Chord() {}

	std::string Chord::getName() {
		return name;
	}

	std::vector<std::string> Chord::getNotes() {
		return notes;
	}

	void Chord::setName(std::string new_name) {
		name = new_name;
	}

	void Chord::addNote(std::string new_note) {
		notes.push_back(new_note);
	}

	bool Chord::containsNote(std::string note) {
		for (std::string chord_note : notes) {
			if (chord_note == note) {
				return true;
			}
		}
		return false;
	}

	double Chord::getNoteScore(std::string note) {
		if (notes[0] == note) {
			return 1.5;
		}
		else if (notes[1] == note || notes[2] == note) {
			return 1;
		}
		return 0;
	}
	
}