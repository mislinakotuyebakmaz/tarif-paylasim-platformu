import api from './api';
import { type CategoryDto } from '../types';

export const categoryService = {
  getAll: async (): Promise<CategoryDto[]> => {
    const response = await api.get<CategoryDto[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<CategoryDto> => {
    const response = await api.get<CategoryDto>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: { ad: string; aciklama?: string }): Promise<CategoryDto> => {
    const response = await api.post<CategoryDto>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: { ad: string; aciklama?: string }): Promise<void> => {
    await api.put(`/categories/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};