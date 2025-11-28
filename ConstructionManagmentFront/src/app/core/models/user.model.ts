export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  password?: string;
  enabled?: boolean;
  roles: Array<Role | string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id?: number;
  name: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
  captchaToken?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
}