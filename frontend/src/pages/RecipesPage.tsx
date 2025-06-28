// src/pages/RecipesPage.tsx
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';

export default function RecipesPage() {
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['allRecipes'], // Anasayfadan farklı bir key kullandık
    queryFn: recipeService.getAll,
  });

  if (isLoading) return <p className="text-center text-white py-20">Tarifler Yükleniyor...</p>;
  if (isError) return <p className="text-center text-red-500 py-20">Tarifler yüklenirken bir hata oluştu.</p>;

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center text-white mb-10">Tüm Tarifler</h1>
      
      {recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        // Eğer hiç tarif yoksa bu bölüm gösterilecek
        <div className="text-center py-20 bg-slate-800 rounded-lg">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-2xl font-bold text-white">Henüz Hiç Tarif Paylaşılmamış</h2>
          <p className="text-slate-400 mt-2 mb-6">Topluluğumuza katkıda bulunan ilk kişi sen ol!</p>
          <Link to="/create-recipe" className="bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-400 transition-colors">
            İlk Tarifi Sen Ekle
          </Link>
        </div>
      )}
    </div>
  );
}