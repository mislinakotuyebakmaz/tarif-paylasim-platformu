// src/pages/RecipeDetailPage.tsx - TAM VE MODERN HALİ

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = parseInt(id || '0');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => recipeService.getById(recipeId),
    enabled: !!recipeId,
  });

  const deleteMutation = useMutation({
    mutationFn: recipeService.delete,
    onSuccess: () => {
      toast.success('Tarif başarıyla silindi!');
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      navigate('/');
    },
    onError: () => toast.error('Tarif silinirken bir hata oluştu.'),
  });

  const handleDelete = () => {
    if (window.confirm('Bu tarifi silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(recipeId);
    }
  };

  if (isLoading) return <div className="text-center text-white text-xl py-20">Tarif Yükleniyor...</div>;
  if (isError) return <div className="text-center text-red-500 text-xl py-20">Tarif yüklenirken bir hata oluştu.</div>;
  if (!recipe) return <div className="text-center text-white text-xl py-20">Tarif bulunamadı.</div>;

  const isOwner = isAuthenticated && user?.id === recipe.kullaniciId;

  return (
    <div className="bg-slate-900 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <img src={recipe.resimUrl || `https://source.unsplash.com/random/1200x600?food,${recipe.id}`} alt={recipe.baslik} className="w-full h-64 md:h-96 object-cover"/>
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex-grow">
                <span className="text-amber-500 font-semibold uppercase tracking-wider">{recipe.kategoriAdi || 'Genel'}</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">{recipe.baslik}</h1>
                <p className="text-slate-400 mt-2">by <Link to={`/profile/${recipe.kullaniciId}`} className="hover:text-amber-400 font-semibold">{recipe.kullaniciAdi || 'Anonim'}</Link></p>
              </div>
              {isOwner && (
                <div className="flex space-x-2 flex-shrink-0 mt-2">
                  <Link to={`/recipes/edit/${recipe.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Düzenle</Link>
                  <button onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:bg-slate-500">
                    {deleteMutation.isPending ? 'Siliniyor...': 'Sil'}
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 p-4 bg-slate-900/50 rounded-lg">
              <div className="text-center"><p className="text-slate-400 text-sm">Hazırlık</p><p className="text-white text-xl font-bold">{recipe.hazirlikSuresi || '-'} dk</p></div>
              <div className="text-center"><p className="text-slate-400 text-sm">Pişirme</p><p className="text-white text-xl font-bold">{recipe.pisirmeSuresi || '-'} dk</p></div>
              <div className="text-center"><p className="text-slate-400 text-sm">Porsiyon</p><p className="text-white text-xl font-bold">{recipe.porsiyon || '-'}</p></div>
              <div className="text-center"><p className="text-slate-400 text-sm">Zorluk</p><p className="text-white text-xl font-bold">{recipe.zorlukDerecesi || '-'}</p></div>
            </div>
            <hr className="my-8 border-slate-700" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <h2 className="text-3xl font-bold text-amber-500 mb-6">Malzemeler</h2>
                <div className="text-slate-300 whitespace-pre-line leading-loose">{recipe.malzemeler}</div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-amber-500 mb-6">Hazırlanış Adımları</h2>
                <div className="prose prose-invert max-w-none text-slate-300 leading-loose"><p className="whitespace-pre-line">{recipe.hazirlanis}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}