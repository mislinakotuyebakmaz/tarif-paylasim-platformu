namespace RecipeAPI.Models.Entities
{
    public class RecipeImage
    {
        public int Id { get; set; }
        public string DosyaAdi { get; set; }
        public string DosyaYolu { get; set; }
        public bool AnaResimMi { get; set; }
        
        // Foreign Key
        public int TarifId { get; set; }
        
        // Navigation Property
        public virtual Recipe Tarif { get; set; }
    }
}