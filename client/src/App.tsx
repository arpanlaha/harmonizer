import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Head } from "./components";
import { Alert, Button, Progress, Slider, Spin, Upload } from "antd";
import Audio from "./utils/audio";
import { UploadChangeParam } from "antd/lib/upload";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "./styles/style.scss";

const PLAYBACK_INTERVAL = 0.05;

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
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const resetAudioSource = useCallback((): void => {
    if (Audio.context !== null && audioBuffer !== null) {
      const newAudioSource = Audio.context.createBufferSource();
      newAudioSource.buffer = audioBuffer;
      setAudioSource(newAudioSource);
    }
  }, [audioBuffer, setAudioSource]);

  useEffect((): void => {
    resetAudioSource();
  }, [audioBuffer, resetAudioSource]);

  useEffect((): void => {
    if (Audio.context !== null && file !== null) {
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
    setError("null");
    setPercent(-1);
    setBpm(0);
    setChords([]);
    setFile(file);
    return true;
  };

  const handlePlay = (): void => {
    if (Audio.context !== null && audioSource !== null) {
      audioSource.connect(Audio.context.destination);
      audioSource.start();
      setPlaying(true);

      if (audioBuffer !== null && time >= audioBuffer.duration) {
        setTime(0);
      }
      const startTime = Audio.context.currentTime;
      const timer = setInterval(
        (): void => setTime(Audio.context.currentTime - startTime),
        PLAYBACK_INTERVAL * 1000
      );

      audioSource.onended = () => {
        clearInterval(timer);
        const newAudioSource = Audio.context.createBufferSource();
        newAudioSource.buffer = audioBuffer;
        setAudioSource(newAudioSource);
        setPlaying(false);
      };
    }
  };

  const handleStop = (): void => {
    if (audioSource !== null) {
      audioSource.stop();
      setPlaying(false);
    }
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
            <Button type="primary">Upload</Button>
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
          <>
            {playing ? (
              <Button onClick={handleStop}>Stop</Button>
            ) : (
              <Button onClick={handlePlay}>Play</Button>
            )}

            <Slider
              value={time}
              min={0}
              max={audioBuffer?.duration}
              step={PLAYBACK_INTERVAL}
            />
          </>
        )}
      </div>
    </>
  );
}
