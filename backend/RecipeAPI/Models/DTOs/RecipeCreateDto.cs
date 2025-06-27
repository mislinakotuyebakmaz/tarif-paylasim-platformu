using System.ComponentModel.DataAnnotations;
namespace RecipeAPI.Models.DTOs
{
    public class RecipeCreateDto
    {
        
        [Required(ErrorMessage = "Başlık alanı zorunludur.")] // Boş olamaz
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Başlık en az 3, en fazla 100 karakter olmalıdır.")] // Uzunluk kısıtı
        
        public string Baslik { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Açıklama alanı zorunludur.")]
        public string Aciklama { get; set; } = string.Empty;
       
        [Required(ErrorMessage = "Hazırlanış alanı zorunludur.")]
        public string Hazirlanis { get; set; } = string.Empty;

        [Required(ErrorMessage = "Malzemeler alanı zorunludur.")]
        public string Malzemeler { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir kategori seçmelisiniz.")] // 0'dan büyük olmalı
        public int KategoriId { get; set; }

        // Bu alanlar zorunlu olmadığı için etiket eklemiyoruz (nullable oldukları için)
        public int? HazirlikSuresi { get; set; }
        public int? PisirmeSuresi { get; set; }
        public string Porsiyon { get; set; } = string.Empty;
        public string ZorlukDerecesi { get; set; } = string.Empty;
        public string? ResimUrl { get; set; }
    }
}