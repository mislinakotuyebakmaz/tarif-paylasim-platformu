// src/pages/CreateRecipePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';
import { type RecipeCreateDto } from '../types';

export default function CreateRecipePage() {
  const navigate = useNavigate();
  
  // Form verilerini tutmak için tek bir state nesnesi kullanıyoruz
  const [formData, setFormData] = useState<RecipeCreateDto>({
    baslik: '',
    aciklama: '',
    hazirlanis: '',
    malzemeler: '',
    kategoriId: 0, // Başlangıçta seçilmemiş
    hazirlikSuresi: 0,
    pisirmeSuresi: 0,
    porsiyon: '',
    zorlukDerecesi: 'Kolay', // Varsayılan değer
    resimUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Query ile kategorileri çekiyoruz
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'], // Bu sorgu için benzersiz bir anahtar
    queryFn: categoryService.getAll, // API'den veri çekecek fonksiyon
  });

  // Formdaki input değişimlerini yöneten fonksiyon
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'kategoriId' || name === 'hazirlikSuresi' || name === 'pisirmeSuresi' 
               ? parseInt(value) || 0 
               : value,
    }));
  };

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.kategoriId === 0) {
      toast.error('Lütfen bir kategori seçin.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const createdRecipe = await recipeService.create(formData);
      toast.success('Tarif başarıyla eklendi!');
      navigate(`/recipes/${createdRecipe.id}`); // Oluşturulan tarifin detay sayfasına git
    } catch (error) {
      toast.error('Tarif eklenirken bir hata oluştu.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Yeni Tarif Ekle</h1>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-6">
        
        {/* Başlık */}
        <div>
          <label htmlFor="baslik" className="block text-sm font-medium text-slate-300">Başlık</label>
          <input type="text" name="baslik" id="baslik" value={formData.baslik} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
        </div>

        {/* Açıklama */}
        <div>
          <label htmlFor="aciklama" className="block text-sm font-medium text-slate-300">Kısa Açıklama</label>
          <textarea name="aciklama" id="aciklama" value={formData.aciklama} onChange={handleChange} required rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
        </div>

        {/* Kategori Dropdown */}
        <div>
          <label htmlFor="kategoriId" className="block text-sm font-medium text-slate-300">Kategori</label>
          <select name="kategoriId" id="kategoriId" value={formData.kategoriId} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500">
            <option value={0} disabled>Bir kategori seçin...</option>
            {isLoadingCategories ? (
              <option disabled>Kategoriler yükleniyor...</option>
            ) : (
              categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.ad}</option>
              ))
            )}
          </select>
        </div>

        {/* Malzemeler */}
        <div>
            <label htmlFor="malzemeler" className="block text-sm font-medium text-slate-300">Malzemeler (Her birini yeni bir satıra yazın)</label>
            <textarea name="malzemeler" id="malzemeler" value={formData.malzemeler} onChange={handleChange} required rows={6} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
        </div>

        {/* Hazırlanış */}
        <div>
            <label htmlFor="hazirlanis" className="block text-sm font-medium text-slate-300">Hazırlanış (Adımları yeni satırlara yazın)</label>
            <textarea name="hazirlanis" id="hazirlanis" value={formData.hazirlanis} onChange={handleChange} required rows={8} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
        </div>
        
        {/* Diğer Alanlar ... */}

        {/* Submit Butonu */}
        <div className="text-right">
          <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-500">
            {isSubmitting ? 'Tarif Ekleniyor...' : 'Tarifi Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}