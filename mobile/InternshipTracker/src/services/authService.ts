import * as Keychain from 'react-native-keychain';
import api from './api';
import { AuthResponse } from '../types';

export const registerStudent = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResponse> => {
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
): Promise<AuthResponse> => {
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
  await Keychain.setGenericPassword('token', token);
};

export const getToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword();
  return credentials ? credentials.password : null;
};

export const removeToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword();
};