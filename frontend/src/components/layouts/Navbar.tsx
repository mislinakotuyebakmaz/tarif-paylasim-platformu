// src/components/layouts/Navbar.tsx

import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; // Global Zustand store'umuzu import ediyoruz

const Navbar = () => {
  // Gerekli bilgileri ve fonksiyonları store'dan çekiyoruz.
  // Bu hook sayesinde, state değiştiğinde (login/logout) Navbar otomatik olarak yeniden render edilir.
  const { isAuthenticated, user, logout } = useAuthStore();

  // Aktif linki stilendirmek için kullanılacak ortak class'lar
  const activeLinkStyle = {
    color: '#f59e0b', // amber-500
    textDecoration: 'underline',
  };

  return (
    <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        
        {/* Logo veya Site Adı */}
        <Link to="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
          Tarif Defteri
        </Link>

        {/* Navigasyon Linkleri ve Butonlar */}
        <div className="flex items-center space-x-4">
          
          <NavLink 
            to="/recipes" 
            className="text-slate-300 hover:text-amber-500 transition-colors"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Tarifler
          </NavLink>

          {/* Kullanıcı giriş yapmış mı? Koşullu render */}
          {isAuthenticated ? (
            <>
              {/* Giriş Yapmış Kullanıcı Menüsü */}
              <span className="text-slate-400 hidden sm:block">|</span>
              <NavLink 
                to="/profile" 
                className="text-slate-300 hover:text-amber-500 transition-colors"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                Hoş geldin, {user?.kullaniciAdi}
              </NavLink>
              <Link to="/create-recipe" className="bg-green-600 text-white font-bold px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                Yeni Tarif
              </Link>
              <button onClick={logout} className="bg-red-600 text-white font-bold px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              {/* Ziyaretçi Menüsü */}
              <Link to="/login" className="text-slate-300 hover:text-amber-500 transition-colors">
                Giriş Yap
              </Link>
              <Link to="/register" className="bg-amber-600 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;