import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import toast from 'react-hot-toast';

export default function CreateRecipePage() {
  const [baslik, setBaslik] = useState('');
  // ... Diğer tüm form alanları için useState hook'ları ...
  const [kategoriId, setKategoriId] = useState(1); // Şimdilik varsayılan
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newRecipeData = { baslik, kategoriId /*, ...diğer alanlar */ };
      const createdRecipe = await recipeService.create(newRecipeData);
      toast.success('Tarif başarıyla eklendi!');
      navigate(`/recipes/${createdRecipe.id}`); // Oluşturulan tarifin detay sayfasına git
    } catch (error) {
      toast.error('Tarif eklenirken bir hata oluştu.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Yeni Tarif Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/*
          Buraya <input>, <textarea>, <select> gibi form elemanları gelecek.
          Her biri kendi state'ine bağlanacak.
          Örnek:
          <div>
            <label htmlFor="baslik" className="block text-sm font-medium text-slate-300">Başlık</label>
            <input type="text" id="baslik" value={baslik} onChange={(e) => setBaslik(e.target.value)} required className="...stil..." />
          </div>
        */}
        <button type="submit" disabled={isLoading} className="...stil...">
          {isLoading ? 'Ekleniyor...' : 'Tarifi Ekle'}
        </button>
      </form>
    </div>
  );
}