import { Mutex } from "async-mutex";
import axios from "axios";

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
});

export const refreshToken = async () => {
  return await mutex.runExclusive(async () => {
    try {

      // testing phase
      console.log("Access token before get new: " + localStorage.getItem('access_token'));

      const response = await instance.post('/api/v1/auth/refresh');

      const { access_token } = response;

      console.log("Access token after get new: " + access_token);

      localStorage.setItem("access_token", access_token);

      instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      return true;
    } catch (err) {
      console.log("Get refreshed token failed with error: " + err);
      return false;
    }
  })
}

instance.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    }
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.headers[NO_RETRY_HEADER]
    ) {
      originalRequest.headers[NO_RETRY_HEADER] = 'true';
      const newToken = await refreshToken();

      if (newToken) {
        return instance(originalRequest);
      }

      // Xóa token và redirect về login
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
      return Promise.reject(new Error('Session expired'));
    }

    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(new Error('Connection error'));
  }
);

instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  function (error) {
    return Promise.reject(error?.response?.data);
  }
);
export default instance;