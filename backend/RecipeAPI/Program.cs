using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RecipeAPI.Data;
using RecipeAPI.Services;
using RecipeAPI.Services.Interfaces;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Serilog Yapılandırması ---
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration) // appsettings.json'dan okumayı sağlar
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// --- Servislerin Eklenmesi (Dependency Injection) ---
builder.Services.AddControllers();

// DbContext'i ekle
builder.Services.AddDbContext<RecipeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servisleri ekle
builder.Services.AddScoped<ITokenService, TokenService>();

// --- JWT Authentication Yapılandırması ---
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// --- Swagger Yapılandırması ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => // 'c' yerine daha standart olan 'options' kullanıldı
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Recipe API",
        Version = "v1",
        Description = "Tarif Paylaşım Platformu API"
    });

    // Swagger arayüzüne "Authorize" butonu eklemek için JWT Bearer şemasını tanımla
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Lütfen 'Bearer' kelimesini ve ardından bir boşluk bırakarak JWT token'ınızı girin. Örnek: \"Bearer {token}\"",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey, // 'ApiKey' scheme'i Bearer için yaygın bir yöntemdir
        Scheme = "Bearer"
    });

    // Swagger'ın, yetki gerektiren tüm endpoint'ler için bu token'ı kullanmasını sağla
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>() // Boş bir string dizisi
        }
    });
});


// --- Uygulamanın Oluşturulması ---
var app = builder.Build();


// --- HTTP Request Pipeline'ının Yapılandırılması ---
// Middleware'lerin sırası önemlidir!

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        // Swagger UI'ın hangi endpoint'i kullanacağını belirtir
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Recipe API v1");
        // Swagger'ı açtığında sayfanın boş gelmesini sağlar, daha temiz bir başlangıç için
        c.RoutePrefix = string.Empty; 
    });
}

// Serilog için request logging middleware'i
app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

// CORS policy'n varsa buraya eklenmeli
// app.UseCors("MyPolicy");

// Önce kimlik doğrulama, sonra yetkilendirme
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// === Veritabanını Uygulama Başlangıcında Oluşturma Notu ===
// Senin kodun çalışır, ancak bu yöntem genellikle tavsiye edilmez.
// 'dotnet ef database update' komutunu kullanmak daha kontrollü bir yöntemdir.
// Bu kodu şimdilik olduğu gibi bırakıyorum, çünkü projeni ayağa kaldırmak için işe yarar.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<RecipeDbContext>();
        dbContext.Database.EnsureCreated();
        Log.Information("Veritabanı başarıyla kontrol edildi/oluşturuldu.");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Veritabanı oluşturma/kontrol etme sırasında bir hata oluştu.");
    }
}


// --- Uygulamayı Çalıştır ---
app.Run();