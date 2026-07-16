import axios from 'axios';
import { getToken, removeToken } from '../services/authService';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TASK 9: Handle network failures / backend unavailability gracefully
    if (!error.response) {
      return Promise.reject(new Error("Network unavailable. Please check your connection."));
    }
    
    if (error.response && error.response.status === 401) {
      removeToken();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    
    return Promise.reject(error);
  }
);