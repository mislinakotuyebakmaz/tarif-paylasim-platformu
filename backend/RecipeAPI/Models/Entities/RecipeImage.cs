namespace RecipeAPI.Models.Entities
{
    public class RecipeImage
    {
        public int Id { get; set; }
        public string ResimUrl { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        public int TarifId { get; set; }
        public virtual Recipe Tarif { get; set; } = null!;
    }
}