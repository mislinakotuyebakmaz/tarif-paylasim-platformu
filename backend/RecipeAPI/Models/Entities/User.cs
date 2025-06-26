using System;
using System.Collections.Generic;

namespace RecipeAPI.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string KullaniciAdi { get; set; }
        public string Email { get; set; }
        public string Sifre { get; set; }
        public string AdSoyad { get; set; }
        public DateTime KayitTarihi { get; set; }
        public bool AktifMi { get; set; }
        
        // İlişkiler
        public virtual ICollection<Recipe> Tarifler { get; set; }
        public virtual ICollection<Comment> Yorumlar { get; set; }
        public virtual ICollection<Rating> Degerlendirmeler { get; set; }
    }
}