EXENAME = harmonize

CXX = clang++
CXXFLAGS = -std=c++11 -g -O0 -Wall -Wextra -I/usr/local/include/

all : $(EXENAME)

$(EXENAME): chord.o generator.o key.o model.o pitch.o src/chord.h src/generator.h src/key.h src/model.h src/pitch.h
	$(CXX) $(CXXFLAGS) src/main.cpp chord.o generator.o key.o model.o pitch.o -L/usr/local/lib -lessentia -lstk -o $(EXENAME) 

chord.o: src/chord.h src/chord.cpp
	$(CXX) $(CXXFLAGS) -c src/chord.cpp

generator.o: src/generator.h src/generator.cpp
	$(CXX) $(CXXFLAGS) -c src/generator.cpp

key.o: src/key.h src/key.cpp
	$(CXX) $(CXXFLAGS) -c src/key.cpp

model.o: src/model.h src/model.cpp
	$(CXX) $(CXXFLAGS) -c src/model.cpp

pitch.o: src/pitch.h src/pitch.cpp
	$(CXX) $(CXXFLAGS) -c src/pitch.cpp

.PHONY: clean
clean:
	rm -f *.o $(EXENAME)