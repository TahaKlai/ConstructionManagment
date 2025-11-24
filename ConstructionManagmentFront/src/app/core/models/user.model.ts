export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  password?: string;
  enabled?: boolean;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
}