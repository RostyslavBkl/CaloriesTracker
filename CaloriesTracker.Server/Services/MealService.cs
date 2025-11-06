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

        public async Task<long> CreateMealWithItemsAsync(Meal meal, List<MealItem> items)
        {
            if (meal == null)
                throw new ArgumentNullException(nameof(meal));

            if (meal.DiaryDayId <= 0)
                throw new ArgumentException("DiaryDayId must be greater than 0", nameof(meal));

            items ??= new List<MealItem>();

            return await mealRepository.CreateMealWithItemsAsync(meal, items);
        }

        public async Task<List<Meal>> GetMealsByDiaryDayAsync(long diaryDayId)
        {
            return await mealRepository.GetMealsByDiaryDayAsync(diaryDayId);
        }

        public async Task<Meal?> GetMealByIdAsync(long mealId)
        {
            if (mealId <= 0)
                return null;

            return await mealRepository.GetMealByIdAsync(mealId);
        }

        public async Task<bool> UpdateMealItemAsync(long itemId, long? dishId, long? foodId, decimal? weightG)
        {
            if (itemId <= 0)
                throw new ArgumentException("ItemId must be greater than 0", nameof(itemId));

            if (!dishId.HasValue && !foodId.HasValue && !weightG.HasValue)
                throw new ArgumentException("At least one field must be provided for update");

            return await mealRepository.UpdateMealItemAsync(itemId, dishId, foodId, weightG);
        }

        public async Task<bool> DeleteMealAsync(long mealId)
        {
            if (mealId <= 0)
                return false;

            return await mealRepository.DeleteMealAsync(mealId);
        }

        public async Task<SummaryNutrition> GetMealNutritionAsync(long mealId)
        {
            if (mealId <= 0)
                return new SummaryNutrition();

            return await mealRepository.GetMealNutritionAsync(mealId);
        }

        public async Task<SummaryNutrition> GetDiaryDayNutritionAsync(long diaryDayId)
        {
            if (diaryDayId <= 0)
                return new SummaryNutrition();

            return await mealRepository.GetDiaryDayNutritionAsync(diaryDayId);
        }


        public static string MapMealTypeToDb(MealType mealType)
        {
            switch (mealType)
            {
                case MealType.breakfast:
                    return "breakfast";

                case MealType.lunch:
                    return "lunch";

                case MealType.dinner:
                    return "dinner";

                case MealType.snack:
                    return "snack";

                case MealType.other:
                    return "other";

                default:
                    throw new ArgumentException($"Unknown MealType: {mealType}");
            }
        }

        public static MealType MapMealTypeFromDb(string dbValue)
        {
            var value = dbValue?.ToLowerInvariant();

            switch (value)
            {
                case "breakfast":
                    return MealType.breakfast;

                case "lunch":
                    return MealType.lunch;

                case "dinner":
                    return MealType.dinner;

                case "snack":
                    return MealType.snack;

                case "other":
                    return MealType.other;

                default:
                    throw new ArgumentException($"Unknown MealType in database: {dbValue}");
            }
        }
    }
}
