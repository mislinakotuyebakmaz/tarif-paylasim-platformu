// --- Controllers/RecipesController.cs - DOĞRU VE TEMİZ HALİ ---

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeAPI.Data;
using RecipeAPI.Models.DTOs;
using RecipeAPI.Models.Entities;
using System.Security.Claims;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        // private readonly ILogger<RecipesController> _logger; // Loglama için bunu ekleyebilirsin

        public RecipesController(RecipeDbContext context/*, ILogger<RecipesController> logger*/)
        {
            _context = context;
            // _logger = logger;
        }

        // --- GET: Tüm tarifleri veya filtrelenmiş tarifleri getir ---
        [HttpGet]
        public async Task<IActionResult> GetRecipes([FromQuery] string? zorluk, [FromQuery] int? kategoriId)
        {
            var query = _context.Tarifler.AsQueryable();

            if (!string.IsNullOrEmpty(zorluk))
            {
                query = query.Where(r => r.ZorlukDerecesi == zorluk);
            }
            
            if (kategoriId.HasValue)
            {
                query = query.Where(r => r.KategoriId == kategoriId.Value);
            }

            var recipes = await query
                .Include(r => r.Kullanici) // Kullanıcı bilgilerini de getirelim
                .Select(r => new { // DTO'ya dönüştürerek sadece istediğimiz veriyi gönderelim
                    r.Id,
                    r.Baslik,
                    r.Aciklama,
                    KullaniciAdi = r.Kullanici.KullaniciAdi,
                    r.OlusturmaTarihi
                })
                .ToListAsync();
                
            return Ok(recipes);
        }
        
        // --- POST: Yeni bir tarif oluştur ---
        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> CreateRecipe(RecipeCreateDto recipeDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var recipe = new Recipe
            {
                Baslik = recipeDto.Baslik,
                Aciklama = recipeDto.Aciklama,
                Hazirlanis = recipeDto.Hazirlanis,
                Malzemeler = recipeDto.Malzemeler,
                KategoriId = recipeDto.KategoriId,
                KullaniciId = userId,
                OlusturmaTarihi = DateTime.UtcNow,
                AktifMi = true,
                HazirlikSuresi = recipeDto.HazirlikSuresi,
                PisirmeSuresi = recipeDto.PisirmeSuresi,
                Porsiyon = recipeDto.Porsiyon,
                ZorlukDerecesi = recipeDto.ZorlukDerecesi,
                ResimUrl = recipeDto.ResimUrl ?? string.Empty,
            };
            
            _context.Tarifler.Add(recipe);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetRecipeById), new { id = recipe.Id }, recipe);
        }

        // --- GET: ID'ye göre tek bir tarif getir ---
        // CreateRecipe'de kullandığımız CreatedAtAction için bu metoda ihtiyacımız var.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            var recipe = await _context.Tarifler
                .Include(r => r.Kullanici)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }

        // --- YENİ EKLENEN: Belirli bir kullanıcının tariflerini getir ---
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserRecipes(int userId)
        {
            try
            {
                var recipes = await _context.Tarifler
                    .Where(r => r.KullaniciId == userId && r.AktifMi == true)
                    .Include(r => r.Kullanici)
                    .Include(r => r.Kategori)
                    .OrderByDescending(r => r.OlusturmaTarihi)
                    .ToListAsync();

                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcı tarifleri getirilirken bir hata oluştu.", error = ex.Message });
            }
        }

        // --- PUT: Var olan bir tarifi güncelle ---
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRecipe(int id, RecipeUpdateDto recipeDto)
        {
            var recipeInDb = await _context.Tarifler.FindAsync(id);

            if (recipeInDb == null)
            {
                return NotFound("Güncellenecek tarif bulunamadı.");
            }

            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (recipeInDb.KullaniciId != currentUserId)
            {
                return Forbid("Bu tarifi güncelleme yetkiniz yok.");
            }

            recipeInDb.Baslik = recipeDto.Baslik;
            recipeInDb.Aciklama = recipeDto.Aciklama;
            recipeInDb.Hazirlanis = recipeDto.Hazirlanis;
            recipeInDb.Malzemeler = recipeDto.Malzemeler;
            recipeInDb.KategoriId = recipeDto.KategoriId;
            recipeInDb.HazirlikSuresi = recipeDto.HazirlikSuresi;
            recipeInDb.PisirmeSuresi = recipeDto.PisirmeSuresi;
            recipeInDb.Porsiyon = recipeDto.Porsiyon;
            recipeInDb.ZorlukDerecesi = recipeDto.ZorlukDerecesi;
            recipeInDb.ResimUrl = recipeDto.ResimUrl ?? string.Empty;
            recipeInDb.GuncellemeTarihi = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // --- DELETE: Bir tarifi sil ---
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipeInDb = await _context.Tarifler.FindAsync(id);

            if (recipeInDb == null)
            {
                return NotFound("Silinecek tarif bulunamadı.");
            }

            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (recipeInDb.KullaniciId != currentUserId)
            {
                return Forbid("Bu tarifi silme yetkiniz yok.");
            }

            _context.Tarifler.Remove(recipeInDb);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}