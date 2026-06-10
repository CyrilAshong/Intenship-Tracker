import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_URL = 'http://10.0.2.2:5000/api';
// 10.0.2.2 is the Android emulator's alias for localhost
// If using a real device, replace with your machine's local IP e.g. http://192.168.1.5:5000/api

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request automatically
api.interceptors.request.use(async (config) => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    config.headers.Authorization = `Bearer ${credentials.password}`;
  }
  return config;
});

export default api;