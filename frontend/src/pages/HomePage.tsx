// src/pages/HomePage.tsx

import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';

export default function HomePage() {
  // React Query ile en son eklenen 4 tarifi çekelim (backend desteği varsayılıyor)
  // Şimdilik normal getAll() ile ilk 4'ünü alacağız.
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['latestRecipes'],
    queryFn: async () => {
      const allRecipes = await recipeService.getAll();
      return allRecipes.slice(0, 4); // Sadece ilk 4 tarifi al
    },
  });

  return (
    <>
      {/* Hero (Karşılama) Bölümü */}
      <div className="text-center py-20 px-4 bg-slate-800 rounded-lg my-8">
        <h1 className="text-5xl font-extrabold text-white">Tarif Defteri'ne Hoş Geldiniz</h1>
        <p className="text-xl text-slate-300 mt-4 max-w-2xl mx-auto">
          Binlerce lezzetli tarifi keşfedin, kendi tariflerinizi paylaşın ve mutfaktaki yeteneğinizi gösterin.
        </p>
        <div className="mt-8">
          <Link 
            to="/recipes" 
            className="bg-amber-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-amber-400 transition-transform transform hover:scale-105"
          >
            Tüm Tarifleri Keşfet
          </Link>
        </div>
      </div>

      {/* En Yeni Tarifler Bölümü */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-10">En Yeni Tarifler</h2>
        {isLoading ? (
          <p className="text-center text-white">Tarifler yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recipes?.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}