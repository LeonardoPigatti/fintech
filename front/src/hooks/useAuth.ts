import { useState } from 'react';
import { authApi } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token;

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(data);
      localStorage.setItem('token', response.accessToken);
      setToken(response.accessToken);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email ou senha inválidos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      localStorage.setItem('token', response.accessToken);
      setToken(response.accessToken);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setToken(null);
    setUserName('');
  };

  return { isAuthenticated, token, userName, loading, error, login, register, logout };
}
