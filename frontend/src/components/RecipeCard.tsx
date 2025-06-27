// src/components/RecipeCard.tsx

import { Link } from 'react-router-dom';
import { type RecipeDto } from '../types'; // Kendi tip tanımlarını kullan

// Bu bileşen, 'recipe' adında bir prop (özellik) alır.
// Bu prop'un tipinin RecipeDto olduğunu belirtiyoruz.
const RecipeCard = ({ recipe }: { recipe: RecipeDto }) => {
  return (
    // Link bileşeni ile tüm kartı tıklanabilir hale getiriyoruz.
    // Tıklandığında, kullanıcının o tarifin detay sayfasına gitmesini sağlar.
    <Link to={`/recipes/${recipe.id}`} className="block group">
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg 
                    hover:shadow-xl hover:shadow-amber-500/20 
                    transition-all duration-300 transform hover:-translate-y-1">
        
        {/* Tarifin Resmi */}
        <img 
          className="w-full h-48 object-cover" 
          // Eğer tarifin bir resmi yoksa, rastgele bir yemek resmi gösterir.
          src={recipe.resimUrl || `https://source.unsplash.com/random/400x250?food,${recipe.id}`} 
          alt={recipe.baslik} 
        />
        
        {/* Kartın İçeriği (Başlık ve Yazar) */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-amber-500 transition-colors">
            {recipe.baslik}
          </h3>
          <p className="text-slate-400 text-sm">
            by {recipe.kullaniciAdi || 'Anonim'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;