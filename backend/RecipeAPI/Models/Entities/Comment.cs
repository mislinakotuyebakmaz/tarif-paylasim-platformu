namespace RecipeAPI.Models.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Yorum { get; set; } = string.Empty;
        public DateTime OlusturmaTarihi { get; set; } = DateTime.UtcNow;
        public int KullaniciId { get; set; }
        public int TarifId { get; set; }
        public virtual User Kullanici { get; set; } = null!;
        public virtual Recipe Tarif { get; set; } = null!;
    }
}