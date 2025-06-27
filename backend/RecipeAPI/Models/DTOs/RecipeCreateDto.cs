namespace RecipeAPI.Models.DTOs
{
    public class RecipeCreateDto
    {
        public string Baslik { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        public string Hazirlanis { get; set; } = string.Empty;
        public string Malzemeler { get; set; } = string.Empty;
        public int KategoriId { get; set; }
        public int? HazirlikSuresi { get; set; }
        public int? PisirmeSuresi { get; set; }
        public string Porsiyon { get; set; } = string.Empty;
        public string ZorlukDerecesi { get; set; } = string.Empty;
        public string? ResimUrl { get; set; }
    }
}