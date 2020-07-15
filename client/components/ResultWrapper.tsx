import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  bpmDescription,
  ChordName,
  Chords,
  chordsDescription,
  HarmonyResult,
  keyDescription,
  Keys,
  meterDescription,
  replaceAccidentals,
  synthesizeHarmony,
} from "../utils";
import { Button, Progress, Slider, Spin, Tag, Tooltip } from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import toWav from "audiobuffer-to-wav";

const DEFAULT_VOLUME = 50;
const PLAYBACK_INTERVAL = 0.02;

interface ResultWrapperProps {
  ctx: AudioContext;
  loading: boolean;
  melodyFile: File | null;
  progress: number;
  result: HarmonyResult | null;
  setError: Dispatch<SetStateAction<string>>;
  setMelodyDuration: Dispatch<SetStateAction<number>>;
}

/**
 * Wraps WebAudio API functionality in a component that is fetched after AudioContext initialization.
 * Necessary as the WebAudio API is browser-only and is those not available at build time.
 */
export default function ResultWrapper(props: ResultWrapperProps): ReactElement {
  const {
    ctx,
    loading,
    melodyFile,
    progress,
    result,
    setError,
    setMelodyDuration,
  } = props;

  // Melody AudioBufferSourceNode
  const [melodySource, setMelodySource] = useState(ctx.createBufferSource());

  // Harmony AudioBufferSourceNode
  const [harmonySource, setHarmonySource] = useState(ctx.createBufferSource());

  // GainNode used to control harmonySource volume
  const [gainNode] = useState(ctx.createGain());

  // AudioBuffer from the melody file
  const [melodyBuffer, setMelodyBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );

  // AudioBuffer from the harmony file
  const [harmonyBuffer, setHarmonyBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );

  // If the audio is currently playing
  const [playing, setPlaying] = useState(false);

  // Current playtime (seconds) of the audio
  const [playTime, setPlayTime] = useState(0);

  // Harmony volume (0-100, 50: gain of 1) set by user
  const [harmonyVolume, setHarmonyVolume] = useState(DEFAULT_VOLUME);

  /**
   * Set melody buffer on file upload.
   */
  useEffect((): void => {
    if (melodyFile !== null) {
      melodyFile
        .arrayBuffer()
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then(setMelodyBuffer)
        .catch(() => setError(`Error loading ${melodyFile.name} in browser`));
    }
  }, [ctx, melodyFile, setError]);

  /**
   * Synthesize harmony and sets buffer on harmony parameter change.
   */
  useEffect((): void => {
    if (result !== null) {
      synthesizeHarmony(result, melodyBuffer.duration)
        .then((buffer) => {
          // convert Tone.js type into Web Audio API type and set buffer
          const newBuffer = buffer.get();
          if (newBuffer !== undefined) {
            setHarmonyBuffer(newBuffer);
          }
        })
        .catch(() =>
          setError(
            "Error synthesizing audio - please post an issue at https://github.com/arpanlaha/harmonizer/issues"
          )
        );
    }
  }, [result, melodyBuffer, setError]);

  /**
   * Reinitialize melodySource with melodyBuffer.
   */
  const resetMelodySource = useCallback((): void => {
    const newMelodySource = ctx.createBufferSource();
    newMelodySource.buffer = melodyBuffer;
    setMelodySource(newMelodySource);
    setMelodyDuration(melodyBuffer.duration);
  }, [ctx, melodyBuffer, setMelodyDuration]);

  /**
   * Reinitialize harmonySource with harmonyBuffer.
   */
  const resetHarmonySource = useCallback((): void => {
    const newHarmonySource = ctx.createBufferSource();
    newHarmonySource.buffer = harmonyBuffer;
    setHarmonySource(newHarmonySource);
  }, [ctx, harmonyBuffer]);

  /**
   * Reset melodySource on change to melodyBuffer.
   */
  useEffect(resetMelodySource, [melodyBuffer, resetMelodySource]);

  /**
   * Reset harmonySource on change to harmonyBuffer.
   */
  useEffect(resetHarmonySource, [harmonyBuffer, resetHarmonySource]);

  /**
   * Connect gain node to output on initialization.
   */
  useEffect((): void => {
    gainNode.connect(ctx.destination);
  }, [gainNode, ctx]);

  /**
   * Update gain on harmony volume change.
   */
  useEffect((): void => {
    gainNode.gain.value = harmonyVolume / DEFAULT_VOLUME;
  }, [harmonyVolume, gainNode]);

  /**
   * Reset audio player on result changes.
   */
  useEffect((): void => {
    setPlayTime(0);
    setHarmonyVolume(DEFAULT_VOLUME);
  }, [result]);

  /**
   * Assigns a chord a badge color depending on its scale degree in the current key.
   * @param chord the chord to assign a color to
   */
  const getBadgeColor = (chord: ChordName): string =>
    result !== null
      ? ["magenta", "red", "volcano", "orange", "gold", "lime"][
          Keys[result.key].chords.indexOf(chord)
        ]
      : "blue";

  /**
   * Determines the current chord index being played based off of the current playTime.
   */
  const getCurrentChordIndex = (): number =>
    result !== null && melodyBuffer !== null
      ? Math.max(
          Math.min(
            Math.floor(
              (playTime * result.chords.length - result.start) /
                (melodyBuffer.duration - result.start)
            ),
            result.chords.length
          ),
          0
        )
      : -1;

  /**
   * Start harmonized audio playback.
   */
  const handlePlay = (): void => {
    melodySource.connect(ctx.destination);
    harmonySource.connect(gainNode);

    // Fetch current time and reset to start if previous playback finished
    let newPlayTime = playTime;
    if (playTime >= melodyBuffer.duration - PLAYBACK_INTERVAL * 2) {
      newPlayTime = 0;
      setPlayTime(newPlayTime);
    }

    melodySource.start(0, newPlayTime);
    harmonySource.start(0, newPlayTime);
    setPlaying(true);

    // Start timer to update playTime every PLAYBACK_INTERVAL
    const playStartTime = ctx.currentTime;
    const playTimer = setInterval(
      (): void => setPlayTime(ctx.currentTime - playStartTime + newPlayTime),
      PLAYBACK_INTERVAL * 1000
    );

    // Clear timer and reset audioSource on stop
    melodySource.onended = (): void => {
      clearInterval(playTimer);
      resetMelodySource();
      setPlaying(false);
    };

    harmonySource.onended = resetHarmonySource;
  };

  /**
   * Stop harmonized audio playback.
   */
  const handleStop = (): void => {
    melodySource.stop();
    harmonySource.stop();
    setPlaying(false);
  };

  /**
   * Update playTime from slider input.
   * @param newPlayTime slider input value
   */
  const handlePlayTime = (newPlayTime: number): void => {
    if (playing) {
      handleStop();
    }
    setPlayTime(newPlayTime);
  };

  /**
   * Convert time to standard mm:ss format.
   * @param seconds time in seconds
   */
  const formatTime = (seconds: number): string => {
    let secondsLeft = seconds;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft -= minutes * 60;
    const secondsInt = Math.floor(secondsLeft);

    return `${minutes}:${seconds > 10 ? "" : "0"}${secondsInt}`;
  };

  /**
   * Downloads harmonized buffer as wav file.
   */
  const handleDownload = (): void => {
    if (melodyFile !== null) {
      const harmonizedBuffer = ctx.createBuffer(
        melodyBuffer.numberOfChannels,
        melodyBuffer.length,
        ctx.sampleRate
      );
      // harmony is mono
      const harmonyBufferChannel = harmonyBuffer.getChannelData(0);

      // melody has arbitrary channels
      for (
        let channel = 0;
        channel < melodyBuffer.numberOfChannels;
        channel++
      ) {
        const newOverlayBufferChannel = harmonizedBuffer.getChannelData(
          channel
        );
        const melodyBufferChannel = melodyBuffer.getChannelData(channel);
        for (let i = 0; i < melodyBuffer.length; i++) {
          newOverlayBufferChannel[i] =
            melodyBufferChannel[i] +
            harmonyBufferChannel[i] * gainNode.gain.value;
        }
      }

      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.style.display = "none";

      downloadLink.href = window.URL.createObjectURL(
        new window.Blob([new DataView(toWav(harmonizedBuffer))], {
          type: "audio/wav",
        })
      );

      const melodyName = melodyFile.name;
      downloadLink.download = `${melodyName.substring(
        0,
        melodyName.lastIndexOf(".")
      )}_harmonized.wav`;

      downloadLink.click();
      window.URL.revokeObjectURL(downloadLink.href);
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <>
      {melodyFile !== null && (
        <h2 className="center-text">Melody: {melodyFile.name}</h2>
      )}

      {loading && (
        <>
          <Spin className="loader" />
          <Progress
            percent={progress}
            status={progress < 100 ? "active" : "success"}
            showInfo={false}
          />
          <h3 className="center-text">
            {progress < 100
              ? `Uploading (${Math.round(progress)}%)...`
              : "Waiting for results..."}
          </h3>
        </>
      )}

      {result !== null && (
        <>
          <div className="result-row">
            <div className="result-field">
              <Tooltip title={keyDescription} placement="top">
                <h3>Key:</h3>
              </Tooltip>
              <Tooltip
                title={`Chords: ${replaceAccidentals(
                  Keys[result.key].chords.join(", ")
                )}`}
                placement="top"
              >
                <Tag color="blue">{replaceAccidentals(result.key)}</Tag>
              </Tooltip>
            </div>
            <div className="result-field">
              <Tooltip title={bpmDescription} placement="top">
                <h3>BPM:</h3>
              </Tooltip>
              <Tag color="blue">{Math.round(result.bpm)}</Tag>
            </div>
            <div className="result-field">
              <Tooltip title={meterDescription} placement="top">
                <h3>Meter:</h3>
              </Tooltip>
              <Tag color="blue">{Math.round(result.meter)}</Tag>
            </div>
          </div>

          <div className="result-field">
            <Tooltip title={chordsDescription} placement="top">
              <h3>Chords:</h3>
            </Tooltip>
            <div className="flex-row">
              {result.chords.map((chord, chordIndex) => (
                <Tooltip
                  title={`Notes: ${replaceAccidentals(
                    Chords[chord].notes.join(", ")
                  )}`}
                  placement="top"
                  key={chordIndex}
                >
                  <Tag
                    className={
                      chordIndex === getCurrentChordIndex()
                        ? "current-chord-tag"
                        : ""
                    }
                    color={getBadgeColor(chord)}
                  >
                    {replaceAccidentals(chord)}
                  </Tag>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="player">
            <div className="time">
              {formatTime(playTime)} / {formatTime(melodyBuffer.duration)}
            </div>
            <Button type="primary" onClick={playing ? handleStop : handlePlay}>
              {playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
            </Button>
            <Slider
              value={playTime}
              min={0}
              max={melodyBuffer.duration}
              step={PLAYBACK_INTERVAL}
              onChange={handlePlayTime}
              tooltipVisible={false}
            />
          </div>
          <div className="harmony-volume">
            <h4>Harmony volume:</h4>
            <Slider
              value={harmonyVolume}
              min={0}
              max={100}
              onChange={setHarmonyVolume}
            />
          </div>
          <Button className="download" type="primary" onClick={handleDownload}>
            Download (WAV)
          </Button>
        </>
      )}
    </>
  );
}
