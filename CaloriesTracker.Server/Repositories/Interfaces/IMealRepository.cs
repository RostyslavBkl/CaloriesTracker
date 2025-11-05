using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Meal;

namespace CaloriesTracker.Server.Repositories
{
    public interface IMealRepository
    {
        Task<long> CreateMealWithItemsAsync(Meal meal, List<MealItem> items);
        Task<List<Meal>> GetMealsByDiaryDayAsync(long diaryDayId);
        Task<bool> DeleteMealAsync(long mealId);
        Task<Meal?> GetMealByIdAsync(long mealId);
        Task<bool> UpdateMealItemAsync(long itemId, long? dishId, long? foodId, decimal? weightG);
        Task<SummaryNutrition> GetMealNutritionAsync(long mealId);
        Task<SummaryNutrition> GetDiaryDayNutritionAsync(long diaryDayId);
    }
}