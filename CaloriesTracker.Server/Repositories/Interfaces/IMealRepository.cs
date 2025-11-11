using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Meal;

namespace CaloriesTracker.Server.Repositories
{
    public interface IMealRepository
    {
        Task<Guid> CreateMealWithItemsAsync(Meal meal, List<MealItem> items);
        Task<List<Meal>> GetMealsByDiaryDayAsync(Guid diaryDayId);
        Task<bool> DeleteMealAsync(Guid mealId);
        Task<Meal?> GetMealByIdAsync(Guid mealId);
        Task<bool> UpdateMealItemAsync(Guid itemId, Guid? dishId, Guid? foodId, decimal? weightG);
        Task<SummaryNutrition> GetMealNutritionAsync(Guid mealId);
        Task<SummaryNutrition> GetDiaryDayNutritionAsync(Guid diaryDayId);
    }
}
