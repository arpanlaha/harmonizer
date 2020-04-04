import React, { ReactElement, useCallback, useEffect, useState } from "react";
import Audio from "./utils/audio";
import { Head } from "./components";
import { Alert, Button, Progress, Slider, Spin, Upload } from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import { SliderValue } from "antd/lib/slider";
import { UploadChangeParam } from "antd/lib/upload";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "./styles/style.scss";

const PLAYBACK_INTERVAL = 0.02;

export default function App(): ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(-1);
  const [error, setError] = useState("");
  const [bpm, setBpm] = useState(0);
  const [chords, setChords] = useState([]);
  const [audioSource, setAudioSource] = useState(
    Audio.context.createBufferSource()
  );
  const [audioBuffer, setAudioBuffer] = useState(
    Audio.context.createBuffer(1, 1, 44100)
  );
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const resetAudioSource = useCallback((): void => {
    const newAudioSource = Audio.context.createBufferSource();
    newAudioSource.buffer = audioBuffer;
    setAudioSource(newAudioSource);
  }, [audioBuffer, setAudioSource]);

  useEffect((): void => {
    resetAudioSource();
  }, [audioBuffer, resetAudioSource]);

  useEffect((): void => {
    if (file !== null) {
      file
        .arrayBuffer()
        .then((arrayBuffer) => Audio.context.decodeAudioData(arrayBuffer))
        .then(setAudioBuffer)
        .catch(() => setError(`Error loading ${file.name} in browser`));
    }
  }, [file, setAudioBuffer]);

  const handleUpload = (e: UploadChangeParam): void => {
    const { response, status } = e.file;

    if (status === "uploading" && e.event !== undefined) {
      setPercent(e.event.percent);
    } else if (status === "done") {
      const { result } = response;
      setBpm(result.bpm);
      setChords(result.chords);
      setLoading(false);
    } else if (status === "error") {
      setError(response?.message ?? "Unknown error");
      setLoading(false);
    }
  };

  const beforeUpload = (file: File): boolean => {
    setLoading(true);
    setError("");
    setPercent(-1);
    setBpm(0);
    setChords([]);
    setFile(file);
    return true;
  };

  const handlePlay = useCallback((): void => {
    audioSource.connect(Audio.context.destination);

    let newTime = time;
    if (time >= audioBuffer.duration - PLAYBACK_INTERVAL * 2) {
      newTime = 0;
      setTime(newTime);
    }

    audioSource.start(0, newTime);
    setPlaying(true);

    const startTime = Audio.context.currentTime;
    const timer = setInterval(
      (): void => setTime(Audio.context.currentTime - startTime + newTime),
      PLAYBACK_INTERVAL * 1000
    );

    audioSource.onended = () => {
      clearInterval(timer);
      resetAudioSource();
      setPlaying(false);
    };
  }, [audioSource, audioBuffer, resetAudioSource, time]);

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
        audioSource.stop();
        resetAudioSource();
        setPlaying(false);
      }
      setTime(value);
    },
    [audioSource, playing, resetAudioSource]
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
            }/api/harmony`}
            onChange={handleUpload}
            beforeUpload={beforeUpload}
            accept=".wav,.mp3,.mp4"
            showUploadList={false}
          >
            <Button type={file === null ? "primary" : "default"}>Upload</Button>
          </Upload>
        </div>

        {file && <h2>{file.name}</h2>}

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

        {bpm > 0 && <h3>BPM: {bpm}</h3>}
        {chords.length > 0 && <h3>Chords: {chords.join(", ")}</h3>}

        {error !== "" && (
          <Alert
            type="error"
            message={`The following error has been encountered: ${error}`}
          />
        )}

        {file && (
          <div className="player">
            <span className="time">
              {formatTime(time)} / {formatTime(audioBuffer.duration)}
            </span>
            <Button type="primary" onClick={playing ? handleStop : handlePlay}>
              {playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
            </Button>

            <Slider
              value={time}
              min={0}
              max={audioBuffer.duration}
              step={PLAYBACK_INTERVAL}
              onChange={handleSlider}
              tooltipVisible={false}
            />
          </div>
        )}
      </div>
    </>
  );
}
