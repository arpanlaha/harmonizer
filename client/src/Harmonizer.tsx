import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  AudioContext,
  Chords,
  ChordName,
  getHarmony,
  HarmonyParams,
  HarmonyResult,
  Keys,
} from "./utils";
import { Head } from "./components";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Slider,
  Spin,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import { FMSynth, Transport, Offline } from "tone";

import { SliderValue } from "antd/lib/slider";
import { TagProps } from "antd/lib/tag";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "./styles/style.scss";

const PLAYBACK_INTERVAL = 0.02;
const Synth = FMSynth;
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
  const [result, setResult] = useState<HarmonyResult | null>(null);
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
  }, [melodyFile, setMelodyBuffer]);

  /**
   * Synthesize harmony and sets buffer on harmony parameter change
   */
  useEffect((): void => {
    if (result !== null) {
      const { bpm, chords, meter, start } = result;
      Transport.bpm.value = bpm;
      const measureLength = (60 * meter) / bpm;

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
    if (harmonyBuffer.length > 1) {
      const newOverlayBuffer = ctx.createBuffer(
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
        const newOverlayBufferChannel = newOverlayBuffer.getChannelData(
          channel
        );
        const melodyBufferChannel = melodyBuffer.getChannelData(channel);
        for (let i = 0; i < melodyBuffer.length; i++) {
          newOverlayBufferChannel[i] =
            melodyBufferChannel[i] + harmonyBufferChannel[i];
        }
      }
      setOverlayBuffer(newOverlayBuffer);
    }
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
   * Reset audioSource on change to overlayBuffer
   */
  useEffect(resetAudioSource, [overlayBuffer, resetAudioSource]);

  /**
   * Reset harmony results on new file submission or harmonization
   */
  const resetResult = (): void => {
    setError("");
    setResult(null);
    setPlayTime(0);
  };

  /**
   * Sets melody file on drop
   * @param files list of added files (singleton)
   */
  const handleFile = (files: File[]): void => {
    if (files.length > 0) {
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
   * Sends melody file to harmony enndpoint
   */
  const handleSubmit = (): void => {
    if (melodyFile !== null) {
      resetResult();
      setLoading(true);
      getHarmony(melodyFile, params)
        .then((response) => {
          response.result
            ? setResult(response.result)
            : setError(response.error ?? "");
          setLoading(false);
        })
        .catch(setError)
        .then(() => setLoading(false));
    }
  };

  /**
   * Resets user parameter overloads
   */
  const handleReset = (): void => {
    form.resetFields();
    setParams({});
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
      ? Math.min(
          Math.floor((playTime * result.chords.length) / melodyBuffer.duration),
          result.chords.length
        )
      : -1;

  /**
   * Start harmonized audio playback
   */
  const handlePlay = (): void => {
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
  };

  /**
   * Stop harmonized audio playback
   */
  const handleStop = (): void => {
    audioSource.stop();
    setPlaying(false);
  };

  /**
   * Update playTime from slider input
   * @param newPlayTime slider input value
   */
  const handleSlider = (newPlayTime: SliderValue): void => {
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
                onValuesChange={setParams}
                form={form}
              >
                <h2 className="params-title">Parameters (optional)</h2>

                <div className="params">
                  <Tooltip title={keyDescription} placement="top">
                    <Item className="key-input" label="Key" name="key">
                      <Select placeholder="Key" showSearch value={params.key}>
                        {Object.keys(Keys).map((keyName) => (
                          <Option key={keyName} value={keyName}>
                            {keyName}
                          </Option>
                        ))}
                      </Select>
                    </Item>
                  </Tooltip>
                  <Tooltip title={bpmDescription} placement="top">
                    <Item className="number-input" label="BPM" name="bpm">
                      <InputNumber placeholder="BPM" value={params.bpm} />
                    </Item>
                  </Tooltip>
                  <Tooltip title={meterDescription} placement="top">
                    <Item className="number-input" label="Meter" name="meter">
                      <InputNumber placeholder="Meter" value={params.meter} />
                    </Item>
                  </Tooltip>
                </div>
                <p className="params-instructions">
                  Harmonizer's backend will automatically detect the above
                  fields upon submission. However, if you wish to manually set
                  or override the backend's results, you can do so with the
                  parameters above.
                </p>
                <div className="upload-buttons">
                  <Item>
                    <Button
                      type="danger"
                      // htmlType="reset"
                      onClick={handleReset}
                      disabled={
                        params.key === undefined &&
                        params.chords === undefined &&
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
              <h2 className="file-name">Melody: {melodyFile.name}</h2>
            )}

            {loading && <Spin className="loader" />}

            {result !== null && (
              <>
                <div className="result-field">
                  <Tooltip title={keyDescription} placement="left">
                    <h3>Key:</h3>
                  </Tooltip>
                  <Tag color="blue">{result.key}</Tag>
                </div>
                <div className="result-field">
                  <Tooltip title={chordsDescription} placement="left">
                    <h3>Chords:</h3>
                  </Tooltip>
                  <div className="flex-row">
                    {result.chords.map(
                      (chord, chordIndex): ReactElement<TagProps> => (
                        <Tag
                          className={
                            chordIndex === getCurrentChordIndex()
                              ? "current-chord-tag"
                              : ""
                          }
                          color={getBadgeColor(chord)}
                          key={chord}
                        >
                          {chord}
                        </Tag>
                      )
                    )}
                  </div>
                </div>

                <div className="result-field">
                  <Tooltip title={bpmDescription} placement="left">
                    <h3>BPM:</h3>
                  </Tooltip>
                  <Tag color="blue">{Math.round(result.bpm)}</Tag>
                </div>
                <div className="result-field">
                  <Tooltip title={meterDescription} placement="left">
                    <h3>Meter:</h3>
                  </Tooltip>
                  <Tag color="blue">{Math.round(result.meter)}</Tag>
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
                    onChange={handleSlider}
                    tooltipVisible={false}
                  />
                </div>
              </>
            )}
          </Card>
        </div>

        {error !== "" && <Alert type="error" message={`Error: ${error}`} />}
      </div>
    </>
  );
}
