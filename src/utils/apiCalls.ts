import axios from "axios";
import { HttpMethod } from "./httpMethods";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_URL_BACKEND_VERSION}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Prevent retry if the failed request was the refresh call itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        await await apiRequest({
          method: HttpMethod.POST,
          url: "/auth/refresh",
        });
        return axios(originalRequest); // retry the original request
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (refreshError) {
        window.location.href = "/"; // refresh also failed
      }
    }

    return Promise.reject(error);
  }
);

type ApiRequestParams = {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
};

const apiRequest = async ({
  method,
  url,
  data,
  params,
  headers,
}: ApiRequestParams) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Unauthorized");
      // Optionally handle token refresh or redirect
    }
    throw error;
  }
};

export default apiRequest;
