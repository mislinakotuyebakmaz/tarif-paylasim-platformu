// RecipeDbContext.cs - TAM VE DOĞRU HALİ
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
        public DbSet<Rating> Puanlamalar { get; set; }
        public DbSet<Favorite> Favoriler { get; set; }
        public DbSet<RecipeIngredient> TarifMalzemeler { get; set; }
        public DbSet<RecipeImage> TarifResimleri { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>().ToTable("Kullanicilar");
            modelBuilder.Entity<Recipe>().ToTable("Tarifler");
            modelBuilder.Entity<Category>().ToTable("Kategoriler");
            modelBuilder.Entity<Comment>().ToTable("Yorumlar");
            modelBuilder.Entity<Rating>().ToTable("Puanlamalar");
            modelBuilder.Entity<Favorite>().ToTable("Favoriler");
            modelBuilder.Entity<RecipeIngredient>().ToTable("TarifMalzemeler");
            modelBuilder.Entity<RecipeImage>().ToTable("TarifResimleri");
            
            // User (Kullanıcı) yapılandırması
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.AdSoyad).IsRequired().HasMaxLength(100);
                entity.Property(u => u.KullaniciAdi).IsRequired().HasMaxLength(50);
                entity.HasIndex(u => u.KullaniciAdi).IsUnique();
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Sifre).IsRequired();
            });

            // Category (Kategori) yapılandırması
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Ad).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Aciklama).HasMaxLength(500);
            });

            // Recipe (Tarif) yapılandırması
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Baslik).IsRequired().HasMaxLength(200);
                entity.Property(r => r.Aciklama).IsRequired().HasMaxLength(1000);
                entity.Property(r => r.Hazirlanis).IsRequired();
                
                entity.HasOne(r => r.Kategori)
                    .WithMany(k => k.Tarifler)
                    .HasForeignKey(r => r.KategoriId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(r => r.Kullanici)
                    .WithMany(u => u.Tarifler)
                    .HasForeignKey(r => r.KullaniciId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // RecipeIngredient (TarifMalzeme) yapılandırması
            modelBuilder.Entity<RecipeIngredient>(entity =>
            {
                entity.HasKey(ri => ri.Id);
                entity.Property(ri => ri.MalzemeAdi).IsRequired().HasMaxLength(100);
                entity.Property(ri => ri.Miktar).HasPrecision(10, 2);
                entity.Property(ri => ri.Birim).IsRequired().HasMaxLength(20);
                
                entity.HasOne(ri => ri.Tarif)
                    .WithMany(t => t.TarifMalzemeler)
                    .HasForeignKey(ri => ri.TarifId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // RecipeImage (TarifResim) yapılandırması
            modelBuilder.Entity<RecipeImage>(entity =>
            {
                entity.HasKey(ri => ri.Id);
                entity.Property(ri => ri.ResimUrl).IsRequired().HasMaxLength(500);
                entity.Property(ri => ri.Aciklama).HasMaxLength(200);
                
                entity.HasOne(ri => ri.Tarif)
                    .WithMany(t => t.TarifResimleri)
                    .HasForeignKey(ri => ri.TarifId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Comment (Yorum) yapılandırması
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Yorum).IsRequired().HasMaxLength(1000);
                
                entity.HasOne(c => c.Tarif)
                    .WithMany(t => t.Yorumlar)
                    .HasForeignKey(c => c.TarifId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(c => c.Kullanici)
                    .WithMany(u => u.Yorumlar)
                    .HasForeignKey(c => c.KullaniciId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            // Rating (Puanlama) yapılandırması
            modelBuilder.Entity<Rating>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Puan).IsRequired();
                
                entity.HasOne(r => r.Tarif)
                    .WithMany(t => t.Puanlamalar)
                    .HasForeignKey(r => r.TarifId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(r => r.Kullanici)
                    .WithMany(u => u.Puanlamalar) // User'daki ICollection<Rating> propertysinin adı
                    .HasForeignKey(r => r.KullaniciId)
                    .OnDelete(DeleteBehavior.NoAction);
                    
                entity.HasIndex(r => new { r.TarifId, r.KullaniciId }).IsUnique();
            });

            // Favorite (Favori) yapılandırması
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(f => f.Id);
                
                entity.HasOne(f => f.Tarif)
                    .WithMany(t => t.Favoriler)
                    .HasForeignKey(f => f.TarifId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(f => f.Kullanici)
                    .WithMany(u => u.Favoriler) // User'daki ICollection<Favorite> propertysinin adı
                    .HasForeignKey(f => f.KullaniciId)
                    .OnDelete(DeleteBehavior.NoAction);
                    
                entity.HasIndex(f => new { f.TarifId, f.KullaniciId }).IsUnique();
            });
        }
    }
}