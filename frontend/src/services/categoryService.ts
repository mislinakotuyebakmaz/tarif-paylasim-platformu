// src/services/categoryService.ts

import api from './api';

export interface CategoryDto {
  id: number;
  ad: string;
  aciklama?: string;
  tarifSayisi?: number;
  aktifMi: boolean;
}

export const categoryService = {
  // Tüm kategorileri getir
  getAll: async (): Promise<CategoryDto[]> => {
    const response = await api.get<CategoryDto[]>('/categories');
    return response.data;
  },

  // Tek kategori getir
  getById: async (id: number): Promise<CategoryDto> => {
    const response = await api.get<CategoryDto>(`/categories/${id}`);
    return response.data;
  },

  // Yeni kategori oluştur
  create: async (data: { ad: string; aciklama?: string }): Promise<CategoryDto> => {
    const response = await api.post<CategoryDto>('/categories', data);
    return response.data;
  },

  // Kategori güncelle
  update: async (id: number, data: { ad: string; aciklama?: string }): Promise<CategoryDto> => {
    const response = await api.put<CategoryDto>(`/categories/${id}`, data);
    return response.data;
  },

  // Kategori sil
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};