// src/pages/ProfilePage.tsx

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { recipeService } from '../services/recipeService';
import toast from 'react-hot-toast';

// Modal bileşeni
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  // Debug için
  console.log('ProfilePage User:', user);
  console.log('User ID type:', typeof user?.id, user?.id);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [editForm, setEditForm] = useState({
    kullaniciAdi: user?.kullaniciAdi || '',
    adSoyad: user?.adSoyad || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Kullanıcının tariflerini çek
  const { data: userRecipes = [], isLoading } = useQuery({
    queryKey: ['userRecipes', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      console.log('Fetching recipes for user ID:', user.id);
      return recipeService.getUserRecipes(Number(user.id));
    },
    enabled: !!user?.id,
  });

  // Tarif arama/filtreleme
  const filteredRecipes = userRecipes.filter(recipe =>
    recipe.baslik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.kategoriAdi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Profil güncelleme mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { kullaniciAdi: string; adSoyad: string; email: string }) => {
      // API çağrısı yapılacak (authService'e eklemen gerekebilir)
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Profil güncellenemedi');
      return response.json();
    },
    onSuccess: (data) => {
      updateUser(data);
      toast.success('Profil başarıyla güncellendi!');
      setShowEditModal(false);
    },
    onError: () => {
      toast.error('Profil güncellenirken bir hata oluştu.');
    }
  });

  // Şifre değiştirme mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Şifre değiştirilemedi');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Şifre başarıyla değiştirildi!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: () => {
      toast.error('Şifre değiştirilirken bir hata oluştu.');
    }
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır!');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
  };

  if (!user) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapın</h1>
          <Link to="/login" className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  // İstatistikler
  const stats = {
    totalRecipes: userRecipes.length,
    totalViews: userRecipes.reduce((sum, recipe) => sum + (recipe.yorumSayisi || 0), 0),
    avgRating: userRecipes.length > 0 
      ? (userRecipes.reduce((sum, recipe) => sum + (recipe.ortalamaPuan || 0), 0) / userRecipes.length).toFixed(1)
      : '0.0'
  };

  return (
    <div className="bg-slate-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* HEADER - Kullanıcı Bilgileri */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Profil Resmi */}
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {user.kullaniciAdi?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            
            {/* Kullanıcı Bilgileri */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {user.adSoyad || user.kullaniciAdi || 'Kullanıcı'}
              </h1>
              <p className="text-white/80 text-lg mb-2">@{user.kullaniciAdi}</p>
              <p className="text-white/80 text-lg mb-2">{user.email}</p>
              <p className="text-white/70">
                Üyelik tarihi: {user.kayitTarihi ? new Date(user.kayitTarihi).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
              </p>
            </div>

            {/* Aksiyonlar */}
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEditModal(true)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
              >
                Profili Düzenle
              </button>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
              >
                Şifre Değiştir
              </button>
            </div>
          </div>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl text-center border border-slate-700">
            <div className="text-3xl font-bold text-amber-500 mb-2">
              {stats.totalRecipes}
            </div>
            <p className="text-slate-300">Toplam Tarif</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl text-center border border-slate-700">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {stats.totalViews}
            </div>
            <p className="text-slate-300">Toplam Görüntülenme</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl text-center border border-slate-700">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {stats.avgRating}⭐
            </div>
            <p className="text-slate-300">Ortalama Puan</p>
          </div>
        </div>

        {/* TARİFLERİM BAŞLIĞI VE ARAMA */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-white">Tariflerim</h2>
          
          <div className="flex gap-4">
            {/* Arama */}
            <input
              type="text"
              placeholder="Tariflerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
            />
            
            {/* Yeni Tarif Butonu */}
            <Link 
              to="/create-recipe"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              + Yeni Tarif
            </Link>
          </div>
        </div>

        {/* TARİFLER LİSTESİ */}
        {isLoading ? (
          <div className="text-center text-white text-xl py-20">
            Tarifler yükleniyor...
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-2xl text-center border border-slate-700">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz tarif eklemediniz'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm 
                ? 'Farklı anahtar kelimeler deneyin veya filtreleri kaldırın.' 
                : 'İlk tarifinizi ekleyerek başlayın ve lezzetli yemeklerinizi diğer kullanıcılarla paylaşın!'
              }
            </p>
            {!searchTerm && (
              <Link 
                to="/create-recipe"
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors"
              >
                İlk Tarifinizi Ekleyin
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:scale-105">
                {/* Tarif Resmi */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={recipe.resimUrl || `https://source.unsplash.com/400x300?food,${recipe.id}`}
                    alt={recipe.baslik}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Tarif Bilgileri */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white line-clamp-2">
                      {recipe.baslik}
                    </h3>
                    <span className="text-amber-500 text-sm font-semibold">
                      {recipe.kategoriAdi}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {recipe.aciklama}
                  </p>
                  
                  {/* Tarif Metrikleri */}
                  <div className="flex justify-between text-sm text-slate-500 mb-4">
                    <span>⏱️ {(recipe.hazirlikSuresi || 0) + (recipe.pisirmeSuresi || 0)} dk</span>
                    <span>👥 {recipe.porsiyon} kişi</span>
                    <span>💬 {recipe.yorumSayisi || 0}</span>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex gap-2">
                    <Link 
                      to={`/recipes/${recipe.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Görüntüle
                    </Link>
                    <Link 
                      to={`/recipes/edit/${recipe.id}`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-center text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Düzenle
                    </Link>
                  </div>

                  {/* Oluşturulma Tarihi */}
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      📅 {new Date(recipe.olusturmaTarihi).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profil Düzenleme Modalı */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Profili Düzenle">
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={editForm.kullaniciAdi}
                  onChange={(e) => setEditForm(prev => ({ ...prev, kullaniciAdi: e.target.value }))}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={editForm.adSoyad}
                  onChange={(e) => setEditForm(prev => ({ ...prev, adSoyad: e.target.value }))}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">E-posta</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-slate-500"
              >
                {updateProfileMutation.isPending ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Şifre Değiştirme Modalı */}
        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Şifre Değiştir">
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Mevcut Şifre</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Yeni Şifre</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-slate-500"
              >
                {changePasswordMutation.isPending ? 'Değiştiriliyor...' : 'Değiştir'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}