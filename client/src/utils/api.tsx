import axios, { AxiosError } from "axios";

const BACKEND_URL =
  process.env.GATSBY_BACKEND_URL ?? "http://52.240.158.249:5000";

interface Response {
  bpm: number;
  chords: string[];
}
interface ResponseWrapper {
  type: string;
  result?: Response;
  error?: AxiosError;
}

export const getHarmony = (file: File | Blob): Promise<ResponseWrapper> => {
  const data = new FormData();
  data.append("file", file);
  return axios
    .post(`${BACKEND_URL}/api/harmony`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => ({
      type: "GET_HARMONY_SUCCESS",
      result: response.data.result,
    }))
    .catch((error) => ({ type: "GET_HARMONY_FAIL", error }));
};
