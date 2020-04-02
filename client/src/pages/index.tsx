import React, { ReactElement, useState } from "react";
import { Head } from "../components";
import { Button, Upload, Spin, Alert } from "antd";
import { getHarmony } from "../utils/api";
import { UploadChangeParam } from "antd/lib/upload";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "../styles/style.scss";

export default function Home(): ReactElement {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);
  const [chords, setChords] = useState<string[] | null>(null);

  const handleFile = (e: UploadChangeParam): void =>
    setFile(e.file.originFileObj ?? null);

  const handleSubmit = async (): Promise<void> => {
    if (file !== null) {
      setLoading(true);
      setBpm(null);
      setChords(null);
      const harmony = await getHarmony(file);
      if (harmony.result) {
        setBpm(harmony.result.bpm);
        setChords(harmony.result.chords);
      } else {
        setError(true);
      }
      setLoading(false);
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
            onChange={handleFile}
            accept=".wav,.mp3"
            listType="picture-card"
          >
            {file === null && <Button type="primary">Upload</Button>}
          </Upload>
          <Button
            type={file === null ? "default" : "primary"}
            disabled={file === null}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>

        {loading && <Spin className="loader" />}

        {bpm && <h3>BPM: {bpm}</h3>}
        {chords && <h3>Chords: {chords.join(", ")}</h3>}

        {error && (
          <Alert type="error" message="An error has been encountered" />
        )}
      </div>
    </>
  );
}
