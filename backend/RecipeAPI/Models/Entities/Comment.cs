using System;

namespace RecipeAPI.Models.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Yorum { get; set; }
        public DateTime YorumTarihi { get; set; }
        
        // Foreign Keys
        public int KullaniciId { get; set; }
        public int TarifId { get; set; }
        
        // Navigation Properties
        public virtual User Kullanici { get; set; }
        public virtual Recipe Tarif { get; set; }
    }
}