import axios, { AxiosError, AxiosResponse } from "axios";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://52.240.158.249:5000";

interface Response {
  type: string;
  response?: AxiosResponse;
  error?: AxiosError;
}

export const getHarmony = (file: File): Promise<Response> => {
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
