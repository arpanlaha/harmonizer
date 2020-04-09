import axios from "axios";
import { ChordName, KeyName } from "./theory";

const BACKEND_URL = `${
  process.env.REACT_APP_BACKEND_URL ??
  `http://${process.env.REACT_APP_VM_IP ?? "localhost"}:5000`
}`;

export interface HarmonyParams {
  bpm?: number;
  chords?: ChordName[];
  key?: KeyName;
  meter?: number;
}

type HarmonyParamName = "bpm" | "chords" | "key" | "meter";

const harmonyParamNames: HarmonyParamName[] = ["bpm", "chords", "key", "meter"];

export interface HarmonyResult {
  bpm: number;
  chords: ChordName[];
  key: KeyName;
  meter: number;
  start: number;
}
export interface HarmonyResponseWrapper {
  type: string;
  result?: HarmonyResult;
  error?: string;
}

export const getHarmony = (
  melody: File | Blob,
  params: HarmonyParams,
  setProgress: (progress: number) => void
): Promise<HarmonyResponseWrapper> => {
  const data = new FormData();
  data.append("melody", melody);
  harmonyParamNames.forEach((paramName) => {
    const param = params[paramName];
    if (param !== undefined) {
      data.append(
        paramName,
        typeof param === "string" ? param : JSON.stringify(param)
      );
    }
  });

  return axios
    .post(`${BACKEND_URL}/harmony`, data, {
      onUploadProgress: (progress: ProgressEvent): void =>
        setProgress((progress.loaded / progress.total) * 100),
    })
    .then((response) => ({
      type: "GET_HARMONY_SUCCESS",
      result: response.data.result,
    }))
    .catch((error) => ({
      type: "GET_HARMONY_FAIL",
      error:
        error.response?.data ??
        "Server error - please post an issue at https://github.com/arpanlaha/harmonizer/issues",
    }));
};

export const getOverlay = (
  name: string,
  melodyBuffer: AudioBuffer,
  harmonyBuffer: AudioBuffer,
  setProgress: (progress: number) => void
): Promise<any> => {
  const melodyData: ArrayBuffer[] = [];
  for (let channel = 0; channel < melodyBuffer.numberOfChannels; channel++) {
    melodyData.push(melodyBuffer.getChannelData(channel));
  }

  const harmonyData = harmonyBuffer.getChannelData(0);

  return axios
    .post(
      `${BACKEND_URL}/overlay`,
      { name, melody: melodyData, harmony: harmonyData },
      {
        onUploadProgress: (progress: ProgressEvent): void =>
          setProgress((progress.loaded / progress.total) * 100),
      }
    )
    .then((response) => ({
      type: "GET_OVERLAY_SUCCESS",
      result: response.data,
    }))
    .catch((error) => ({
      type: "GET_OVERLAY_FAIL",
      error:
        error.response?.data ??
        "Server error - please post an issue at https://github.com/arpanlaha/harmonizer/issues",
    }));
};
