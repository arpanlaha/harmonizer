#include "key.h"

namespace harmonizer {

	Key::Key() {}

	std::string Key::getName() {
		return name;
	}

	std::vector<std::string> Key::getChords(){
		return chords;
	}

	void Key::setName(std::string new_name) {
		name = new_name;
	}

	void Key::addChord(std::string chord_name) {
		chords.push_back(chord_name);
	}

	bool Key::isMajor() {
		return name.find("Major") == 2;
	}
}