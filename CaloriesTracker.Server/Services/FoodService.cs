using CaloriesTracker.Server.API;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Implementations;
using CaloriesTracker.Server.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices.JavaScript;

namespace CaloriesTracker.Server.Services
{
    public class FoodService
    {
        private readonly IFoodRepository _foodRepository;
        private readonly FoodValidator _foodValidator;
        private readonly FatSecretApi _api;
        private readonly ILogger<FoodService> _logger;

        public FoodService(IFoodRepository foodRepository, FoodValidator foodValidator, FatSecretApi api, ILogger<FoodService> logger)
        {
            _foodRepository = foodRepository;
            _foodValidator = foodValidator;
            _api = api;
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
            if(customFoodsExist.Any(f => string.Equals(f.Name, food.Name, StringComparison.OrdinalIgnoreCase)))
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

            SetDefaultNutrients(food);

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

        public async Task<List<Food>> SearchFoodInApiAsync(string query)
        {
            var json = await _api.SearchFoodAsync(query);

            Console.WriteLine("=== RAW JSON ===");
            Console.WriteLine(json);
            Console.WriteLine("================");

            var res = JsonConvert.DeserializeObject<FatSecretFoodRes>(json);
            if (res?.Foods?.Food == null || !res.Foods.Food.Any())
            {
                return new List<Food>();
            }

            var results = new List<Food>();
            foreach (var apiFood in res.Foods.Food)
            {
                var food = new Food
                {
                    Name = apiFood.FoodName,
                    Type = Models.Type.api,
                    WeightG = 100m,
                    ProteinG = ExtractNutrient(apiFood.FoodDescription, "Protein:"),
                    FatG = ExtractNutrient(apiFood.FoodDescription, "Fat:"),
                    CarbsG = ExtractNutrient(apiFood.FoodDescription, "Carbs:"),
                };
                results.Add(food);
            }
            return results;
        }

        public async Task<Food> SaveApiFoodToDb(Food selectedFood)
        {
            _foodValidator.ValidateFoodApi(selectedFood);

            selectedFood.Id = Guid.NewGuid();

            return await _foodRepository.SaveApiFoodToDb(selectedFood);
        }

        public void SetDefaultNutrients(Food food)
        {
            food.WeightG ??= 100.00m;
            food.ProteinG ??= 0.00m;
            food.FatG ??= 0.00m;
            food.CarbsG ??= 0.00m;
        }

        private decimal? ExtractNutrient(string description, string keyword)
        {
            if (string.IsNullOrEmpty(description)) return null;

            try
            {
                // "Per 100g - Calories: 165kcal | Fat: 3.60g | Carbs: 0.00g | Protein: 31.00g"
                var parts = description.Split('|');

                // Знаходимо частину з потрібним keyword
                var part = parts.FirstOrDefault(p => p.Contains(keyword));
                if (part == null) return null;

                // "Protein: 31.00g" → ["Protein", " 31.00g"]
                var colonSplit = part.Split(':');
                if (colonSplit.Length < 2) return null;

                // " 31.00g" → "31.00"
                var valueText = colonSplit[1].Trim();
                var numberPart = new string(valueText.TakeWhile(c => char.IsDigit(c) || c == '.').ToArray());

                return decimal.TryParse(numberPart, out var value) ? value : null;
            }
            catch
            {
                return null;
            }
        }
    }
}