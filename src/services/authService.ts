import { type User, type AuthResponse } from '../types/auth';

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

export const login = async (credentials: any): Promise<AuthResponse> => {
  // TODO: Replace with actual backend endpoint when available
  // const { data } = await apiClient.post('/auth/login', credentials);
  // return data;
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === "admin@example.com" && credentials.password === "password123") {
        resolve({
          token: "mock_jwt_token_1234567890",
          user: { id: "u_1", name: "System Admin", email: credentials.email, role: "ADMIN" }
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};

export const logout = async () => {
  // TODO: Optional backend logout call to invalidate token
  // await apiClient.post('/auth/logout');
  removeToken();
};