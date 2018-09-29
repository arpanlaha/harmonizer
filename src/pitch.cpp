#include "pitch.h"

namespace harmonizer {

	std::string Pitch::getName() {
		return name;
	}

	std::vector<int> Pitch::getNoteNumbers() {
		return note_numbers;
	}

	std::vector<double> Pitch::getFrequencies() {
		return frequencies;
	}

	void Pitch::setName(std::string set_name) {
		name = set_name;
	}

	void Pitch::addNoteNumber(int add_pitch) {
		note_numbers.push_back(add_pitch);
	}

	void Pitch::setBaseFrequency(double base_frequency) {
		frequencies.push_back(base_frequency);
		for (int i = 0; i < 5; i++) {
			base_frequency *= 2;
			frequencies.push_back(base_frequency);
		}
	}
}