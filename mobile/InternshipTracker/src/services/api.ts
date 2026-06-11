import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://172.20.10.5:5000/api';
// Replace 192.168.1.5 with your PC's local IP address
// To find it: run 'ipconfig' in Command Prompt and look for IPv4 Address

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;