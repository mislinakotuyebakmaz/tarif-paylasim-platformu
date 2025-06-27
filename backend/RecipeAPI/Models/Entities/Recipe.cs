namespace RecipeAPI.Models.Entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Baslik { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        public string Hazirlanis { get; set; } = string.Empty;
        public string Malzemeler { get; set; } = string.Empty;
        public int? HazirlikSuresi { get; set; }
        public int? PisirmeSuresi { get; set; }
        public string Porsiyon { get; set; } = string.Empty;
        public string ZorlukDerecesi { get; set; } = string.Empty;
        public string ResimUrl { get; set; } = string.Empty;
        public bool AktifMi { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
        public DateTime? GuncellemeTarihi { get; set; }
        public int KategoriId { get; set; }
        public int KullaniciId { get; set; }
        public virtual Category Kategori { get; set; } = null!;
        public virtual User Kullanici { get; set; } = null!;
        public virtual ICollection<RecipeIngredient> TarifMalzemeler { get; set; } = new List<RecipeIngredient>();
        public virtual ICollection<RecipeImage> TarifResimleri { get; set; } = new List<RecipeImage>();
        public virtual ICollection<Comment> Yorumlar { get; set; } = new List<Comment>();
        public virtual ICollection<Rating> Puanlamalar { get; set; } = new List<Rating>();
        public virtual ICollection<Favorite> Favoriler { get; set; } = new List<Favorite>();
    }
}