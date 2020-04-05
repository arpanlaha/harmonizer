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
const { ctx } = Audio;
const timeSignature = 4;

interface HarmonizeResult {
  bpm: number;
  chords: ChordName[];
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
  const [time, setTime] = useState(0);

  useEffect((): void => {
    if (melodyFile !== null) {
      melodyFile
        .arrayBuffer()
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then(setMelodyBuffer)
        .catch(() => setError(`Error loading ${melodyFile.name} in browser`));
    }
  }, [melodyFile, setMelodyBuffer]);

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

  useEffect((): void => {
    const newOverlayBuffer = ctx.createBuffer(
      melodyBuffer.numberOfChannels,
      melodyBuffer.length,
      ctx.sampleRate
    );
    const harmonyBufferChannel = harmonyBuffer.getChannelData(0);
    for (let channel = 0; channel < melodyBuffer.numberOfChannels; channel++) {
      const newOverlayBufferChannel = newOverlayBuffer.getChannelData(channel);
      const melodyBufferChannel = melodyBuffer.getChannelData(channel);
      for (let i = 0; i < melodyBuffer.length; i++) {
        newOverlayBufferChannel[i] =
          melodyBufferChannel[i] + harmonyBufferChannel[i];
      }
    }
    setOverlayBuffer(newOverlayBuffer);
  }, [melodyBuffer, harmonyBuffer]);

  const resetAudioSource = useCallback((): void => {
    const newAudioSource = ctx.createBufferSource();
    newAudioSource.buffer = overlayBuffer;
    setAudioSource(newAudioSource);
  }, [overlayBuffer, setAudioSource]);

  useEffect((): void => resetAudioSource(), [overlayBuffer, resetAudioSource]);

  const beforeUpload = (file: File): boolean => {
    setLoading(true);
    setError("");
    setPercent(-1);
    setResult(null);
    setMelodyFile(file);
    return true;
  };

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

  const handlePlay = useCallback((): void => {
    audioSource.connect(ctx.destination);
    let newTime = time;
    if (time >= melodyBuffer.duration - PLAYBACK_INTERVAL * 2) {
      newTime = 0;
      setTime(newTime);
    }

    audioSource.start(0, newTime);
    setPlaying(true);

    const startTime = ctx.currentTime;
    const timer = setInterval(
      (): void => setTime(ctx.currentTime - startTime + newTime),
      PLAYBACK_INTERVAL * 1000
    );

    audioSource.onended = (): void => {
      clearInterval(timer);
      resetAudioSource();
      setPlaying(false);
    };
  }, [audioSource, melodyBuffer, time, resetAudioSource]);

  const handleStop = useCallback((): void => {
    audioSource.stop();
    setPlaying(false);
  }, [audioSource]);

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
