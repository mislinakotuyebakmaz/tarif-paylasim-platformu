using System.ComponentModel.DataAnnotations;

namespace RecipeAPI.Models.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Kullanıcı adı zorunludur")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Kullanıcı adı 3-50 karakter arasında olmalıdır")]
        public string KullaniciAdi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şifre zorunludur")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
        public string Sifre { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ad Soyad zorunludur")]
        public string AdSoyad { get; set; } = string.Empty;
    }

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
        public DateTime KayitTarihi { get; set; }
        public int TarifSayisi { get; set; }
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiration { get; set; }
        public UserDto User { get; set; } = null!;
    }
}