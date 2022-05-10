import axios from "axios";
import * as LogInterceptor from "./log";
import AppConfig from "../utils/AppConfig";
import ApiHelper from "../utils/ApiHelper";

const apiClient = axios.create({
  baseURL: AppConfig.baseURL,
  responseType: "json",
  withCredentials: true,
  timeout: 20000,
});

apiClient.interceptors.request.use(
  config => LogInterceptor.requestLog(config),
  error => LogInterceptor.requestError(error),
);

apiClient.interceptors.response.use(
  response => LogInterceptor.responseLog(response),
  error => LogInterceptor.responseError(error),
);

function setAccessToken(accessToken?: string) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken || ""}`;
}

function addOnUnAuthorizeListener(onUnAuthorize: () => void) {
  apiClient.interceptors.response.use(
    (res) => {
      if (ApiHelper.isTokenFail(res)) {
        onUnAuthorize();
      }
      return res;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}

export {
  setAccessToken,
  addOnUnAuthorizeListener,
};

export default apiClient;