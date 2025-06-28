using System.ComponentModel.DataAnnotations;

namespace RecipeAPI.Models.DTOs
{
    
    public class LoginDto
    {
        [Required(ErrorMessage = "Kullanıcı adı veya email zorunludur")]
        public string KullaniciAdiVeyaEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şifre zorunludur")]
        public string Sifre { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string KullaniciAdi { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AdSoyad { get; set; } = string.Empty;
        public string KayitTarihi { get; set; } = string.Empty; // DateTime → string DEĞİŞTİ
        public int TarifSayisi { get; set; }
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string TokenExpiration { get; set; } = string.Empty; // DateTime → string DEĞİŞTİ
        public UserDto User { get; set; } = null!;
    }
}