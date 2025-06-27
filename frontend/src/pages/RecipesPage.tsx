import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import type { RecipeDto } from '../types';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecipesPage() {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: recipeService.getAll
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Tarifler yüklenirken bir hata oluştu.
      </div>
    );
  }

  const activeRecipes = recipes?.filter(r => r.aktifMi) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tüm Tarifler</h1>
        <p className="text-gray-600">
          Topluluğumuz tarafından paylaşılan {activeRecipes.length} adet lezzetli tarif
        </p>
      </div>

      {activeRecipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Henüz hiç tarif paylaşılmamış.</p>
          <Link 
            to="/recipes/create" 
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          >
            İlk Tarifi Sen Ekle!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {recipe.resimUrl ? (
                <img 
                  src={recipe.resimUrl} 
                  alt={recipe.baslik}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {recipe.baslik}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.aciklama}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {(recipe.hazirlikSuresi || 0) + (recipe.pisirmeSuresi || 0)} dk
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{recipe.porsiyon || '4'} kişilik</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {recipe.kullaniciAdi || 'Anonim'}
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    {recipe.kategoriAdi || 'Diğer'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}