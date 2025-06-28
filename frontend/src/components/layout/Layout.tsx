// src/components/layout/Layout.tsx - DOĞRU HALİ
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // './Navbar' yolu, Navbar.tsx'in aynı klasörde olduğunu varsayar

export default function Layout() {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}