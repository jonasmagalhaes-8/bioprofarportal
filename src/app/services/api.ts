import axios from "axios";

export const apiBackend = axios.create({
  baseURL: 'http://localhost:8080',
});

apiBackend.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
