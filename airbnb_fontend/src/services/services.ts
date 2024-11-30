//const
import { ACCESS_TOKEN, BASE_URL } from "../constant/constant";
//utils
import { getLocal } from "../utils/utils";
//axios
import axios, { AxiosInstance } from "axios";

export const axiosInterceptor: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 180_000,
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    config.headers.token = `${getLocal(ACCESS_TOKEN)}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const axiosInterceptorWithCybertoken: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 180_000,
});

axiosInterceptorWithCybertoken.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
