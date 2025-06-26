using System;
using System.Collections.Generic;

namespace RecipeAPI.Models.Entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
        public string Aciklama { get; set; }
        public string Talimatlar { get; set; }
        public int HazirlamaSuresi { get; set; }
        public int PisirmeSuresi { get; set; }
        public int KacKisilik { get; set; }
        public string ZorlukSeviyesi { get; set; }
        public DateTime EklenmeTarihi { get; set; }
        public DateTime? GuncellenmeTarihi { get; set; }
        
        // Foreign Keys
        public int KullaniciId { get; set; }
        public int KategoriId { get; set; }
        
        // Navigation Properties
        public virtual User Kullanici { get; set; }
        public virtual Category Kategori { get; set; }
        public virtual ICollection<RecipeIngredient> TarifMalzemeler { get; set; }
        public virtual ICollection<RecipeImage> Resimler { get; set; }
        public virtual ICollection<Comment> Yorumlar { get; set; }
        public virtual ICollection<Rating> Degerlendirmeler { get; set; }
    }
}