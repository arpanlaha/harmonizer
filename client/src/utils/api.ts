import axios, { AxiosError } from "axios";
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
  file: File | Blob,
  params: HarmonyParams
): Promise<HarmonyResponseWrapper> => {
  const data = new FormData();
  data.append("melody", file);
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
    .post(`${BACKEND_URL}/harmony`, data)
    .then((response) => ({
      type: "GET_HARMONY_SUCCESS",
      result: response.data.result,
    }))
    .catch((error: AxiosError) => ({
      type: "GET_HARMONY_FAIL",
      error: error.response?.data,
    }));
};
