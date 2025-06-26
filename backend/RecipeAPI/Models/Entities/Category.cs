using System.Collections.Generic;

namespace RecipeAPI.Models.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Ad { get; set; }= string.Empty;
        public string Aciklama { get; set; }
        
        // İlişkiler
        public virtual ICollection<Recipe> Tarifler { get; set; }= new List<Recipe>();
    }
}