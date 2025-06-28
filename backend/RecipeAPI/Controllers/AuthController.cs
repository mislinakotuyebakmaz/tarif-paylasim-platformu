using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecipeAPI.Data;
using RecipeAPI.Models.DTOs;
using RecipeAPI.Models.Entities;
using RecipeAPI.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        private readonly IPasswordService _passwordService;
        private readonly IConfiguration _configuration;

        public AuthController(
            RecipeDbContext context,
            IPasswordService passwordService,
            IConfiguration configuration)
        {
            _context = context;
            _passwordService = passwordService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                // Email veya kullanıcı adı zaten var mı kontrol et
                var existingUser = await _context.Kullanicilar
                    .AnyAsync(u => u.Email == registerDto.Email || u.KullaniciAdi == registerDto.KullaniciAdi);

                if (existingUser)
                {
                    return BadRequest(new { message = "Bu email veya kullanıcı adı zaten kullanılıyor." });
                }

                // Şifreyi hash'le
                var hashedPassword = _passwordService.HashPassword(registerDto.Sifre);

                // Yeni kullanıcı oluştur
                var user = new User
                {
                    KullaniciAdi = registerDto.KullaniciAdi,
                    Email = registerDto.Email,
                    AdSoyad = registerDto.AdSoyad,
                    Sifre = hashedPassword,
                    KayitTarihi = DateTime.UtcNow
                };

                _context.Kullanicilar.Add(user);
                await _context.SaveChangesAsync();

                // JWT token oluştur
                var token = GenerateJwtToken(user);

                // User DTO oluştur (güvenlik için şifre dahil edilmez)
                var userDto = new UserDto
                {
                    Id = user.Id,
                    KullaniciAdi = user.KullaniciAdi,
                    Email = user.Email,
                    AdSoyad = user.AdSoyad,
                    KayitTarihi = user.KayitTarihi.ToString("yyyy-MM-dd"),
                    TarifSayisi = 0
                };

                var response = new LoginResponseDto
                {
                    Token = token,
                    TokenExpiration = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd HH:mm:ss"),
                    User = userDto
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kayıt işlemi sırasında bir hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                // Kullanıcıyı email veya kullanıcı adı ile bul
                var user = await _context.Kullanicilar
                    .FirstOrDefaultAsync(u => u.Email == loginDto.KullaniciAdiVeyaEmail || 
                                            u.KullaniciAdi == loginDto.KullaniciAdiVeyaEmail);

                if (user == null)
                {
                    return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre." });
                }

                // Şifreyi doğrula
                var isPasswordValid = _passwordService.VerifyPassword(loginDto.Sifre, user.Sifre);
                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre." });
                }

                // JWT token oluştur
                var token = GenerateJwtToken(user);

                // Kullanıcının tarif sayısını hesapla
                var tarifSayisi = await _context.Tarifler
                    .CountAsync(t => t.KullaniciId == user.Id && t.AktifMi == true);

                // User DTO oluştur
                var userDto = new UserDto
                {
                    Id = user.Id,
                    KullaniciAdi = user.KullaniciAdi,
                    Email = user.Email,
                    AdSoyad = user.AdSoyad,
                    KayitTarihi = user.KayitTarihi.ToString("yyyy-MM-dd"),
                    TarifSayisi = tarifSayisi
                };

                var response = new LoginResponseDto
                {
                    Token = token,
                    TokenExpiration = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd HH:mm:ss"),
                    User = userDto
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Giriş işlemi sırasında bir hata oluştu.", error = ex.Message });
            }
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var user = await _context.Kullanicilar.FindAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı." });
                }

                // Mevcut şifreyi doğrula
                var isCurrentPasswordValid = _passwordService.VerifyPassword(
                    changePasswordDto.CurrentPassword, 
                    user.Sifre);

                if (!isCurrentPasswordValid)
                {
                    return BadRequest(new { message = "Mevcut şifre hatalı." });
                }

                // Yeni şifreyi hash'le ve kaydet
                user.Sifre = _passwordService.HashPassword(changePasswordDto.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Şifre başarıyla değiştirildi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Şifre değiştirme sırasında hata oluştu.", error = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKeyForRecipeApp123456789";
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.KullaniciAdi),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    // DTO for password change
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}