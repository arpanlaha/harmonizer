import axios from "axios";
import { ChordName, KeyName } from "./theory";

const BACKEND_URL = `https://t-arlah-harmonizer.azurewebsites.net`;

export interface HarmonyParams {
  bpm?: number;
  key?: KeyName;
  meter?: number;
}

type HarmonyParamName = "bpm" | "key" | "meter";

const harmonyParamNames: HarmonyParamName[] = ["bpm", "key", "meter"];

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
        error.response?.data?.message ??
        "Server error - please post an issue at https://github.com/arpanlaha/harmonizer/issues",
    }));
};
