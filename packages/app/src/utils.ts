import axios, { AxiosError } from "axios";
import { API } from "./API";
export const source = axios.CancelToken.source();
export const JuneAPI = axios.create({
  baseURL: API,
});

export const setJuneHeader = (token: string) =>
  (JuneAPI.defaults.headers.common["authorization"] = `Bearer ${token}`);

export const axiosRequestError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    const serverError = error as AxiosError;
    if (serverError && serverError.response) {
      return serverError.response.data;
    }
  }
  console.log({ success: false, errorMessage: error.message as String });
  return { success: false, errorMessage: error.message as String };
};
