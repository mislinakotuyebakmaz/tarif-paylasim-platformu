// src/pages/CreateRecipePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';

interface RecipeFormData {
  baslik: string;
  aciklama: string;
  malzemeler: string;
  hazirlanis: string;
  hazirlikSuresi?: number;
  pisirmeSuresi?: number;
  porsiyon?: string;
  zorlukDerecesi?: string;
  kategoriId: number;
  resimUrl?: string;
}

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<RecipeFormData>({
    baslik: '',
    aciklama: '',
    malzemeler: '',
    hazirlanis: '',
    hazirlikSuresi: 0,
    pisirmeSuresi: 0,
    porsiyon: '1',
    zorlukDerecesi: 'Kolay',
    kategoriId: 1,
    resimUrl: ''
  });

  // Kategorileri çek
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  // Tarif oluşturma mutation
  const createMutation = useMutation({
    mutationFn: (data: RecipeFormData) => recipeService.create(data),
    onSuccess: (data) => {
      toast.success('Tarif başarıyla oluşturuldu!');
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['latestRecipes'] });
      navigate(`/recipes/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Tarif oluşturulurken bir hata oluştu.');
    },
  });

  // Form input değişikliklerini handle et
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sayısal alanlar için
    if (['hazirlikSuresi', 'pisirmeSuresi', 'kategoriId'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basit validasyon
    if (!formData.baslik.trim() || !formData.malzemeler.trim() || !formData.hazirlanis.trim()) {
      toast.error('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="bg-slate-900 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Yeni Tarif Ekle</h1>
        
        <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Başlık */}
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">Tarif Başlığı *</label>
              <input
                type="text"
                name="baslik"
                value={formData.baslik}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                placeholder="Örn: Enfes Mantı Tarifi"
                required
              />
            </div>

            {/* Açıklama */}
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">Açıklama</label>
              <textarea
                name="aciklama"
                value={formData.aciklama}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                placeholder="Tarif hakkında kısa açıklama..."
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-white font-semibold mb-2">Kategori</label>
              <select
                name="kategoriId"
                value={formData.kategoriId}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.ad}
                  </option>
                ))}
              </select>
            </div>

            {/* Zorluk Derecesi */}
            <div>
              <label className="block text-white font-semibold mb-2">Zorluk Derecesi</label>
              <select
                name="zorlukDerecesi"
                value={formData.zorlukDerecesi}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
              >
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>

            {/* Hazırlık Süresi */}
            <div>
              <label className="block text-white font-semibold mb-2">Hazırlık Süresi (dakika)</label>
              <input
                type="number"
                name="hazirlikSuresi"
                value={formData.hazirlikSuresi}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                min="0"
              />
            </div>

            {/* Pişirme Süresi */}
            <div>
              <label className="block text-white font-semibold mb-2">Pişirme Süresi (dakika)</label>
              <input
                type="number"
                name="pisirmeSuresi"
                value={formData.pisirmeSuresi}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                min="0"
              />
            </div>

            {/* Porsiyon */}
            <div>
              <label className="block text-white font-semibold mb-2">Porsiyon</label>
              <input
                type="text"
                name="porsiyon"
                value={formData.porsiyon}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                placeholder="Örn: 4 kişi"
              />
            </div>

            {/* Resim URL */}
            <div>
              <label className="block text-white font-semibold mb-2">Resim URL (opsiyonel)</label>
              <input
                type="url"
                name="resimUrl"
                value={formData.resimUrl}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Malzemeler */}
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">Malzemeler *</label>
              <textarea
                name="malzemeler"
                value={formData.malzemeler}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                placeholder="Her malzemeyi yeni satıra yazın...&#10;Örn:&#10;500g kıyma&#10;2 adet soğan&#10;1 çay kaşığı tuz"
                required
              />
            </div>

            {/* Hazırlanış */}
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">Hazırlanış Adımları *</label>
              <textarea
                name="hazirlanis"
                value={formData.hazirlanis}
                onChange={handleInputChange}
                rows={8}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none"
                placeholder="Hazırlanış adımlarını detaylı olarak yazın...&#10;&#10;Örn:&#10;1. Soğanları doğrayın&#10;2. Tavada kavurun&#10;3. Kıymayı ekleyin..."
                required
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Tarif Oluşturuluyor...' : 'Tarifi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}