#pragma once

#include <string>
#include <vector>
using std::string;
using std::vector;

namespace harmonizer {
	class Pitch { //A class corresponding to a musical pitch (A, B, C#, etc), with its name, note numbers (MIDI), and frequencies
		string name;
		vector<int> note_numbers;
		vector<double> frequencies;
		double min_base_frequency;
		double max_base_frequency;
	public:
		Pitch() {}; //Default constructor
		string getName(); //Basic getters and setters/modifiers
		vector<int> getNoteNumbers();
		vector<double> getFrequencies();
		double getMinBaseFrequency();
		double getMaxBaseFrequency();
		void setName(string set_name);
		void addNoteNumber(int note_number);
		void setBaseFrequency(double base_frequency); //Sets base (lowest) frequency, since octaves multiply by two, this builds all other frequencies
		void setMinBaseFrequency(double set_min);
		void setMaxBaseFrequency(double set_max);
	};
}
