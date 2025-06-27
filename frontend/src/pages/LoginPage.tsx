

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast'; // Bildirimler için

export default function LoginPage() {
  // Formdaki inputların durumunu tutmak için state'ler
  const [kullaniciAdiVeyaEmail, setKullaniciAdiVeyaEmail] = useState('');
  const [sifre, setSifre] = useState('');
  
  // Yükleme ve hata durumlarını yönetmek için state'ler
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Zustand store'undan 'setAuth' fonksiyonunu alıyoruz
  const setAuth = useAuthStore((state) => state.setAuth);
  
  // Yönlendirme için useNavigate hook'u
  const navigate = useNavigate();

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Formun sayfayı yeniden yüklemesini engelle
    
    // Basit bir ön kontrol
    if (!kullaniciAdiVeyaEmail || !sifre) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsLoading(true); // Yükleme durumunu başlat
    setError(''); // Eski hataları temizle

    try {
      // authService'i kullanarak API'ye giriş isteği gönder
      const response = await authService.login({
        kullaniciAdiVeyaEmail,
        sifre,
      });

      // Başarılı olursa, Zustand store'unu ve localStorage'ı güncelle
      setAuth(response.user, response.token);
      
      toast.success('Başarıyla giriş yapıldı!'); // Başarı bildirimi göster

      navigate('/'); // Kullanıcıyı anasayfaya yönlendir

    } catch (err) {
      // Hata olursa, kullanıcıya bilgi ver
      setError('Kullanıcı adı veya şifre hatalı.');
      toast.error('Giriş bilgileri hatalı!');
      console.error('Giriş hatası:', err);
    } finally {
      setIsLoading(false); // Yükleme durumunu bitir
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit} 
          className="bg-slate-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center text-amber-500">
            Giriş Yap
          </h2>
          
          {error && <p className="bg-red-900 border border-red-700 text-white p-3 rounded mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="username">
              Kullanıcı Adı veya Email
            </label>
            <input
              id="username"
              type="text"
              value={kullaniciAdiVeyaEmail}
              onChange={(e) => setKullaniciAdiVeyaEmail(e.target.value)}
              className="shadow appearance-none border border-slate-700 rounded w-full py-3 px-4 bg-slate-700 text-slate-200 leading-tight focus:outline-none focus:shadow-outline focus:border-amber-500"
              disabled={isLoading} // Yükleme sırasında inputu pasif yap
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="shadow appearance-none border border-slate-700 rounded w-full py-3 px-4 bg-slate-700 text-slate-200 mb-3 leading-tight focus:outline-none focus.shadow-outline focus:border-amber-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-slate-500"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Hesabın yok mu?{' '}
            <Link to="/register" className="font-bold text-amber-500 hover:text-amber-400">
              Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}