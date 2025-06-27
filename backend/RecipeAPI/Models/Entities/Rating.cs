namespace RecipeAPI.Models.Entities
{
    public class Rating
    {
        public int Id { get; set; }
        public int Puan { get; set; }
        public int KullaniciId { get; set; }
        public int TarifId { get; set; }
        public virtual User Kullanici { get; set; } = null!;
        public virtual Recipe Tarif { get; set; } = null!;
    }
}