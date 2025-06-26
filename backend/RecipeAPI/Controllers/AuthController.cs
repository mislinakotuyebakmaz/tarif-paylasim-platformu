using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeAPI.Data;
using RecipeAPI.Helpers;
using RecipeAPI.Models.DTOs;
using RecipeAPI.Models.Entities;
using RecipeAPI.Services.Interfaces;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(RecipeDbContext context, ITokenService tokenService, ILogger<AuthController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDto>> Register(RegisterDto registerDto)
        {
            // Kullanıcı adı kontrolü
            if (await _context.Kullanicilar.AnyAsync(u => u.KullaniciAdi == registerDto.KullaniciAdi))
            {
                return BadRequest("Bu kullanıcı adı zaten kullanımda");
            }

            // Email kontrolü
            if (await _context.Kullanicilar.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Bu email adresi zaten kayıtlı");
            }

            var user = new User
            {
                KullaniciAdi = registerDto.KullaniciAdi,
                Email = registerDto.Email,
                Sifre = PasswordHelper.HashPassword(registerDto.Sifre),
                AdSoyad = registerDto.AdSoyad,
                KayitTarihi = DateTime.UtcNow,
                AktifMi = true
            };

            _context.Kullanicilar.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Yeni kullanıcı kaydı oluşturuldu: {user.KullaniciAdi}");

            var token = _tokenService.CreateToken(user);
            
            return Ok(new LoginResponseDto
            {
                Token = token,
                TokenExpiration = DateTime.UtcNow.AddDays(7),
                User = new UserDto
                {
                    Id = user.Id,
                    KullaniciAdi = user.KullaniciAdi,
                    Email = user.Email,
                    AdSoyad = user.AdSoyad,
                    KayitTarihi = user.KayitTarihi,
                    TarifSayisi = 0
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Kullanicilar
                .FirstOrDefaultAsync(u => u.KullaniciAdi == loginDto.KullaniciAdiVeyaEmail || 
                                         u.Email == loginDto.KullaniciAdiVeyaEmail);

            if (user == null || !PasswordHelper.VerifyPassword(loginDto.Sifre, user.Sifre))
            {
                return Unauthorized("Kullanıcı adı/email veya şifre hatalı");
            }

            if (!user.AktifMi)
            {
                return Unauthorized("Hesabınız aktif değil");
            }

            _logger.LogInformation($"Kullanıcı giriş yaptı: {user.KullaniciAdi}");

            var token = _tokenService.CreateToken(user);
            var tarifSayisi = await _context.Tarifler.CountAsync(t => t.KullaniciId == user.Id);

            return Ok(new LoginResponseDto
            {
                Token = token,
                TokenExpiration = DateTime.UtcNow.AddDays(7),
                User = new UserDto
                {
                    Id = user.Id,
                    KullaniciAdi = user.KullaniciAdi,
                    Email = user.Email,
                    AdSoyad = user.AdSoyad,
                    KayitTarihi = user.KayitTarihi,
                    TarifSayisi = tarifSayisi
                }
            });
        }
    }
}