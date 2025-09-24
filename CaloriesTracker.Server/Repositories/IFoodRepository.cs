using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Repositories
{
    public interface IFoodRepository
    {
        Task<Food> GetFoodByIdAsync(long Id);
        Task<List<Food>> SearchFoodAsync(string query, long UserId);

        // CRUD Custom foods
        Task<List<Food>> GetCustomFoodsAsync(long UserId);
        Task<Food> CreateCustomFoodAsync(Food food, long UserId);
        Task<Food> UpdateCustomFoodAsync(Food food, long UserId);
        Task<Food> DeleteCustomFoodAsync(long Id, long UserId);
    }

    //public class FoodRepository : IFoodRepository
    //{
    //    public async Task<Food> GetFoodByIdAsync(long Id)
    //    {
    //        return await GetFoodByIdAsync(Id);
    //    }
    //}
}


