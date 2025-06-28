// src/components/layout/Navbar.tsx

import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  // Gerekli bilgileri ve fonksiyonları Zustand store'undan çekiyoruz.
  const { isAuthenticated, user, logout } = useAuthStore();

  // NavLink'in 'style' prop'u için kullanılacak fonksiyon.
  // Link aktif olduğunda özel bir stil uygular.
  const getActiveLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return isActive 
      ? { color: '#f59e0b', /* amber-500 */ borderBottom: '2px solid #f59e0b' } 
      : {};
  };

  return (
    <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        
        {/* Logo veya Site Adı */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
          Tarif Defteri
        </Link>

        {/* Orta Kısım Navigasyon Linkleri */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink 
            to="/" 
            style={getActiveLinkStyle}
            className="text-slate-300 hover:text-amber-500 transition-colors pb-1"
          >
            Ana Sayfa
          </NavLink>
          <NavLink 
            to="/recipes" 
            style={getActiveLinkStyle}
            className="text-slate-300 hover:text-amber-500 transition-colors pb-1"
          >
            Tarifler
          </NavLink>
        </div>

        {/* Sağ Kısım: Kullanıcı Butonları */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <>
              {/* Giriş Yapmış Kullanıcı Menüsü */}
              <Link to="/create-recipe" className="bg-green-600 text-white font-bold px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                Yeni Tarif
              </Link>
              <div className="h-6 w-px bg-slate-600 hidden sm:block"></div> {/* Ayırıcı Çizgi */}
              <NavLink 
                to="/profile" 
                style={getActiveLinkStyle}
                className="text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2"
              >
                <span className="font-semibold">{user?.kullaniciAdi}</span>
              </NavLink>
              <button onClick={logout} className="bg-slate-700 text-slate-300 px-3 py-2 rounded-md text-sm hover:bg-red-600 hover:text-white transition-colors">
                Çıkış
              </button>
            </>
          ) : (
            <>
              {/* Ziyaretçi Menüsü */}
              <Link to="/login" className="text-slate-300 hover:text-amber-500 transition-colors px-3 py-2 text-sm sm:text-base">
                Giriş Yap
              </Link>
              <Link to="/register" className="bg-amber-600 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-700 transition-colors text-sm sm:text-base">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}