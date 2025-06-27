namespace RecipeAPI.Models.Entities
{
    public class RecipeIngredient
    {
        public int Id { get; set; }
        public string MalzemeAdi { get; set; } = string.Empty;
        public decimal Miktar { get; set; }
        public string Birim { get; set; } = string.Empty;
        public int TarifId { get; set; }
        public virtual Recipe Tarif { get; set; } = null!;
    }
}