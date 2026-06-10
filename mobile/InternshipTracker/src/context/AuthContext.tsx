import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getToken, removeToken } from '../services/authService';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, check if a token exists in keychain
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = await getToken();
        if (savedToken) {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          setToken(savedToken);
        }
      } catch (error) {
        // Token expired or invalid — clear it
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const setAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);