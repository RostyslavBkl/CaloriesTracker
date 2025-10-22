using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;

namespace CaloriesTracker.Server.Services.FoodService
{
    public class FoodService
    {
        private readonly IFoodRepository _foodRepository;
        private readonly FoodValidator _foodValidator;
        private readonly ILogger<FoodService> _logger;

        public FoodService(IFoodRepository foodRepository, FoodValidator foodValidator, ILogger<FoodService> logger)
        {
            _foodRepository = foodRepository;
            _foodValidator = foodValidator;
            _logger = logger;
        }

        public async Task<Food> GetFoodByIdAsync(Guid id, Guid userId)
        {
            var food = await _foodRepository.GetFoodByIdAsync(id);

            _foodValidator.ValidateCommonArgs(food);
            _foodValidator.ValidateUserAccess(food, userId);

            return food;
        }

        public async Task<List<Food>> GetCustomFoodsAsync(Guid userId)
        {
            // Validate user 
            return await _foodRepository.GetCustomFoodsAsync(userId);
        }

        public async Task<Food> CreateCustomFoodAsync(Food food, Guid userId)
        {
            // Check if user exist in db
            _foodValidator.ValidateAdd(food);

            var customFoodsExist = await GetCustomFoodsAsync(userId);
            if (customFoodsExist.Any(f => string.Equals(f.Name, food.Name, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException($"Food with Name: {food.Name} already exist");

            food.Type = Models.Type.custom;
            food.UserId = userId;
            food.Name = food.Name.Trim();

            SetDefaultNutrients(food);

            return await _foodRepository.CreateCustomFoodAsync(food, userId);
        }

        public async Task<Food> UpdateCustomFoodAsync(Food food, Guid userId)
        {
            _foodValidator.ValidateUpdating(food, userId);

            var customFoodsExist = await GetCustomFoodsAsync(userId);
            if (customFoodsExist.Any(f => f.Id != food.Id && string.Equals(f.Name?.Trim(), food.Name?.Trim(), StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException($"Food with Name: {food.Name} already exist");

            food.UserId = userId;
            food.Name = food.Name.Trim();

            //SetDefaultNutrients(food);

            return await _foodRepository.UpdateCustomFoodAsync(food, userId);
        }

        public async Task<Food> DeleteCustomFoodAsync(Guid id, Guid userId)
        {
            var foodExists = await _foodRepository.GetFoodByIdAsync(id);
            _foodValidator.ValidateUpdating(foodExists, userId);

            foodExists.Id = id;
            foodExists.UserId = userId;

            return await _foodRepository.DeleteCustomFoodAsync(id, userId);
        }

        public void SetDefaultNutrients(Food food)
        {
            food.WeightG ??= 100.00m;
            food.ProteinG ??= 0.00m;
            food.FatG ??= 0.00m;
            food.CarbsG ??= 0.00m;
        }
    }
}
