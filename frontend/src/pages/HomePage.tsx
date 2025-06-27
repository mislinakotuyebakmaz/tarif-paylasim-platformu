// src/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import { type RecipeDto } from '../types'; // Tiplerimizi import ediyoruz
import { recipeService } from '../services/recipeService'; // API servisimizi import ediyoruz
import RecipeCard from '../components/RecipeCard'; // Az önce oluşturduğumuz kart bileşenini import ediyoruz

export default function HomePage() {
  // Bu sayfanın ihtiyaç duyduğu durumları (state) tanımlıyoruz:
  // 1. recipes: API'den gelecek tariflerin listesini tutacak.
  // 2. isLoading: Veri yüklenirken "Yükleniyor..." mesajı göstermek için.
  // 3. error: Bir hata oluşursa hata mesajını tutmak için.
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect, bu bileşen ekrana ilk çizildiğinde sadece bir kez çalışacak.
  useEffect(() => {
    // API'den verileri çeken asenkron bir fonksiyon tanımlıyoruz.
    const fetchRecipes = async () => {
      try {
        setError(null); // Başlarken eski hataları temizle
        setIsLoading(true); // Veri çekme işlemi başladı
        
        // recipeService'i kullanarak API'den tüm tarifleri istiyoruz.
        const data = await recipeService.getAll();
        setRecipes(data); // Gelen veriyi 'recipes' state'ine kaydediyoruz.

      } catch (err) {
        console.error("Tarifler getirilemedi:", err);
        setError("Tarifler yüklenirken bir sorun oluştu.");
      } finally {
        // İşlem başarılı da olsa, hatalı da olsa yükleme durumunu bitiriyoruz.
        setIsLoading(false);
      }
    };

    fetchRecipes(); // Tanımladığımız fonksiyonu çalıştırıyoruz.
  }, []); // Boş dependency array '[]', bu etkinin sadece bir kez çalışmasını sağlar.

  // Eğer hala veri yükleniyorsa, kullanıcıya bir mesaj göster.
  if (isLoading) {
    return <div className="text-center text-white text-xl py-20">Yükleniyor...</div>;
  }

  // Eğer bir hata oluştuysa, kullanıcıya hata mesajını göster.
  if (error) {
    return <div className="text-center text-red-500 text-xl py-20">{error}</div>;
  }

  // Veriler başarıyla yüklendiğinde, ana içeriği göster.
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white mb-10">
        En Lezzetli Tarifler
      </h1>
      
      {/* Tariflerin listeleneceği grid (ızgara) yapısı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* 'recipes' dizisindeki her bir tarif için bir RecipeCard oluşturuyoruz */}
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}