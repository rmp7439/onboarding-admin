export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}