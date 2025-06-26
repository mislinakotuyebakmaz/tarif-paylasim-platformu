using Microsoft.EntityFrameworkCore;
using RecipeAPI.Models.Entities;

namespace RecipeAPI.Data
{
    public class RecipeDbContext : DbContext
    {
        public RecipeDbContext(DbContextOptions<RecipeDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Kullanicilar { get; set; }
        public DbSet<Recipe> Tarifler { get; set; }
        public DbSet<Category> Kategoriler { get; set; }
        public DbSet<Comment> Yorumlar { get; set; }
        public DbSet<Rating> Degerlendirmeler { get; set; }
        public DbSet<RecipeIngredient> TarifMalzemeler { get; set; }
        public DbSet<RecipeImage> TarifResimleri { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>().ToTable("Kullanicilar");
            modelBuilder.Entity<Recipe>().ToTable("Tarifler");
            modelBuilder.Entity<Category>().ToTable("Kategoriler");
            modelBuilder.Entity<Comment>().ToTable("Yorumlar");
            modelBuilder.Entity<Rating>().ToTable("Degerlendirmeler");
            modelBuilder.Entity<RecipeIngredient>().ToTable("TarifMalzemeler");
            modelBuilder.Entity<RecipeImage>().ToTable("TarifResimleri");
            
            modelBuilder.Entity<Rating>()
                .HasIndex(r => new { r.KullaniciId, r.TarifId })
                .IsUnique();


            modelBuilder.Entity<RecipeIngredient>()
                .Property(ri => ri.Miktar)
                .HasPrecision(10, 2); // 10 basamak, 2 ondalık


                  modelBuilder.Entity<Rating>()
        .HasOne(r => r.Kullanici)
        .WithMany(u => u.Degerlendirmeler)
        .HasForeignKey(r => r.KullaniciId)
        .OnDelete(DeleteBehavior.NoAction);
    
    modelBuilder.Entity<Rating>()
        .HasOne(r => r.Tarif)
        .WithMany(t => t.Degerlendirmeler)
        .HasForeignKey(r => r.TarifId)
        .OnDelete(DeleteBehavior.Cascade);
    
    modelBuilder.Entity<Comment>()
        .HasOne(c => c.Kullanici)
        .WithMany(u => u.Yorumlar)
        .HasForeignKey(c => c.KullaniciId)
        .OnDelete(DeleteBehavior.NoAction);
    
    modelBuilder.Entity<Comment>()
        .HasOne(c => c.Tarif)
        .WithMany(t => t.Yorumlar)
        .HasForeignKey(c => c.TarifId)
        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}