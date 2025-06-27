import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ChefHat, Home, BookOpen, User, LogOut, LogIn, UserPlus } from 
'lucide-react';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo ve Ana Menü */}
            <div className="flex">
              <Link to="/" className="flex items-center">
                <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
                <span className="text-xl font-bold text-gray-800">Tarif 
Paylaşım</span>
              </Link>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm 
font-medium text-gray-900 hover:text-orange-500"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Ana Sayfa
                </Link>
                <Link
                  to="/recipes"
                  className="inline-flex items-center px-1 pt-1 text-sm 
font-medium text-gray-900 hover:text-orange-500"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Tarifler
                </Link>
              </div>
            </div>

            {/* Kullanıcı Menüsü */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/recipes/create"
                    className="bg-orange-500 text-white px-4 py-2 
rounded-md text-sm font-medium hover:bg-orange-600"
                  >
                    Tarif Ekle
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 
hover:text-orange-500"
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span className="text-sm 
font-medium">{user?.adSoyad}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center text-gray-700 
hover:text-orange-500"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center bg-orange-500 text-white 
px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600"
                  >
                    <UserPlus className="h-5 w-5 mr-1" />
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © 2024 Tarif Paylaşım Platformu. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
