import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { AudioContext, ChordName, Chords, KeyName } from "./utils";
import { Head } from "./components";
import { Alert, Button, Progress, Slider, Spin, Upload } from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import { SliderValue } from "antd/lib/slider";
import { UploadChangeParam } from "antd/lib/upload";
import { FMSynth, Transport, Offline } from "tone";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "./styles/style.scss";

const PLAYBACK_INTERVAL = 0.02;
const Synth = FMSynth;
const { ctx } = AudioContext;

interface HarmonizeResult {
  bpm: number;
  chords: ChordName[];
  key: KeyName;
  meter: number;
  start: number;
}

export default function Harmonizer(): ReactElement {
  const [melodyFile, setMelodyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(-1);
  const [error, setError] = useState("");
  const [result, setResult] = useState<HarmonizeResult | null>(null);
  const [audioSource, setAudioSource] = useState(ctx.createBufferSource());
  const [melodyBuffer, setMelodyBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );
  const [harmonyBuffer, setHarmonyBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );
  const [overlayBuffer, setOverlayBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );
  const [playing, setPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);

  /**
   * Set melody buffer on file upload
   */
  useEffect((): void => {
    if (melodyFile !== null) {
      melodyFile
        .arrayBuffer()
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then(setMelodyBuffer)
        .catch(() => setError(`Error loading ${melodyFile.name} in browser`));
    }
  }, [melodyFile, setMelodyBuffer]);

  /**
   * Synthesize harmony and sets buffer on harmony parameter change
   */
  useEffect((): void => {
    if (result !== null) {
      const { bpm, chords, meter, start } = result;
      Transport.bpm.value = bpm;
      const measureLength = (60 * meter) / bpm;
      console.log(measureLength);

      // synthesize audio and render into output buffer
      Offline((): void => {
        // Ooe synth per chord note
        const synths = [
          new Synth().toDestination(),
          new Synth().toDestination(),
          new Synth().toDestination(),
        ];

        // decreasing order of volume: tonic, dominant, mediant
        const decibelDiff = 2;
        synths[1].volume.value -= decibelDiff * 2;
        synths[2].volume.value -= decibelDiff;

        // trigger 3 * chord progression length attack/releases
        chords.forEach((chord, chordIndex): void =>
          synths.forEach(
            (synth, synthIndex): FMSynth =>
              synth.triggerAttackRelease(
                `${Chords[chord].notes[synthIndex]}3`,
                measureLength,
                measureLength * chordIndex + start
              )
          )
        );
      }, melodyBuffer.duration).then((buffer): void => {
        // convert Tone.js type into Web Audio API type and set buffer
        const newBuffer = buffer.get();
        if (newBuffer !== undefined) {
          setHarmonyBuffer(newBuffer);
        }
      });
    }
  }, [result, melodyBuffer]);

  /**
   * Overlay melody and harmony buffers when either is changed
   */
  useEffect((): void => {
    // initialize new overlay buffer
    const newOverlayBuffer = ctx.createBuffer(
      melodyBuffer.numberOfChannels,
      melodyBuffer.length,
      ctx.sampleRate
    );
    // harmony is mono
    const harmonyBufferChannel = harmonyBuffer.getChannelData(0);

    // melody has arbitrary channels
    for (let channel = 0; channel < 1; channel++) {
      const newOverlayBufferChannel = newOverlayBuffer.getChannelData(channel);
      const melodyBufferChannel = melodyBuffer.getChannelData(channel);
      for (let i = 0; i < melodyBuffer.length; i++) {
        newOverlayBufferChannel[i] =
          melodyBufferChannel[i] + harmonyBufferChannel[i];
      }
    }
    setOverlayBuffer(newOverlayBuffer);
  }, [melodyBuffer, harmonyBuffer]);

  /**
   * Reinitialize audioSource with overlayBuffer
   */
  const resetAudioSource = useCallback((): void => {
    const newAudioSource = ctx.createBufferSource();
    newAudioSource.buffer = overlayBuffer;
    setAudioSource(newAudioSource);
  }, [overlayBuffer, setAudioSource]);

  /**
   * Reset audioSource on chnange to overlayBuffer
   */
  useEffect((): void => resetAudioSource(), [overlayBuffer, resetAudioSource]);

  /**
   * Reset application state prior to new upload
   * @param file the melody file being uploaded
   */
  const beforeUpload = (file: File): boolean => {
    setLoading(true);
    setError("");
    setPercent(-1);
    setResult(null);
    setMelodyFile(file);
    setPlayTime(0);
    return true;
  };

  /**
   * Update application state on upload change
   * @param uploadChange the upload change object
   */
  const handleUpload = (uploadChange: UploadChangeParam): void => {
    const { file, event } = uploadChange;
    const { response, status } = file;

    if (status === "uploading" && event !== undefined) {
      // update progress bar
      setPercent(event.percent);
    } else if (status === "done") {
      // set result and end loading
      setResult(response.result);
      setLoading(false);
    } else if (status === "error") {
      // set error and end loading
      setError(response?.message ?? "Unknown error");
      setLoading(false);
    }
  };

  /**
   * Start harmonized audio playback
   */
  const handlePlay = useCallback((): void => {
    audioSource.connect(ctx.destination);

    // Fetch current time and reset to start if previous playback finished
    let newPlayTime = playTime;
    if (playTime >= melodyBuffer.duration - PLAYBACK_INTERVAL * 2) {
      newPlayTime = 0;
      setPlayTime(newPlayTime);
    }

    audioSource.start(0, newPlayTime);
    setPlaying(true);

    // Start timer to update playTime every PLAYBACK_INTERVAL
    const playStartTime = ctx.currentTime;
    const playTimer = setInterval(
      (): void => setPlayTime(ctx.currentTime - playStartTime + newPlayTime),
      PLAYBACK_INTERVAL * 1000
    );

    // Clear timer and reset audioSource on stop
    audioSource.onended = (): void => {
      clearInterval(playTimer);
      resetAudioSource();
      setPlaying(false);
    };
  }, [audioSource, melodyBuffer, playTime, resetAudioSource]);

  /**
   * Stop harmonized audio playback
   */
  const handleStop = useCallback((): void => {
    audioSource.stop();
    setPlaying(false);
  }, [audioSource]);

  /**
   * Update playTime from slider input
   * @param newPlayTime slider input value
   */
  const handleSlider = useCallback(
    (newPlayTime: SliderValue): void => {
      if (typeof newPlayTime !== "number") {
        return;
      }
      if (playing) {
        handleStop();
      }
      setPlayTime(newPlayTime);
    },
    [playing, handleStop]
  );

  /**
   * Convert time to standard mm:ss format
   * @param seconds time in seconds
   */
  const formatTime = (seconds: number): string => {
    let secondsLeft = seconds;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft -= minutes * 60;
    const secondsInt = Math.floor(secondsLeft);

    return `${minutes}:${seconds > 10 ? "" : "0"}${secondsInt}`;
  };

  return (
    <>
      <Head />
      <div className="center-vertical">
        <h1 className="title">Harmonizer </h1>

        <div className="upload-container">
          <h2>Add melody file here:</h2>
          <Upload
            className="upload"
            action={`${
              process.env.REACT_APP_BACKEND_URL ??
              `http://${process.env.REACT_APP_VM_IP ?? "localhost"}:5000`
            }/harmony`}
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            accept=".wav,.mp3,.mp4"
            showUploadList={false}
          >
            <Button type={melodyFile === null ? "primary" : "default"}>
              Upload
            </Button>
          </Upload>
        </div>

        {melodyFile !== null && <h2>{melodyFile.name}</h2>}

        {loading && (
          <>
            <Spin className="loader" />
            {percent >= 0 && (
              <Progress
                percent={percent}
                status={percent < 100 ? "active" : "success"}
                showInfo={false}
              />
            )}
          </>
        )}

        {result !== null && (
          <>
            <h3>Key: {result.key}</h3>
            <h3>Chords: {result.chords.join(", ")}</h3>
            <h3>Meter: {Math.round(result.meter)}</h3>
            <h3>BPM: {Math.round(result.bpm)}</h3>
            <div className="player">
              <h3 className="time">
                {formatTime(playTime)} / {formatTime(melodyBuffer.duration)}
              </h3>
              <Button
                type="primary"
                onClick={playing ? handleStop : handlePlay}
              >
                {playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
              </Button>

              <Slider
                value={playTime}
                min={0}
                max={melodyBuffer.duration}
                step={PLAYBACK_INTERVAL}
                onChange={handleSlider}
                tooltipVisible={false}
              />
            </div>
          </>
        )}

        {error !== "" && (
          <Alert
            type="error"
            message={`The following error has been encountered: ${error}`}
          />
        )}
      </div>
    </>
  );
}
