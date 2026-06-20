import * as SecureStore from 'expo-secure-store';
import api from './api';
import { AuthResponse, RegistrationResponse } from '../types';

export const registerStudent = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<RegistrationResponse> => {
  const response = await api.post('/auth/register', {
    email,
    password,
    role: 'STUDENT',
    firstName,
    lastName,
  });
  return response.data.data;
};

export const registerCompany = async (
  email: string,
  password: string,
  companyName: string,
): Promise<RegistrationResponse> => {
  const response = await api.post('/auth/register', {
    email,
    password,
    role: 'COMPANY',
    companyName,
  });
  return response.data.data;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('token', token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('token');
};

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('token');
};

export const verifyOTP = async (
  email: string,
  otp: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data.data;
};

export const resendOTP = async (email: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data.data;
};
