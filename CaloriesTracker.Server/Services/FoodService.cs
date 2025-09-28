using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Implementations;
using Microsoft.Identity.Client;

namespace CaloriesTracker.Server.Services
{
    public class FoodService
    {
        private readonly FoodRepository _foodRepository;
        private readonly ILogger<FoodService> _logger;

        public FoodService(FoodRepository foodRepository, ILogger<FoodService> logger)
        {
            _foodRepository = foodRepository;
            _logger = logger;
        }

        public async Task<Food> GetFoodByIdAsync(Guid id, Guid userId)
        {
            var food = await _foodRepository.GetFoodByIdAsync(id);

            ValidateFoodExists(food);
            ValidateFoodAccess(food, userId);

            return food;
        }

        public async Task<List<Food>> GetCustomFoodsAsync(Guid userId)
        {
            // Validate user 
            return await _foodRepository.GetCustomFoodsAsync(userId);
        }

        public async Task<Food> CreateCustomFoodAsync(Food food, Guid userId)
        {
            ValidateCreateData(food);

            var customFoodsExist = await GetCustomFoodsAsync(userId);
            if(customFoodsExist.Any(f => string.Equals(f.Name, food.Name, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Food already exist");

            food.Type = Models.Type.custom;
            food.UserId = userId;
            food.Name = food.Name.Trim();

            SetDefaultNutrients(food);

            return await _foodRepository.CreateCustomFoodAsync(food, userId);
        }

        public void SetDefaultNutrients(Food food)
        {
            food.WeightG ??= 100.00m;
            food.ProteinG = 0.00m;
            food.FatG = 0.00m;
            food.CarbsG = 0.00m;
        }

        private void ValidateCreateData(Food food)
        {
            if (food == null) throw new ArgumentNullException("Food data is required");
            if (string.IsNullOrWhiteSpace(food.Name)) throw new Exception("The name of Food is required");
        }

        private void ValidateFoodExists(Food food)
        {
            if (food == null)
                throw new Exception("Food not found");
        }

        private void ValidateFoodAccess(Food food, Guid userId)
        {
            if (food.Type == Models.Type.custom && food.UserId != userId)
                throw new Exception("Can't access other user's food");
        }
    }
}
