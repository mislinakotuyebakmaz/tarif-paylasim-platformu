namespace RecipeAPI.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string KullaniciAdi { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Sifre { get; set; } = string.Empty;
        public string AdSoyad { get; set; } = string.Empty;
        public DateTime KayitTarihi { get; set; }
        public bool AktifMi { get; set; }
        public virtual ICollection<Recipe> Tarifler { get; set; } = new List<Recipe>();
        public virtual ICollection<Comment> Yorumlar { get; set; } = new List<Comment>();
        public virtual ICollection<Rating> Puanlamalar { get; set; } = new List<Rating>();
        public virtual ICollection<Favorite> Favoriler { get; set; } = new List<Favorite>();
    }
}