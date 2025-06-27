// src/pages/RecipeDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams, URL'deki :id'yi almak için kullanılır
import { type RecipeDto } from '../types';
import { recipeService } from '../services/recipeService';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
  // useParams hook'u ile URL'den 'id' parametresini yakalıyoruz
  const { id } = useParams<{ id: string }>();

  // State'lerimizi tanımlıyoruz
  const [recipe, setRecipe] = useState<RecipeDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL'den gelen 'id'nin geçerli bir sayı olduğundan emin olalım
    if (!id || isNaN(parseInt(id))) {
      setError("Geçersiz tarif ID'si.");
      setIsLoading(false);
      return;
    }

    const recipeId = parseInt(id);

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // API servisimizden ilgili tarifi ID ile istiyoruz
        const data = await recipeService.getById(recipeId);
        setRecipe(data);
      } catch (err) {
        console.error(`Tarif ${recipeId} getirilemedi:`, err);
        setError("Tarif bulunamadı veya bir hata oluştu.");
        toast.error("Tarif yüklenirken bir sorun oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // useEffect'in 'id' değiştiğinde tekrar çalışmasını sağlıyoruz

  // Yükleme durumu
  if (isLoading) {
    return <div className="text-center text-white py-20">Tarif Yükleniyor...</div>;
  }

  // Hata durumu
  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  // Tarif bulunamadı durumu
  if (!recipe) {
    return <div className="text-center text-white py-20">Tarif bulunamadı.</div>;
  }

  // Tarif başarıyla yüklendiğinde gösterilecek JSX
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8">
        
        {/* Tarif Başlığı ve Yazar Bilgisi */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{recipe.baslik}</h1>
        <p className="text-slate-400 mb-6">
          <Link to={`/profile/${recipe.kullaniciId}`} className="hover:text-amber-500">
            {recipe.kullaniciAdi || 'Anonim'}
          </Link> 
          tarafından eklendi.
        </p>

        {/* Tarif Resmi */}
        <img 
          src={recipe.resimUrl || 'https://source.unsplash.com/random/800x400?food'} 
          alt={recipe.baslik}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />

        {/* Tarif Detayları (Süre, Porsiyon, Zorluk) */}
        <div className="flex flex-wrap gap-4 mb-8 text-center">
          <div className="bg-slate-700 p-3 rounded-lg flex-1">
            <p className="text-slate-400 text-sm">Hazırlık</p>
            <p className="text-white font-bold">{recipe.hazirlikSuresi || '-'} dk</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex-1">
            <p className="text-slate-400 text-sm">Pişirme</p>
            <p className="text-white font-bold">{recipe.pisirmeSuresi || '-'} dk</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex-1">
            <p className="text-slate-400 text-sm">Porsiyon</p>
            <p className="text-white font-bold">{recipe.porsiyon || '-'}</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex-1">
            <p className="text-slate-400 text-sm">Zorluk</p>
            <p className="text-white font-bold">{recipe.zorlukDerecesi || '-'}</p>
          </div>
        </div>

        {/* Malzemeler ve Hazırlanış */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Malzemeler</h2>
            <p className="text-slate-300 whitespace-pre-line">{recipe.malzemeler}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Hazırlanış</h2>
            <p className="text-slate-300 whitespace-pre-line">{recipe.hazirlanis}</p>
          </div>
        </div>
        
        {/* Yorumlar ve Puanlama Bölümü buraya eklenebilir */}

      </div>
    </div>
  );
}