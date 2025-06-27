// src/pages/RegisterPage.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [email, setEmail] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [sifre, setSifre] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.register({
        kullaniciAdi,
        email,
        sifre,
        adSoyad,
      });
      setAuth(response.user, response.token);
      toast.success('Başarıyla kayıt oldunuz ve giriş yaptınız!');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.';
      toast.error(errorMessage);
      console.error('Kayıt hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "shadow appearance-none border border-slate-700 rounded w-full py-3 px-4 bg-slate-700 text-slate-200 leading-tight focus:outline-none focus:shadow-outline focus:border-amber-500";
  const buttonStyles = "bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-slate-500 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-slate-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center text-amber-500">Kayıt Ol</h2>
          
          {/* Form Alanları */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="kullaniciAdi">Kullanıcı Adı</label>
            <input id="kullaniciAdi" type="text" value={kullaniciAdi} onChange={(e) => setKullaniciAdi(e.target.value)} required disabled={isLoading} className={inputStyles} />
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className={inputStyles} />
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="adSoyad">Ad Soyad</label>
            <input id="adSoyad" type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} required disabled={isLoading} className={inputStyles} />
          </div>

          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="sifre">Şifre</label>
            <input id="sifre" type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} required disabled={isLoading} className={inputStyles} />
          </div>

          <button type="submit" disabled={isLoading} className={buttonStyles}>
            {isLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </button>
          
          <p className="text-center text-slate-400 text-sm mt-6">
            Zaten bir hesabın var mı?{' '}
            <Link to="/login" className="font-bold text-amber-500 hover:text-amber-400">Giriş Yap</Link>
          </p>
        </form>
      </div>
    </div>
  );
}