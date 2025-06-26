using System;

namespace RecipeAPI.Models.Entities
{
    public class Rating
    {
        public int Id { get; set; }
        public int Puan { get; set; } // 1-5 arası
        public DateTime DegerlendirmeTarihi { get; set; }
        
        // Foreign Keys
        public int KullaniciId { get; set; }
        public int TarifId { get; set; }
        
        // Navigation Properties
        public virtual User Kullanici { get; set; }
        public virtual Recipe Tarif { get; set; }
    }
}