import { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { type User } from '../types/auth';
import { getToken, getCurrentUser, removeToken } from '../services/authService';
import { useToast } from '../hooks/useToast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, rememberMe: boolean) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const clearAuth = useCallback(() => {
    removeToken();
    setUser(null);
    setToken(null);
  }, []);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getCurrentUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Listen for global 401 unauthorized events from Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      if (token) { // Only toast if we were previously logged in
        toast("Session expired. Please log in again.", "error");
        clearAuth();
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [clearAuth, toast, token]);

  const setAuth = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      setAuth,
      clearAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}