using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Meal;
using CaloriesTracker.Server.Repositories;

namespace CaloriesTracker.Server.Services
{
    public class MealService
    {
        private readonly IMealRepository mealRepository;

        public MealService(IMealRepository mealRepository)
        {
            this.mealRepository = mealRepository;
        }

        public async Task<Guid> CreateMealWithItemsAsync(Meal meal, List<MealItem> items)
        {
            if (meal == null)
                throw new ArgumentNullException(nameof(meal));

            if (meal.DiaryDayId == Guid.Empty)
                throw new ArgumentException("DiaryDayId must be a valid Guid", nameof(meal));

            items ??= new List<MealItem>();

            return await mealRepository.CreateMealWithItemsAsync(meal, items);
        }

        public async Task<List<Meal>> GetMealsByDiaryDayAsync(Guid diaryDayId)
        {
            if (diaryDayId == Guid.Empty)
                return new List<Meal>();

            return await mealRepository.GetMealsByDiaryDayAsync(diaryDayId);
        }

        public async Task<Meal?> GetMealByIdAsync(Guid mealId)
        {
            if (mealId == Guid.Empty)
                return null;

            return await mealRepository.GetMealByIdAsync(mealId);
        }

        public async Task<bool> UpdateMealItemAsync(Guid itemId, Guid? dishId, Guid? foodId, decimal? weightG)
        {
            if (itemId == Guid.Empty)
                throw new ArgumentException("ItemId must be a valid Guid", nameof(itemId));

            if (!dishId.HasValue && !foodId.HasValue && !weightG.HasValue)
                throw new ArgumentException("At least one field must be provided for update");

            return await mealRepository.UpdateMealItemAsync(itemId, dishId, foodId, weightG);
        }

        public async Task<bool> DeleteMealAsync(Guid mealId)
        {
            if (mealId == Guid.Empty)
                return false;

            return await mealRepository.DeleteMealAsync(mealId);
        }

        public async Task<SummaryNutrition> GetMealNutritionAsync(Guid mealId)
        {
            if (mealId == Guid.Empty)
                return new SummaryNutrition();

            return await mealRepository.GetMealNutritionAsync(mealId);
        }

        public async Task<SummaryNutrition> GetDiaryDayNutritionAsync(Guid diaryDayId)
        {
            if (diaryDayId == Guid.Empty)
                return new SummaryNutrition();

            return await mealRepository.GetDiaryDayNutritionAsync(diaryDayId);
        }

        public static string MapMealTypeToDb(MealType mealType)
        {
            return mealType switch
            {
                MealType.breakfast => "breakfast",
                MealType.lunch => "lunch",
                MealType.dinner => "dinner",
                MealType.snack => "snack",
                MealType.other => "other",
                _ => throw new ArgumentException($"Unknown MealType: {mealType}")
            };
        }

        public static MealType MapMealTypeFromDb(string dbValue)
        {
            return dbValue?.ToLowerInvariant() switch
            {
                "breakfast" => MealType.breakfast,
                "lunch" => MealType.lunch,
                "dinner" => MealType.dinner,
                "snack" => MealType.snack,
                "other" => MealType.other,
                _ => throw new ArgumentException($"Unknown MealType in database: {dbValue}")
            };
        }
    }
}
