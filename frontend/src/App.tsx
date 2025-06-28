// src/App.tsx - KESİN VE DOĞRU YAPI

import { useEffect } from 'react';
// YENİ VE DOĞRU HALİ:
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Sayfaları import ediyoruz
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import ProfilePage from './pages/ProfilePage';
import EditRecipePage from './pages/EditRecipePage';

// Ortak bileşenleri import ediyoruz
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';

// React Query client'ını oluşturuyoruz
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Pencereye odaklanıldığında veriyi yeniden çekme
      retry: 1, // Hata durumunda 1 kez yeniden dene
    },
  },
});

function App() {
  // Sayfa yenilendiğinde localStorage'dan oturum bilgilerini yükle
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Ana Layout Route'u: Tüm sayfalar bu layout'un içinde (Navbar vb. ile) render edilir */}
          <Route element={<Layout />}>
            
            {/* HERKESİN ERİŞEBİLECEĞİ GENEL SAYFALAR */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            
            {/* SADECE GİRİŞ YAPMIŞ KULLANICILARIN ERİŞEBİLECEĞİ ÖZEL SAYFALAR */}
            <Route
              path="/create-recipe"
              element={
                <PrivateRoute>
                  <CreateRecipePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/recipes/edit/:id"
              element={
                <PrivateRoute>
                  <EditRecipePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* DİNAMİK ID'Lİ SAYFA (GENELLİKLE EN SONA KONULUR) */}
            {/* Bu, yukarıdaki daha spesifik yollarla eşleşmeyen her şeyi yakalar */}
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            
            {/* EŞLEŞMEYEN TÜM YOLLAR İÇİN 404 SAYFASI (İyi bir pratik) */}
            <Route path="*" element={
              <div className="p-8 text-center text-white">
                <h1 className="text-3xl font-bold">404 - Sayfa Bulunamadı</h1>
                <Link to="/" className="text-amber-500 mt-4 inline-block">Ana Sayfaya Dön
                </Link>
              </div>
            } />
          
          </Route> {/* Ana Layout Route'u burada kapanır */}
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;