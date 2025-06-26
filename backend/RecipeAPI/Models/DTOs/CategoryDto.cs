namespace RecipeAPI.Models.DTOs
{
    public class CreateCategoryDto
    {
        public string Ad { get; set; } = string.Empty;
        public string? Aciklama { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Ad { get; set; } = string.Empty;
        public string? Aciklama { get; set; }
        public int TarifSayisi { get; set; }
    }
}