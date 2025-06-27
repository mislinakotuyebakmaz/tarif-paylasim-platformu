import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Users, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 
text-white rounded-lg p-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Tarif Paylaşım Platformuna Hoş Geldiniz
          </h1>
          <p className="text-xl mb-8">
            En lezzetli tarifleri keşfedin, kendi tariflerinizi paylaşın
          </p>
          <div className="space-x-4">
            <Link
              to="/recipes"
              className="bg-white text-orange-500 px-6 py-3 rounded-md 
font-medium hover:bg-gray-100 inline-block"
            >
              Tarifleri Keşfet
            </Link>
            <Link
              to="/register"
              className="bg-orange-600 text-white px-6 py-3 rounded-md 
font-medium hover:bg-orange-700 inline-block"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <BookOpen className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Binlerce Tarif</h3>
          <p className="text-gray-600">
            Kahvaltıdan akşam yemeğine, tatlıdan tuzluya binlerce tarife 
ulaşın
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aktif Topluluk</h3>
          <p className="text-gray-600">
            Yemek tutkunlarıyla tanışın, deneyimlerinizi paylaşın
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Puanlama Sistemi</h3>
          <p className="text-gray-600">
            En beğenilen tarifleri keşfedin, kendi tariflerinizi 
değerlendirin
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <ChefHat className="h-16 w-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          Mutfağınızdan Çıkan Lezzetleri Paylaşın
        </h2>
        <p className="text-gray-600 mb-6">
          Ücretsiz üye olun ve kendi tariflerinizi binlerce kişiyle 
paylaşın
        </p>
        <Link
          to="/register"
          className="bg-orange-500 text-white px-8 py-3 rounded-md 
font-medium hover:bg-orange-600 inline-block"
        >
          Ücretsiz Üye Ol
        </Link>
      </section>
    </div>
  );
}
