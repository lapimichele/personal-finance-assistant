import { api } from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/users/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 