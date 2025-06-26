using System.ComponentModel.DataAnnotations;

namespace RecipeAPI.Models.DTOs
{
    public class CreateRecipeDto
    {
        [Required(ErrorMessage = "Tarif başlığı zorunludur")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Başlık 3-200 karakter arasında olmalıdır")]
        public string Baslik { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur")]