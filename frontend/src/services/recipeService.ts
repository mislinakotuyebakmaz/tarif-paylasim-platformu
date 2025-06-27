import api from './api';
import { type RecipeDto, type RecipeCreateDto, type RecipeUpdateDto } from '../types';

export const recipeService = {
  // Tüm tarifleri getir
  getAll: async (): Promise<RecipeDto[]> => {
    const response = await api.get<RecipeDto[]>('/recipes');
    return response.data;
  },

  // Aktif tarifleri getir
  getActive: async (): Promise<RecipeDto[]> => {
    const response = await api.get<RecipeDto[]>('/recipes/active');
    return response.data;
  },

  // Tek tarif getir
  getById: async (id: number): Promise<RecipeDto> => {
    const response = await api.get<RecipeDto>(`/recipes/${id}`);
    return response.data;
  },

  // Kullanıcının tariflerini getir
  getUserRecipes: async (userId: number): Promise<RecipeDto[]> => {
    const response = await 
api.get<RecipeDto[]>(`/recipes/user/${userId}`);
    return response.data;
  },

  // Kategoriye göre tarifleri getir
  getByCategory: async (categoryId: number): Promise<RecipeDto[]> => {
    const response = await 
api.get<RecipeDto[]>(`/recipes/category/${categoryId}`);
    return response.data;
  },

  // Yeni tarif oluştur
  create: async (data: RecipeCreateDto): Promise<RecipeDto> => {
    const response = await api.post<RecipeDto>('/recipes', data);
    return response.data;
  },

  // Tarif güncelle
  update: async (id: number, data: RecipeUpdateDto): Promise<RecipeDto> => 
{
    const response = await api.put<RecipeDto>(`/recipes/${id}`, data);
    return response.data;
  },

  // Tarif sil
  delete: async (id: number): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },

  // Tarifi deaktif et
  deactivate: async (id: number): Promise<void> => {
    await api.put(`/recipes/${id}/deactivate`);
  }
};
