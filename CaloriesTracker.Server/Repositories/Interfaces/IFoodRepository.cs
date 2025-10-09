using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Repositories.Interfaces
{
    public interface IFoodRepository
    {
        Task<Food> GetFoodByIdAsync(Guid Id);
        Task<List<Food>> SearchFoodAsync(string query, Guid UserId);

        // CRUD Custom foods
        Task<List<Food>> GetCustomFoodsAsync(Guid UserId);
        Task<Food> CreateCustomFoodAsync(Food food, Guid UserId);
        Task<Food> UpdateCustomFoodAsync(Food food, Guid UserId);
        Task<Food> DeleteCustomFoodAsync(Guid Id, Guid UserId);
    }

    public interface IFoodApiRepository
    {
        Task<Food> GetFoodByExternalIdAsync(string externalId);
        Task<Food> AddApiFoodAsync(Food food);
    }
}


