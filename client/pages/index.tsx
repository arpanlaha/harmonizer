import React, { ReactElement, useEffect, useState } from "react";
import {
  bpmDescription,
  getHarmony,
  HarmonyParams,
  HarmonyResult,
  keyDescription,
  Keys,
  meterDescription,
  replaceAccidentals,
} from "../utils";
import { ResultWrapper } from "../components";
import {
  Button,
  Card,
  Form,
  InputNumber,
  notification,
  Select,
  Tooltip,
} from "antd";
import Dropzone from "react-dropzone";

const { Item } = Form;
const { Option } = Select;

export default function Harmonizer(): ReactElement {
  const [ctx, setCtx] = useState<AudioContext | null>(null);
  const [melodyFile, setMelodyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<HarmonyParams>({});
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<HarmonyResult | null>(null);
  const [melodyDuration, setMelodyDuration] = useState(-1);

  const [form] = Form.useForm();

  useEffect(() => {
    if (process.browser) {
      setCtx(new window.AudioContext());
    }
  }, []);

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
        (60 * meter) / bpm < melodyDuration
        ? Promise.resolve()
        : Promise.reject("");
    },
  };

  return (
    <>
      {/* <Head /> */}
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
                      danger
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
            {ctx !== null && (
              <ResultWrapper
                ctx={ctx}
                loading={loading}
                melodyFile={melodyFile}
                progress={progress}
                result={result}
                setError={setError}
                setMelodyDuration={setMelodyDuration}
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
