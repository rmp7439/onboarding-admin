import { type User, type AuthResponse } from '../types/auth';
import { apiClient } from '../api/axios';

const TOKEN_KEY = 'admin_auth_token';
const USER_KEY = 'admin_user';

export const storeToken = (token: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const storeUser = (user: User, rememberMe: boolean) => {
  const userData = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(USER_KEY, userData);
  } else {
    sessionStorage.setItem(USER_KEY, userData);
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data.data; 
};

export const logout = async () => {
  // Optional: Trigger backend logout/invalidation here if implemented
  removeToken();
};