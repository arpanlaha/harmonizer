#include "pitch.h"

namespace harmonizer {

	string Pitch::getName() {
		return name;
	}

	vector<int> Pitch::getNoteNumbers() {
		return note_numbers;
	}

	vector<double> Pitch::getFrequencies() {
		return frequencies;
	}

	double Pitch::getMinBaseFrequency() {
		return min_base_frequency;
	}

	double Pitch::getMaxBaseFrequency() {
		return max_base_frequency;
	}

	void Pitch::setName(string set_name) {
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

	void Pitch::setMinBaseFrequency(double set_min) {
		min_base_frequency = set_min;
	}

	void Pitch::setMaxBaseFrequency(double set_max) {
		max_base_frequency = set_max;
	}
}