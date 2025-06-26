using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeAPI.Migrations
{
    /// <inheritdoc />
    public partial class BaslangicMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kategoriler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategoriler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KullaniciAdi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sifre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdSoyad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KayitTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tarifler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Baslik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Talimatlar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HazirlamaSuresi = table.Column<int>(type: "int", nullable: false),
                    PisirmeSuresi = table.Column<int>(type: "int", nullable: false),
                    KacKisilik = table.Column<int>(type: "int", nullable: false),
                    ZorlukSeviyesi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EklenmeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GuncellenmeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KullaniciId = table.Column<int>(type: "int", nullable: false),
                    KategoriId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarifler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarifler_Kategoriler_KategoriId",
                        column: x => x.KategoriId,
                        principalTable: "Kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tarifler_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Degerlendirmeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Puan = table.Column<int>(type: "int", nullable: false),
                    DegerlendirmeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KullaniciId = table.Column<int>(type: "int", nullable: false),
                    TarifId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Degerlendirmeler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Degerlendirmeler_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Degerlendirmeler_Tarifler_TarifId",
                        column: x => x.TarifId,
                        principalTable: "Tarifler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TarifMalzemeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MalzemeAdi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Miktar = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Birim = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TarifId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TarifMalzemeler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TarifMalzemeler_Tarifler_TarifId",
                        column: x => x.TarifId,
                        principalTable: "Tarifler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TarifResimleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DosyaAdi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DosyaYolu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnaResimMi = table.Column<bool>(type: "bit", nullable: false),
                    TarifId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TarifResimleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TarifResimleri_Tarifler_TarifId",
                        column: x => x.TarifId,
                        principalTable: "Tarifler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Yorumlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Yorum = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YorumTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KullaniciId = table.Column<int>(type: "int", nullable: false),
                    TarifId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Yorumlar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Yorumlar_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Yorumlar_Tarifler_TarifId",
                        column: x => x.TarifId,
                        principalTable: "Tarifler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Degerlendirmeler_KullaniciId_TarifId",
                table: "Degerlendirmeler",
                columns: new[] { "KullaniciId", "TarifId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Degerlendirmeler_TarifId",
                table: "Degerlendirmeler",
                column: "TarifId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarifler_KategoriId",
                table: "Tarifler",
                column: "KategoriId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarifler_KullaniciId",
                table: "Tarifler",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_TarifMalzemeler_TarifId",
                table: "TarifMalzemeler",
                column: "TarifId");

            migrationBuilder.CreateIndex(
                name: "IX_TarifResimleri_TarifId",
                table: "TarifResimleri",
                column: "TarifId");

            migrationBuilder.CreateIndex(
                name: "IX_Yorumlar_KullaniciId",
                table: "Yorumlar",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_Yorumlar_TarifId",
                table: "Yorumlar",
                column: "TarifId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Degerlendirmeler");

            migrationBuilder.DropTable(
                name: "TarifMalzemeler");

            migrationBuilder.DropTable(
                name: "TarifResimleri");

            migrationBuilder.DropTable(
                name: "Yorumlar");

            migrationBuilder.DropTable(
                name: "Tarifler");

            migrationBuilder.DropTable(
                name: "Kategoriler");

            migrationBuilder.DropTable(
                name: "Kullanicilar");
        }
    }
}
