import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  AudioContext,
  Chords,
  getHarmony,
  HarmonyParams,
  HarmonyResult,
  Keys,
} from "./utils";
import { Head } from "./components";
import { Alert, Button, Form, InputNumber, Slider, Spin, Select } from "antd";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import { SliderValue } from "antd/lib/slider";
import { FMSynth, Transport, Offline } from "tone";

import "antd/dist/antd.css";
import "antd/dist/antd.dark.css";
import "./styles/style.scss";

const PLAYBACK_INTERVAL = 0.02;
const Synth = FMSynth;
const { ctx } = AudioContext;
const { Item } = Form;
const { Option } = Select;

export default function Harmonizer(): ReactElement {
  const [melodyFile, setMelodyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  // const [percent, setPercent] = useState(-1);
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
  useEffect((): void => resetAudioSource(), [overlayBuffer, resetAudioSource]);

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
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
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
        <h1 className="title">Harmonizer </h1>

        <div className="content">
          <div className="upload-container">
            <div className="dropzone-container">
              <h2>Add melody file here:</h2>
              <Dropzone
                onDropAccepted={handleFile}
                onDropRejected={handleInvalidFile}
                accept=".aiff,.flac,.mp3,.mp4,.ogg,.wav"
                multiple={false}
                noKeyboard
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <Button
                      type={melodyFile === null ? "primary" : "default"}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      Select file
                    </Button>
                  </section>
                )}
              </Dropzone>
            </div>

            <Form
              onFinish={handleSubmit}
              onValuesChange={setParams}
              form={form}
            >
              <Item label="Key" name="key">
                <Select
                  placeholder="Key"
                  showSearch
                  disabled={melodyFile === null}
                  value={params.key}
                >
                  {Object.keys(Keys).map((keyName) => (
                    <Option key={keyName} value={keyName}>
                      {keyName}
                    </Option>
                  ))}
                </Select>
              </Item>
              <Item label="BPM" name="bpm">
                <InputNumber
                  placeholder="BPM"
                  disabled={melodyFile === null}
                  value={params.bpm}
                />
              </Item>
              <Item label="Meter" name="meter">
                <InputNumber
                  placeholder="Meter"
                  disabled={melodyFile === null}
                  value={params.meter}
                />
              </Item>
              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={melodyFile === null}
                >
                  Harmonize
                </Button>
              </Item>
              <Item>
                <Button
                  type="danger"
                  // htmlType="reset"
                  onClick={handleReset}
                  disabled={
                    melodyFile === null ||
                    (params.key === undefined &&
                      params.chords === undefined &&
                      params.bpm === undefined &&
                      params.meter === undefined)
                  }
                >
                  Clear inputs
                </Button>
              </Item>
            </Form>
          </div>

          <div className="result-container">
            {melodyFile !== null && <h2>{melodyFile.name}</h2>}
            {loading && <Spin className="loader" />}

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
          </div>
        </div>

        {error !== "" && <Alert type="error" message={`Error: ${error}`} />}
      </div>
    </>
  );
}
