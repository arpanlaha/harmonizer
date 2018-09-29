EXENAME = harmonize

CXX = clang++
CXXFLAGS = -std=c++11 -g -O0 -Wall -Wextra -I/usr/local/include/

all : $(EXENAME)

$(EXENAME): analyzer.o generator.o chord.o key.o model.o pitch.o src/analyzer.h src/generator.h src/utils/chord.h src/utils/key.h src/utils/model.h src/utils/pitch.h
	$(CXX) $(CXXFLAGS) src/main.cpp analyzer.o generator.o chord.o key.o model.o pitch.o -L/usr/local/lib -lessentia -lfftw3 -lyaml -lavcodec -lavformat -lavutil -lavresample -lsamplerate -ltag -lfftw3f -lstk -o $(EXENAME) 

analyzer.o: src/analyzer.h src/analyzer.cpp
	$(CXX) $(CXXFLAGS) -c src/analyzer.cpp

generator.o: src/generator.h src/generator.cpp
	$(CXX) $(CXXFLAGS) -c src/generator.cpp

chord.o: src/utils/chord.h src/utils/chord.cpp
	$(CXX) $(CXXFLAGS) -c src/utils/chord.cpp

key.o: src/utils/key.h src/utils/key.cpp
	$(CXX) $(CXXFLAGS) -c src/utils/key.cpp

model.o: src/utils/model.h src/utils/model.cpp
	$(CXX) $(CXXFLAGS) -c src/utils/model.cpp

pitch.o: src/utils/pitch.h src/utils/pitch.cpp
	$(CXX) $(CXXFLAGS) -c src/utils/pitch.cpp

.PHONY: clean
clean:
	rm -f *.o $(EXENAME)