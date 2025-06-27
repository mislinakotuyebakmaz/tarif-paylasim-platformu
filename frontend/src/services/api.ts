// src/services/api.ts - DOĞRU HALİ

import axios, { AxiosError } from 'axios';
import { type ApiError } from '../types/api.types'; // Tipi kendi dosyasından alıyoruz

// API Base URL - Backend'inin çalıştığı DOĞRU HTTP adresi
const API_BASE_URL = 'http://localhost:5300/api'; // <-- YAPILAN TEK DEĞİŞİKLİK BU!

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Her istek gönderilmeden önce araya girer
// ve 'Authorization' başlığını otomatik olarak ekler.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // İstek gönderilirken bir hata olursa burası çalışır
    return Promise.reject(error);
  }
);

// Response Interceptor: API'den bir cevap geldiğinde araya girer.
// Hata yönetimi için harikadır.
api.interceptors.response.use(
  // Başarılı cevaplar (2xx kodları) için hiçbir şey yapma, olduğu gibi devam etsin.
  (response) => response,
  
  // Hatalı cevaplar için burası çalışır.
  (error: AxiosError<ApiError>) => {
    // Eğer gelen hata 401 Unauthorized (Yetkisiz) ise...
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş demektir.
      console.error('Yetkisiz istek! Token geçersiz veya süresi dolmuş. Çıkış yapılıyor...');
      
      // Kullanıcı bilgilerini ve token'ı temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Zustand store'unu da temizlemek iyi bir pratik olurdu (opsiyonel)
      // import { useAuthStore } from '../store/authStore';
      // useAuthStore.getState().logout();
      
      // Kullanıcıyı login sayfasına yönlendir.
      window.location.href = '/login';
    }
    
    // Diğer hataları (400, 404, 500 vb.) olduğu gibi devam ettir ki
    // component'ler kendi catch bloklarında yakalayabilsin.
    return Promise.reject(error);
  }
);

export default api;