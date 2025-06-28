// src/pages/EditRecipePage.tsx

import { useEffect, useState } from 'react';
import { type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';
import { type RecipeUpdateDto, type CategoryDto } from '../types';

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = parseInt(id || '0');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form verilerini tutmak için state
  const [formData, setFormData] = useState<Partial<RecipeUpdateDto>>({});

  // 1. Düzenlenecek tarifin mevcut verilerini çek
  const { data: recipeToEdit, isLoading: isLoadingRecipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => recipeService.getById(recipeId),
    enabled: !!recipeId, // Sadece geçerli bir recipeId varsa çalıştır
  });

  // 2. Kategorileri dropdown için çek
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  // 3. Tarif verisi yüklendiğinde, formu o verilerle doldur
  useEffect(() => {
    if (recipeToEdit) {
      setFormData({
        baslik: recipeToEdit.baslik,
        aciklama: recipeToEdit.aciklama,
        hazirlanis: recipeToEdit.hazirlanis,
        malzemeler: recipeToEdit.malzemeler,
        kategoriId: recipeToEdit.kategoriId,
        hazirlikSuresi: recipeToEdit.hazirlikSuresi,
        pisirmeSuresi: recipeToEdit.pisirmeSuresi,
        porsiyon: recipeToEdit.porsiyon,
        zorlukDerecesi: recipeToEdit.zorlukDerecesi,
        resimUrl: recipeToEdit.resimUrl,
      });
    }
  }, [recipeToEdit]); // `recipeToEdit` verisi geldiğinde bu etki çalışır

  // 4. Güncelleme işlemini yapacak olan useMutation
  const updateMutation = useMutation({
    mutationFn: (updatedData: RecipeUpdateDto) => recipeService.update(recipeId, updatedData),
    onSuccess: () => {
      toast.success('Tarif başarıyla güncellendi!');
      // İlgili verileri tazeleyelim ki kullanıcı eski veriyi görmesin
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['latestRecipes'] });
      navigate(`/recipes/${recipeId}`); // Güncellenen tarifin detay sayfasına git
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Tarif güncellenirken bir hata oluştu.');
    },
  });

  // Formdaki her değişiklikte formData state'ini günceller
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'kategoriId' || name === 'hazirlikSuresi' || name === 'pisirmeSuresi'
        ? parseInt(value) || undefined
        : value,
    }));
  };

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.kategoriId) {
        toast.error("Lütfen bir kategori seçin.");
        return;
    }
    updateMutation.mutate(formData as RecipeUpdateDto);
  };
  
  // Yükleme sırasında gösterilecek ekran
  if (isLoadingRecipe || isLoadingCategories) {
    return <div className="text-center p-8 text-white">Form Yükleniyor...</div>;
  }

  // Eğer bir sebepten tarif bulunamazsa
  if (!recipeToEdit) {
    return <div className="text-center p-8 text-white">Düzenlenecek tarif bulunamadı.</div>;
  }

  // --- FORMUN JSX KISMI ---
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        <span className="text-amber-500">"{recipeToEdit.baslik}"</span> Tarifini Düzenle
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-6">
        
        {/* Başlık */}
        <div>
          <label htmlFor="baslik" className="block text-sm font-medium text-slate-300">Başlık</label>
          <input type="text" name="baslik" id="baslik" value={formData.baslik || ''} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
        </div>

        {/* Açıklama */}
        <div>
          <label htmlFor="aciklama" className="block text-sm font-medium text-slate-300">Kısa Açıklama</label>
          <textarea name="aciklama" id="aciklama" value={formData.aciklama || ''} onChange={handleChange} required rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
        </div>
        
        {/* Fotoğraf URL'i */}
        <div>
           <label htmlFor="resimUrl" className="block text-sm font-medium text-slate-300">Fotoğraf URL'i (Opsiyonel)</label>
           <input type="url" name="resimUrl" id="resimUrl" value={formData.resimUrl || ''} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
        </div>

        {/* Kategori Dropdown */}
        <div>
          <label htmlFor="kategoriId" className="block text-sm font-medium text-slate-300">Kategori</label>
          <select name="kategoriId" id="kategoriId" value={formData.kategoriId || ''} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500">
            <option value="" disabled>Bir kategori seçin...</option>
            {categories?.map((cat: CategoryDto) => (
              <option key={cat.id} value={cat.id}>{cat.ad}</option>
            ))}
          </select>
        </div>

        {/* Malzemeler */}
        <div>
            <label htmlFor="malzemeler" className="block text-sm font-medium text-slate-300">Malzemeler (Her birini yeni bir satıra yazın)</label>
            <textarea name="malzemeler" id="malzemeler" value={formData.malzemeler || ''} onChange={handleChange} required rows={6} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
        </div>

        {/* Hazırlanış */}
        <div>
            <label htmlFor="hazirlanis" className="block text-sm font-medium text-slate-300">Hazırlanış (Adımları yeni satırlara yazın)</label>
            <textarea name="hazirlanis" id="hazirlanis" value={formData.hazirlanis || ''} onChange={handleChange} required rows={8} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
        </div>
        
        {/* Submit Butonu */}
        <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-700 focus:outline-none">
                İptal
            </button>
            <button type="submit" disabled={updateMutation.isPending} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-500">
                {updateMutation.isPending ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
        </div>
      </form>
    </div>
  );
}