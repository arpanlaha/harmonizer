#pragma once

#include <string>
#include <vector>

namespace harmonizer {
	class Pitch { //A class corresponding to a musical pitch (A, B, C#, etc), with its name, note numbers (MIDI), and frequencies
		std::string name;
		std::vector<int> note_numbers;
		std::vector<double> frequencies;
	public:
		Pitch() {}; //Default constructor
		std::string getName(); //Basic getters and setters/modifiers
		std::vector<int> getNoteNumbers();
		std::vector<double> getFrequencies();
		void setName(std::string set_name);
		void addNoteNumber(int note_number);
		void setBaseFrequency(double base_frequency); //Sets base (lowest) frequency
		                                              //since octaves multiply by two, this builds all other frequencies
	};
}
