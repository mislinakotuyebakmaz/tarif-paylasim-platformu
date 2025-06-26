using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeAPI.Data;
using RecipeAPI.Models.Entities;
using RecipeAPI.Models.DTOs;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(RecipeDbContext context, ILogger<CategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetKategoriler()
        {
            _logger.LogInformation("Tüm kategoriler getiriliyor");
            
            var kategoriler = await _context.Kategoriler
                .Select(k => new CategoryDto
                {
                    Id = k.Id,
                    Ad = k.Ad,
                    Aciklama = k.Aciklama,
                    TarifSayisi = k.Tarifler != null ? k.Tarifler.Count : 0
                })
                .ToListAsync();
                
            return Ok(kategoriler);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Kategoriler
                .Where(k => k.Id == id)
                .Select(k => new CategoryDto
                {
                    Id = k.Id,
                    Ad = k.Ad,
                    Aciklama = k.Aciklama,
                    TarifSayisi = k.Tarifler != null ? k.Tarifler.Count : 0
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                _logger.LogWarning($"Kategori bulunamadı: {id}");
                return NotFound();
            }

            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> PostCategory(CreateCategoryDto categoryDto)
        {
            var category = new Category
            {
                Ad = categoryDto.Ad,
                Aciklama = categoryDto.Aciklama
            };

            _context.Kategoriler.Add(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Yeni kategori oluşturuldu: {category.Ad}");
            
            var result = new CategoryDto
            {
                Id = category.Id,
                Ad = category.Ad,
                Aciklama = category.Aciklama,
                TarifSayisi = 0
            };
            
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, result);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CreateCategoryDto categoryDto)
        {
            var category = await _context.Kategoriler.FindAsync(id);
            
            if (category == null)
            {
                return NotFound();
            }

            category.Ad = categoryDto.Ad;
            category.Aciklama = categoryDto.Aciklama;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Kategori güncellendi: {id}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Kategoriler.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Kategoriler.Remove(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Kategori silindi: {id}");
            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Kategoriler.Any(e => e.Id == id);
        }
    }
}