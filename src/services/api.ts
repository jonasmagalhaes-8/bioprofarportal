import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export const apiBackend: AxiosInstance = axios.create({
  baseURL: 'https://bioprofarbackend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiBackend.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);
