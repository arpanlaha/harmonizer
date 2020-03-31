#include "key.h"

namespace harmonizer {

	Key::Key() {}

	string Key::getName() {
		return name;
	}

	vector<string> Key::getChords(){
		return chords;
	}

	void Key::setName(string new_name) {
		name = new_name;
	}

	void Key::addChord(string chord_name) {
		chords.push_back(chord_name);
	}

	bool Key::isMajor() {
		return name.find("Major") == 2;
	}
}