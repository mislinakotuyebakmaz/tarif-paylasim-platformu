// src/types/api.types.ts - YENİ DOSYANIN İÇERİĞİ

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
  
  export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
  }