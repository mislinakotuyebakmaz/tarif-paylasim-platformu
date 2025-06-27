import api from './api';
import { type LoginDto, type RegisterDto, type LoginResponseDto } from '../types';

export const authService = {
  login: async (data: LoginDto): Promise<LoginResponseDto> => {
    const response = await api.post<LoginResponseDto>('/auth/login', 
data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<LoginResponseDto> => {
    const response = await api.post<LoginResponseDto>('/auth/register', 
data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
