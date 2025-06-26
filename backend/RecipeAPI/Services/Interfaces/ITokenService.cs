using RecipeAPI.Models.Entities;

namespace RecipeAPI.Services.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}