import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('datastory_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
