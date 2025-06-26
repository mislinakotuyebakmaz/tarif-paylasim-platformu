namespace RecipeAPI.Models.Entities
{
    public class RecipeIngredient
    {
        public int Id { get; set; }
        public string MalzemeAdi { get; set; }
        public decimal Miktar { get; set; }
        public string Birim { get; set; }
        
        // Foreign Key
        public int TarifId { get; set; }
        
        // Navigation Property
        public virtual Recipe Tarif { get; set; }
    }
}