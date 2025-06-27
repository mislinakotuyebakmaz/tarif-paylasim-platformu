using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using RecipeAPI.Models.Entities;
using RecipeAPI.Services.Interfaces;

namespace RecipeAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreateToken(User user)
        {
            // Token'a eklenecek "claim"ler (kullanıcı hakkında bilgiler)
            // Senin modelin 'KullaniciAdi' ve 'Email' kullandığı için bu şekilde olmalı.
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Kullanıcının eşsiz ID'si
                new Claim(ClaimTypes.Name, user.KullaniciAdi),           // Kullanıcının adı (login için)
                new Claim(ClaimTypes.Email, user.Email)                  // Kullanıcının email adresi
            };

            // Güvenlik anahtarını appsettings.json dosyasından alıp byte dizisine çevirme
            // Burası hatanın olduğu yerdi. SymmetricSecurityKey string değil, byte[] bekler.
            // Encoding.UTF8.GetBytes ile bu dönüşümü yapıyoruz.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured")));
            
            // İmzalama kimlik bilgilerini oluşturma (anahtar ve algoritma)
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            // Token'ın tüm özelliklerini tanımlama
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:ExpirationDays"] ?? "7")),
                SigningCredentials = creds,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            // Token'ı oluşturma
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Oluşturulan token'ı string formatında geri döndürme
            return tokenHandler.WriteToken(token);
        }
    }
}