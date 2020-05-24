import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  AudioContext,
  Chords,
  ChordName,
  getHarmony,
  HarmonyParams,
  HarmonyResult,
  Keys,
  synthesizeHarmony,
} from "../utils";
import { Head } from "../components";
import {
  Button,
  Card,
  Form,
  InputNumber,
  notification,
  Progress,
  Slider,
  Spin,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import toWav from "audiobuffer-to-wav";

import { SliderValue } from "antd/lib/slider";

const PLAYBACK_INTERVAL = 0.02;
const { ctx } = AudioContext;
const { Item } = Form;
const { Option } = Select;

const keyDescription =
  "The key determines which chords are available for a given melody.";
const chordsDescription = "The chords make up the harmony.";
const bpmDescription = "The BPM (Beats Per Minute) sets the tempo.";
const meterDescription =
  "The meter corresponds to how many beats make up a measure.";

export default function Harmonizer(): ReactElement {
  const [melodyFile, setMelodyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<HarmonyParams>({});
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<HarmonyResult | null>(null);
  const [melodySource, setMelodySource] = useState(ctx.createBufferSource());
  const [harmonySource, setHarmonySource] = useState(ctx.createBufferSource());
  const [gainNode] = useState(ctx.createGain());
  const [melodyBuffer, setMelodyBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );
  const [harmonyBuffer, setHarmonyBuffer] = useState(
    ctx.createBuffer(1, 1, ctx.sampleRate)
  );
  const [playing, setPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [harmonyVolume, setHarmonyVolume] = useState(50);

  const [form] = Form.useForm();

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
  }, [melodyFile]);

  useEffect(
    (): void =>
      error !== ""
        ? notification.error({
            message: "Error",
            description: error,
            key: "error",
            duration: 0,
          })
        : notification.close("error"),
    [error]
  );

  /**
   * Synthesize harmony and sets buffer on harmony parameter change
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
  }, [result, melodyBuffer]);

  /**
   * Reinitialize melodySource with melodyBuffer
   */
  const resetMelodySource = useCallback((): void => {
    const newMelodySource = ctx.createBufferSource();
    newMelodySource.buffer = melodyBuffer;
    setMelodySource(newMelodySource);
  }, [melodyBuffer]);

  /**
   * Reinitialize harmonySource with harmonyBuffer
   */
  const resetHarmonySource = useCallback((): void => {
    const newHarmonySource = ctx.createBufferSource();
    newHarmonySource.buffer = harmonyBuffer;
    setHarmonySource(newHarmonySource);
  }, [harmonyBuffer]);

  /**
   * Reset melodySource on change to melodyBuffer
   */
  useEffect(resetMelodySource, [melodyBuffer]);

  /**
   * Reset harmonySource on change to harmonyBuffer
   */
  useEffect(resetHarmonySource, [harmonyBuffer]);

  /**
   * Connect gain node to output on initialization
   */
  useEffect((): void => {
    gainNode.connect(ctx.destination);
  }, [gainNode]);

  /**
   * Update gain on harmony volume change
   */
  useEffect((): void => {
    gainNode.gain.value = harmonyVolume / 50;
  }, [harmonyVolume, gainNode]);

  /**
   * Resets user parameter overloads
   */
  const resetParams = (): void => {
    form.resetFields();
    setParams({});
  };

  /**
   * Reset harmony results on new file submission or harmonization
   */
  const resetResult = (): void => {
    setError("");
    setResult(null);
    setPlayTime(0);
    setHarmonyVolume(50);
  };

  /**
   * Sets melody file on drop
   * @param files list of added files (singleton)
   */
  const handleFile = (files: File[]): void => {
    if (files.length > 0) {
      resetParams();
      resetResult();
      setMelodyFile(files[0]);
    }
  };

  /**
   * Sets error state on invalid file type drop
   */
  const handleInvalidFile = (): void =>
    setError(
      "Invalid file type - use one of .aiff, .flac, .mp3, .mp4, .ogg, .wav"
    );

  /**
   * Replaces 'b' with '♭' and '#' with '♯' for keys, chords, or notes with accidentals
   * @param str the key, chord, or note to be converted
   */
  const replaceAccidentals = (str: string): string =>
    str.replace(/b/g, "♭").replace(/#/g, "♯");

  /**
   * Sends melody file to harmony enndpoint
   */
  const handleSubmit = (): void => {
    if (melodyFile !== null) {
      resetResult();
      setLoading(true);
      setProgress(0);
      getHarmony(melodyFile, params, setProgress)
        .then((response) => {
          response.result
            ? setResult(response.result)
            : setError(response.error ?? "");
        })
        .catch(setError)
        .then(() => setLoading(false));
    }
  };

  /**
   * Sets error state if user input measure length exceeds melody duration
   */
  const handleSubmitFail = (): void => {
    setError(
      "Measure length exceeds melody duration - increase BPM and/or decrease meter"
    );
  };

  /**
   * Validates that meter and bpm don't lead to a measure length above the melody duration if both are set
   */
  const validateMeasureLength = {
    validator: (): Promise<void> => {
      const bpm = form.getFieldValue("bpm");
      const meter = form.getFieldValue("meter");
      return bpm === undefined ||
        meter === undefined ||
        melodyBuffer === undefined ||
        (60 * meter) / bpm < melodyBuffer.duration
        ? Promise.resolve()
        : Promise.reject("");
    },
  };

  /**
   * Assigns a chord a badge color depending on its scale degree in the current key
   * @param chord the chord to assign a color to
   */
  const getBadgeColor = (chord: ChordName): string =>
    result !== null
      ? ["magenta", "red", "volcano", "orange", "gold", "lime"][
          Keys[result.key].chords.indexOf(chord)
        ]
      : "blue";

  /**
   * Determines the current chord index being played based off of the current playTime
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
   * Start harmonized audio playback
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
   * Stop harmonized audio playback
   */
  const handleStop = (): void => {
    melodySource.stop();
    harmonySource.stop();
    setPlaying(false);
  };

  /**
   * Update playTime from slider input
   * @param newPlayTime slider input value
   */
  const handlePlayTime = (newPlayTime: SliderValue): void => {
    if (typeof newPlayTime !== "number") {
      return;
    }
    if (playing) {
      handleStop();
    }
    setPlayTime(newPlayTime);
  };

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

  /**
   * Sets harmony volume on slider input
   */
  const handleHarmonyVolume = (newHarmonyVolume: SliderValue): void => {
    if (typeof newHarmonyVolume !== "number") {
      return;
    }
    setHarmonyVolume(newHarmonyVolume);
  };

  /**
   * Downloads harmonized buffer as wav file
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
      <Head />
      <div className="center-vertical">
        <h1 className="title">Harmonizer</h1>

        <div className="content">
          <Card className="upload-container" title="Upload">
            <div className="dropzone-container">
              <Dropzone
                onDropAccepted={handleFile}
                onDropRejected={handleInvalidFile}
                accept=".aiff,.flac,.mp3,.mp4,.ogg,.wav"
                multiple={false}
                noKeyboard
              >
                {({ getRootProps, getInputProps }) => (
                  <Button
                    type={melodyFile === null ? "primary" : "default"}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {melodyFile === null
                      ? "Select file"
                      : "Select another file"}
                  </Button>
                )}
              </Dropzone>
            </div>

            {melodyFile !== null && (
              <Form
                onFinish={handleSubmit}
                onFinishFailed={handleSubmitFail}
                onValuesChange={setParams}
                form={form}
              >
                <h2 className="center-text">Parameters (optional)</h2>

                <div className="params">
                  <Tooltip title={keyDescription} placement="top">
                    <Item className="key-input" label="Key" name="key">
                      <Select showSearch value={params.key}>
                        {Object.keys(Keys).map((keyName) => (
                          <Option key={keyName} value={keyName}>
                            {replaceAccidentals(keyName)}
                          </Option>
                        ))}
                      </Select>
                    </Item>
                  </Tooltip>
                  <Tooltip title={bpmDescription} placement="top">
                    <Item
                      className="bpm-input"
                      label="BPM"
                      name="bpm"
                      rules={[validateMeasureLength]}
                    >
                      <InputNumber value={params.bpm} min={40} max={250} />
                    </Item>
                  </Tooltip>
                  <Tooltip title={meterDescription} placement="top">
                    <Item
                      className="meter-input"
                      label="Meter"
                      name="meter"
                      rules={[validateMeasureLength]}
                    >
                      <InputNumber value={params.meter} min={1} />
                    </Item>
                  </Tooltip>
                </div>
                <p className="center-text">
                  Harmonizer's backend will automatically detect the above
                  fields upon submission. However, if you wish to manually set
                  or override the backend's results, you can do so with the
                  parameters above.
                </p>
                <div className="upload-buttons">
                  <Item>
                    <Button
                      type="danger"
                      onClick={resetParams}
                      disabled={
                        params.key === undefined &&
                        params.bpm === undefined &&
                        params.meter === undefined
                      }
                    >
                      Clear parameters
                    </Button>
                  </Item>
                  <Item>
                    <Button type="primary" htmlType="submit">
                      Harmonize
                    </Button>
                  </Item>
                </div>
              </Form>
            )}
          </Card>

          <Card className="result-container" title="Results">
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
                    onChange={handleHarmonyVolume}
                  />
                </div>
                <Button
                  className="download"
                  type="primary"
                  onClick={handleDownload}
                >
                  Download (WAV)
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
