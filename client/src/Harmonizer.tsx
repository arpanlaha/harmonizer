import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Audio, ChordName, Model } from "./utils";
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

const { audioContext } = Audio;

const timeSignature = 4;

interface HarmonizeResult {
  bpm: number;
  chords: ChordName[];
}

export default function Harmonizer(): ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(-1);
  const [error, setError] = useState("");
  const [result, setResult] = useState<HarmonizeResult | null>(null);
  const [melodySource, setMelodySource] = useState(
    audioContext.createBufferSource()
  );
  const [harmonySource, setHarmonySource] = useState(
    audioContext.createBufferSource()
  );
  const [melodyBuffer, setMelodyBuffer] = useState(
    audioContext.createBuffer(1, 1, 44100)
  );
  const [harmonyBuffer, setHarmonyBuffer] = useState(
    audioContext.createBuffer(1, 1, 44100)
  );
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const resetMelodySource = useCallback((): void => {
    const newMelodySource = audioContext.createBufferSource();
    newMelodySource.buffer = melodyBuffer;
    setMelodySource(newMelodySource);
  }, [melodyBuffer, setMelodySource]);

  const resetHarmonySource = useCallback((): void => {
    const newHarmonySource = audioContext.createBufferSource();
    newHarmonySource.buffer = harmonyBuffer;
    setHarmonySource(newHarmonySource);
  }, [harmonyBuffer, setHarmonySource]);

  useEffect((): void => {
    resetMelodySource();
  }, [melodyBuffer, resetMelodySource]);

  useEffect((): void => {
    resetHarmonySource();
  }, [harmonyBuffer, resetHarmonySource]);

  useEffect((): void => {
    if (file !== null) {
      file
        .arrayBuffer()
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then(setMelodyBuffer)
        .catch(() => setError(`Error loading ${file.name} in browser`));
    }
  }, [file, setMelodyBuffer]);

  useEffect((): void => {
    if (result !== null) {
      const { bpm, chords } = result;
      Transport.bpm.value = bpm;
      const measureLength = (60 * timeSignature) / bpm;
      Offline((): void => {
        const synths = [
          new Synth().toDestination(),
          new Synth().toDestination(),
          new Synth().toDestination(),
        ];

        chords.forEach((chord, chordIndex): void =>
          synths.forEach(
            (synth, synthIndex): FMSynth =>
              synth.triggerAttackRelease(
                `${Model.chords[chord].notes[synthIndex]}3`,
                measureLength,
                measureLength * chordIndex
              )
          )
        );
      }, melodyBuffer.duration).then((buffer): void => {
        const newBuffer = buffer.get();
        if (newBuffer !== undefined) {
          setHarmonyBuffer(newBuffer);
        }
      });
    }
  }, [result, melodyBuffer]);

  const handleUpload = (e: UploadChangeParam): void => {
    const { response, status } = e.file;

    if (status === "uploading" && e.event !== undefined) {
      setPercent(e.event.percent);
    } else if (status === "done") {
      setResult(response.result);
      setLoading(false);
    } else if (status === "error") {
      setError(response?.message ?? "Unknown error");
      setLoading(false);
    }
  };

  const beforeUpload = (upload: File): boolean => {
    setLoading(true);
    setError("");
    setPercent(-1);
    setResult(null);
    setFile(upload);
    return true;
  };

  const handlePlay = useCallback((): void => {
    melodySource.connect(audioContext.destination);
    harmonySource.connect(audioContext.destination);
    let newTime = time;
    if (time >= melodyBuffer.duration - PLAYBACK_INTERVAL * 2) {
      newTime = 0;
      setTime(newTime);
    }

    melodySource.start(0, newTime);
    harmonySource.start(0, newTime);
    setPlaying(true);

    const startTime = audioContext.currentTime;
    const timer = setInterval(
      (): void => setTime(audioContext.currentTime - startTime + newTime),
      PLAYBACK_INTERVAL * 1000
    );

    melodySource.onended = (): void => {
      clearInterval(timer);
      resetMelodySource();
      setPlaying(false);
    };

    harmonySource.onended = (): void => {
      resetHarmonySource();
    };
  }, [
    melodySource,
    harmonySource,
    melodyBuffer,
    resetMelodySource,
    resetHarmonySource,
    time,
  ]);

  const handleStop = useCallback((): void => {
    melodySource.stop();
    harmonySource.stop();
    setPlaying(false);
  }, [melodySource, harmonySource]);

  const handleSlider = useCallback(
    (value: SliderValue): void => {
      if (typeof value !== "number") {
        return;
      }
      if (playing) {
        handleStop();
      }
      setTime(value);
    },
    [playing, handleStop]
  );

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
            onChange={handleUpload}
            beforeUpload={beforeUpload}
            accept=".wav,.mp3,.mp4"
            showUploadList={false}
          >
            <Button type={file === null ? "primary" : "default"}>Upload</Button>
          </Upload>
        </div>

        {file !== null && <h2>{file.name}</h2>}

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
            <h3>BPM: {Math.round(result.bpm)}</h3>{" "}
            <h3>Chords: {result.chords.join(", ")}</h3>{" "}
            <div className="player">
              <h3 className="time">
                {formatTime(time)} / {formatTime(melodyBuffer.duration)}
              </h3>
              <Button
                type="primary"
                onClick={playing ? handleStop : handlePlay}
              >
                {playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
              </Button>

              <Slider
                value={time}
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
