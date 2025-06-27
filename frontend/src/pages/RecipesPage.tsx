// src/pages/RecipesPage.tsx

import { useEffect, useState } from 'react';
import { type RecipeDto } from '../types'; // Kendi tip tanımlarını kullan
import { recipeService } from '../services/recipeService'; // Tarif servisini kullan
import RecipeCard from '../components/RecipeCard'; // Daha önce oluşturduğumuz kart bileşeni

export default function RecipesPage() {
  // State'ler: tarif listesi, yükleme durumu ve hata durumu için
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component ilk yüklendiğinde tarifleri çekmek için useEffect kullanıyoruz
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true); // Yüklemeyi başlat
        setError(null); // Eski hataları temizle
        
        // recipeService üzerinden API'ye istek atıyoruz
        const data = await recipeService.getAll();
        setRecipes(data);

      } catch (err) {
        console.error("Tarifler getirilemedi:", err);
        setError("Tarifler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setIsLoading(false); // Yüklemeyi bitir (başarılı ya da hatalı)
      }
    };

    fetchRecipes();
  }, []); // Boş dependency array '[]' bu etkinin sadece bir kez çalışmasını sağlar

  // Yükleme sırasında kullanıcıya geri bildirim göster
  if (isLoading) {
    return <div className="text-center text-white text-xl py-20">Yükleniyor...</div>;
  }

  // Hata durumunda kullanıcıya geri bildirim göster
  if (error) {
    return <div className="text-center text-red-500 text-xl py-20">{error}</div>;
  }

  // Veriler başarıyla yüklendiğinde tarifleri göster
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white mb-10">
        Tüm Lezzetli Tarifler
      </h1>
      
      {/* Tariflerin listeleneceği grid (ızgara) yapısı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}