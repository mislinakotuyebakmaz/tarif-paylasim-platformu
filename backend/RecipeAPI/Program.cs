using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RecipeAPI.Data;
using RecipeAPI.Services;
using RecipeAPI.Services.Interfaces;
using Serilog;
using System.Text;

// --- PROGRAM BAŞLANGICI ---
Console.WriteLine(">>> Program.cs başlangıcı.");

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine(">>> Adım 1: Builder oluşturuldu.");

// --- URL YAPILANDIRMASI ---
builder.WebHost.UseUrls("http://localhost:5301");
Console.WriteLine(">>> Adım 2: URL 'http://localhost:5301' olarak ayarlandı.");

// --- SERVİSLERİN EKLENMESİ ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();

// CORS Servisi
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
Console.WriteLine(">>> Adım 3: CORS servisi eklendi.");

builder.Services.AddScoped<IPasswordService, PasswordService>();
//builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
Console.WriteLine(">>> Adım 4: Controllers servisi eklendi.");

// DbContext - Eğer program burada takılıyorsa, sorun veritabanı bağlantısındadır.
try
{
    Console.WriteLine(">>> Adım 5: AddDbContext servisi ekleniyor...");
    builder.Services.AddDbContext<RecipeDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
    Console.WriteLine(">>> Adım 5 TAMAMLANDI: AddDbContext servisi eklendi.");
}
catch (Exception ex)
{
    Console.WriteLine($">>> HATA: AddDbContext sırasında bir istisna oluştu: {ex.Message}");
    // Bu hatayı görmek için programı sonlandırabiliriz.
    return;
}

// Kendi Servislerin
builder.Services.AddScoped<ITokenService, TokenService>();
Console.WriteLine(">>> Adım 6: Özel servisler (ITokenService) eklendi.");

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Recipe API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header, Description = "Please enter a valid token", Name = "Authorization",
        Type = SecuritySchemeType.Http, BearerFormat = "JWT", Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() } });
});
Console.WriteLine(">>> Adım 7: Swagger servisleri eklendi.");

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true, ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true, ValidAudience = jwtSettings["Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });
Console.WriteLine(">>> Adım 8: Authentication servisi eklendi.");

// --- UYGULAMANIN OLUŞTURULMASI ---
var app = builder.Build();
Console.WriteLine(">>> Adım 9: Uygulama (app) oluşturuldu.");

// --- HTTP REQUEST PIPELINE (MIDDLEWARE) ---
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Recipe API V1");
    c.RoutePrefix = string.Empty;
});
Console.WriteLine(">>> Adım 10: Swagger UI yapılandırıldı.");

// app.UseHttpsRedirection(); // Bunu geçici olarak devre dışı bırakmak bağlantı sorunlarını çözebilir.

app.UseCors(MyAllowSpecificOrigins);
Console.WriteLine(">>> Adım 11: CORS middleware kullanıldı.");

app.UseAuthentication();
Console.WriteLine(">>> Adım 12: Authentication middleware kullanıldı.");

app.UseAuthorization();
Console.WriteLine(">>> Adım 13: Authorization middleware kullanıldı.");

app.MapControllers();
Console.WriteLine(">>> Adım 14: Controllers eşlendi.");

// --- UYGULAMAYI ÇALIŞTIR ---
Console.WriteLine(">>> Adım 15: app.Run() çağrılıyor... Sunucu şimdi başlamalı.");
app.Run();