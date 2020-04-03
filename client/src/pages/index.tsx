import React, { ReactElement, useState, useEffect, useCallback } from "react";
import { Head } from "../components";
import { Alert, Button, Progress, Spin, Upload, Slider } from "antd";
import { UploadChangeParam, RcFile } from "antd/lib/upload";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "../styles/style.scss";

const PLAYBACK_INTERVAL = 0.05;

export default function Home(): ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);
  const [chords, setChords] = useState<string[] | null>(null);
  const [audioContext] = useState(new AudioContext());
  const [audioSource, setAudioSource] = useState(
    audioContext.createBufferSource()
  );
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const resetAudioSource = useCallback((): void => {
    if (audioBuffer !== null) {
      const newAudioSource = audioContext.createBufferSource();
      newAudioSource.buffer = audioBuffer;
      setAudioSource(newAudioSource);
    }
  }, [audioBuffer, audioContext, setAudioSource]);

  useEffect((): void => {
    resetAudioSource();
  }, [audioBuffer, resetAudioSource]);

  useEffect((): void => {
    if (file !== null) {
      file
        .arrayBuffer()
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then(setAudioBuffer)
        .catch(() => setError(`Error loading ${file.name} in browser`));
    }
  }, [file, setAudioBuffer, audioContext]);

  const handleUpload = (e: UploadChangeParam): void => {
    const { response, status } = e.file;

    if (status === "uploading") {
      setPercent(e.event?.percent ?? null);
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

  const beforeUpload = (file: RcFile): boolean => {
    setLoading(true);
    setError(null);
    setPercent(null);
    setBpm(null);
    setChords(null);
    setFile(file);
    return true;
  };

  const handlePlay = (): void => {
    audioSource.connect(audioContext.destination);
    audioSource.start();

    const startTime = audioContext.currentTime;

    if (audioBuffer !== null && time >= audioBuffer.duration) {
      setTime(0);
    }

    const timer = setInterval(
      (): void => setTime(audioContext.currentTime - startTime),
      PLAYBACK_INTERVAL * 1000
    );

    audioSource.onended = () => {
      clearInterval(timer);

      const newAudioSource = audioContext.createBufferSource();
      newAudioSource.buffer = audioBuffer;
      setAudioSource(newAudioSource);
    };
    setPlaying(true);
  };

  const handleStop = (): void => {
    audioSource.stop();
    setPlaying(false);
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
              process.env.GATSBY_BACKEND_URL ??
              `http://${process.env.VM_IP ?? "localhost"}:5000`
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
            {percent && (
              <Progress
                percent={percent}
                status={percent < 100 ? "active" : "success"}
                showInfo={false}
              />
            )}
          </>
        )}

        {bpm && <h3>BPM: {bpm}</h3>}
        {chords && <h3>Chords: {chords.join(", ")}</h3>}

        {error && (
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
