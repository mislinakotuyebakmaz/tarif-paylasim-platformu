// src/components/RecipeCard.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type RecipeDto } from '../types';

const RecipeCard = ({ recipe }: { recipe: RecipeDto }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Base64 resim kontrolü ve optimizasyonu
  const getImageSrc = () => {
    // Eğer resim yok veya hata aldıysak, Unsplash'den rastgele resim
    if (!recipe.resimUrl || imageError || recipe.resimUrl.trim() === '') {
      return `https://source.unsplash.com/400x300?food,${encodeURIComponent(recipe.baslik || 'food')}`;
    }

    // Base64 resim kontrolü
    if (recipe.resimUrl.startsWith('data:image')) {
      // Base64 resim çok büyükse veya sorunluysa, fallback kullan
      try {
        // Base64 string'in boyutunu kontrol et (yaklaşık)
        const base64Size = recipe.resimUrl.length * 0.75; // Base64 overhead
        if (base64Size > 500000) { // 500KB'dan büyükse
          return `https://source.unsplash.com/400x300?food,${encodeURIComponent(recipe.baslik || 'food')}`;
        }
        return recipe.resimUrl;
      } catch {
        return `https://source.unsplash.com/400x300?food,${encodeURIComponent(recipe.baslik || 'food')}`;
      }
    }

    // Normal URL resim
    return recipe.resimUrl;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Link to={`/recipes/${recipe.id}`} className="block group">
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg 
                    hover:shadow-xl hover:shadow-amber-500/20 
                    transition-all duration-300 transform hover:-translate-y-1">
        
        {/* Tarifin Resmi */}
        <div className="relative w-full h-48 bg-slate-700">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
              <div className="animate-pulse text-slate-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          
          <img 
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            src={getImageSrc()}
            alt={recipe.baslik} 
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy" // Lazy loading ekledik
          />
          
          {/* Eğer resim yüklenemezse placeholder */}
          {imageError && !imageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700 text-slate-400">
              <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Resim yüklenemedi</span>
            </div>
          )}
        </div>
        
        {/* Kartın İçeriği (Başlık ve Yazar) */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-amber-500 transition-colors">
            {recipe.baslik}
          </h3>
          <p className="text-slate-400 text-sm">
            by {recipe.kullaniciAdi || 'Anonim'}
          </p>
          
          {/* Ek bilgiler */}
          <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
            <span>
              {recipe.kategoriAdi || 'Genel'}
            </span>
            {(recipe.hazirlikSuresi || recipe.pisirmeSuresi) && (
              <span>
                ⏱️ {(recipe.hazirlikSuresi || 0) + (recipe.pisirmeSuresi || 0)} dk
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;