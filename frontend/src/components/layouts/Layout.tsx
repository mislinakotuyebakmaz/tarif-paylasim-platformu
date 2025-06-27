// src/components/layouts/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Az önce oluşturduğumuz Navbar bileşenini import ediyoruz

const MainLayout = () => {
  return (
    // Tüm sayfalar için ortak olan arka plan rengi ve temel metin rengini burada belirliyoruz
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      
      {/* Navbar her sayfanın en üstünde sabit olarak görünecek */}
      <Navbar />

      {/* Ana içerik alanı */}
      <main className="container mx-auto p-4">
        {/* 
          <Outlet />, react-router-dom'un sihirli bir bileşenidir.
          App.tsx'te tanımladığımız Route'lardan hangisi aktifse,
          o Route'un element'ini (yani sayfa bileşenini) buraya render eder.
        */}
        <Outlet />
      </main>

      {/* 
        Eğer bir Footer bileşenin olsaydı, onu da buraya ekleyebilirdin.
        <Footer /> 
      */}
    </div>
  );
};

export default MainLayout;