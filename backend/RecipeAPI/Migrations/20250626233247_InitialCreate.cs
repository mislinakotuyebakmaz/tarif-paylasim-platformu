using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
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
                    Ad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
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
                    KullaniciAdi = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Sifre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdSoyad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
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
                    Baslik = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Hazirlanis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Malzemeler = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HazirlikSuresi = table.Column<int>(type: "int", nullable: true),
                    PisirmeSuresi = table.Column<int>(type: "int", nullable: true),
                    Porsiyon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ZorlukDerecesi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResimUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KategoriId = table.Column<int>(type: "int", nullable: false),
                    KullaniciId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarifler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarifler_Kategoriler_KategoriId",
                        column: x => x.KategoriId,
                        principalTable: "Kategoriler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tarifler_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Favoriler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KullaniciId = table.Column<int>(type: "int", nullable: false),
                    TarifId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favoriler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favoriler_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Favoriler_Tarifler_TarifId",
                        column: x => x.TarifId,
                        principalTable: "Tarifler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Puanlamalar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Puan = table.Column<int>(type: "int", nullable: false),
                    KullaniciId = table.Column<int>(type: "int", nullable: false),
                    TarifId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Puanlamalar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Puanlamalar_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Puanlamalar_Tarifler_TarifId",
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
                    MalzemeAdi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Miktar = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Birim = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
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
                    ResimUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
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
                    Yorum = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                name: "IX_Favoriler_KullaniciId",
                table: "Favoriler",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_Favoriler_TarifId_KullaniciId",
                table: "Favoriler",
                columns: new[] { "TarifId", "KullaniciId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_Email",
                table: "Kullanicilar",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_KullaniciAdi",
                table: "Kullanicilar",
                column: "KullaniciAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Puanlamalar_KullaniciId",
                table: "Puanlamalar",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_Puanlamalar_TarifId_KullaniciId",
                table: "Puanlamalar",
                columns: new[] { "TarifId", "KullaniciId" },
                unique: true);

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
                name: "Favoriler");

            migrationBuilder.DropTable(
                name: "Puanlamalar");

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
