using System.ComponentModel.DataAnnotations;

namespace RecipeAPI.Models.DTOs
{
    public class CreateRecipeDto
    {
        [Required(ErrorMessage = "Tarif başlığı zorunludur")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Başlık 3-200 karakter arasında olmalıdır")]
        public string Baslik { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur")]
        [StringLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir")]
        public string Aciklama { get; set; } = string.Empty;

        [Required(ErrorMessage = "Malzemeler zorunludur")]
        public string Malzemeler { get; set; } = string.Empty;

        [Required(ErrorMessage = "Hazırlanış zorunludur")]
        public string Hazirlanis { get; set; } = string.Empty;

        [Required(ErrorMessage = "Pişirme süresi zorunludur")]
        [Range(1, 1440, ErrorMessage = "Pişirme süresi 1-1440 dakika arasında olmalıdır")]
        public int PisirmeSuresi { get; set; }

        [Required(ErrorMessage = "Hazırlık süresi zorunludur")]
        [Range(1, 1440, ErrorMessage = "Hazırlık süresi 1-1440 dakika arasında olmalıdır")]
        public int HazirlikSuresi { get; set; }

        [Required(ErrorMessage = "Porsiyon sayısı zorunludur")]
        [Range(1, 50, ErrorMessage = "Porsiyon sayısı 1-50 arasında olmalıdır")]
        public int Porsiyon { get; set; }

        [Required(ErrorMessage = "Zorluk derecesi zorunludur")]
        [Range(1, 5, ErrorMessage = "Zorluk derecesi 1-5 arasında olmalıdır")]
        public int ZorlukDerecesi { get; set; }

        [Required(ErrorMessage = "Kategori ID zorunludur")]
        public int KategoriId { get; set; }

        public string? ResimUrl { get; set; }
    }

    public class UpdateRecipeDto : CreateRecipeDto
    {
        public int Id { get; set; }
    }

    public class RecipeDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        public string Malzemeler { get; set; } = string.Empty;
        public string Hazirlanis { get; set; } = string.Empty;
        public int PisirmeSuresi { get; set; }
        public int HazirlikSuresi { get; set; }
        public int Porsiyon { get; set; }
        public int ZorlukDerecesi { get; set; }
        public string? ResimUrl { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
        public DateTime? GuncellemeTarihi { get; set; }
        public bool AktifMi { get; set; }
        
        // İlişkili veriler
        public int KategoriId { get; set; }
        public string KategoriAdi { get; set; } = string.Empty;
        public int KullaniciId { get; set; }
        public string KullaniciAdi { get; set; } = string.Empty;
        public string KullaniciAdSoyad { get; set; } = string.Empty;
        
        // İstatistikler
        public int YorumSayisi { get; set; }
        public double OrtalamaPuan { get; set; }
        public int FavoriSayisi { get; set; }
    }

    public class RecipeListDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        public string? ResimUrl { get; set; }
        public int PisirmeSuresi { get; set; }
        public int HazirlikSuresi { get; set; }
        public int ZorlukDerecesi { get; set; }
        public string KategoriAdi { get; set; } = string.Empty;
        public string KullaniciAdi { get; set; } = string.Empty;
        public DateTime OlusturmaTarihi { get; set; }
        public double OrtalamaPuan { get; set; }
        public int YorumSayisi { get; set; }
    }

    public class RecipeSearchDto
    {
        public string? AramaMetni { get; set; }
        public int? KategoriId { get; set; }
        public int? MinPisirmeSuresi { get; set; }
        public int? MaxPisirmeSuresi { get; set; }
        public int? ZorlukDerecesi { get; set; }
        public int? KullaniciId { get; set; }
        public bool? SadeceFavorilerim { get; set; }
        public string SiralamaKriteri { get; set; } = "Tarih"; // Tarih, Puan, YorumSayisi
        public bool AzalanSiralama { get; set; } = true;
        public int Sayfa { get; set; } = 1;
        public int SayfaBoyutu { get; set; } = 12;
    }
}