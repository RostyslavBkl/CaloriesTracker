using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Implementations;
using CaloriesTracker.Server.Repositories.Interfaces;
using System.Formats.Asn1;

namespace CaloriesTracker.Server.Services
{
    public class DbTester
    {
        private readonly FoodService _foodServ;
        private readonly ILogger _logger;
   

        public DbTester(FoodService foodServ, ILogger logger)
        {
            _foodServ = foodServ;
            _logger = logger;
        }

        public async Task TestCreateCustomFood(Food food, Guid userId)
        {
            try
            {
                _logger.LogInformation("=== TEST CREATE CUSTOM FOOD ===");
                _logger.LogInformation("User: {UserId}", userId);
                _logger.LogInformation("Input data:");
                _logger.LogInformation("  Name: '{Name}'", food.Name);
                _logger.LogInformation("  Weight: {Weight}g", food.WeightG);
                _logger.LogInformation("  Protein: {Protein}g", food.ProteinG);
                _logger.LogInformation("  Fat: {Fat}g", food.FatG);
                _logger.LogInformation("  Carbs: {Carbs}g", food.CarbsG);

                var result = await _foodServ.CreateCustomFoodAsync(food, userId);

                _logger.LogInformation("SUCCESS. Food was added!");
                _logger.LogInformation("  Name: '{Name}' (після trim)", result.Name);
                _logger.LogInformation("  Type: {Type}", result.Type);
                _logger.LogInformation("  UserId: {UserId}", result.UserId);
                _logger.LogInformation("  Weight: {Weight}g", result.WeightG);
                _logger.LogInformation("  Protein: {Protein}g", result.ProteinG);
                _logger.LogInformation("  Fat: {Fat}g", result.FatG);
                _logger.LogInformation("  Carbs: {Carbs}g", result.CarbsG);
                _logger.LogInformation("END TEST");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating custom food for {userId}", userId);
                throw;
            }
        }

        public async Task TestGetFoodByIdAsync(Guid id, Guid userId)
        {
            try
            {
                _logger.LogInformation("== Test Get food by Id");
                _logger.LogInformation("Food Id: {id}, for userId: {userId}", id, userId);

                var result = await _foodServ.GetFoodByIdAsync(id, userId);

                _logger.LogInformation(" SUCCESS! Food was gotten by ID:");
                _logger.LogInformation("  Name: '{Name}'", result.Name);
                _logger.LogInformation("  Type: {Type}", result.Type);
                _logger.LogInformation("  UserId: {UserId}", result.UserId);
                _logger.LogInformation("  Weight: {Weight}g", result.WeightG);
                _logger.LogInformation("  Protein: {Protein}g", result.ProteinG);
                _logger.LogInformation("  Fat: {Fat}g", result.FatG);
                _logger.LogInformation("  Carbs: {Carbs}g", result.CarbsG);
                _logger.LogInformation("END");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Error while get foodId {id} for user {userId}", id, userId);
                throw;
            }
        }

        public async Task TestGetCustomFoods(Guid userId)
        {
            try
            {
                _logger.LogInformation("== Test Get Custom Food by UserId");
                _logger.LogInformation("UserId: {userId}", userId);

                var results = await _foodServ.GetCustomFoodsAsync(userId);

                if (results == null)
                    throw new Exception("Foods not found");

                foreach(var result in results)
                {
                    _logger.LogInformation(" SUCCESS! Food received");
                    _logger.LogInformation("  FoodId: '{Id}'", result.Id);
                    _logger.LogInformation("  Name: '{Name}'", result.Name);
                    _logger.LogInformation("  Type: {Type}", result.Type);
                    _logger.LogInformation("  Weight: {Weight}g", result.WeightG);
                    _logger.LogInformation("  Protein: {Protein}g", result.ProteinG);
                    _logger.LogInformation("  Fat: {Fat}g", result.FatG);
                    _logger.LogInformation("  Carbs: {Carbs}g", result.CarbsG);
                    _logger.LogInformation("END");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting custom for user {userId}", userId);
                throw;
            }
        }
        public async Task TestUpdateCustomFood(Food food, Guid userId)
        {
            try
            {
                var customFoodsExist = await _foodServ.GetCustomFoodsAsync(userId);
                foreach (var f in customFoodsExist)
                {
                    _logger.LogInformation("Food: Id={Id}, Name={Name}", f.Id, f.Name);
                }
                _logger.LogInformation("Checking against: Id={Id}, Name={Name}", food.Id, food.Name);
                _logger.LogInformation("== Test Update Custom Food ");
                _logger.LogInformation("UserId: {userId}", userId);
                _logger.LogInformation("Prev data of custom food:");
                _logger.LogInformation(" Name: '{Name}'", food.Name);
                _logger.LogInformation(" Type: {Type}", food.Type);
                _logger.LogInformation(" UserId: {UserId}", food.UserId);
                _logger.LogInformation(" Weight: {Weight}g", food.WeightG);
                _logger.LogInformation(" Protein: {Protein}g", food.ProteinG);
                _logger.LogInformation(" Fat: {Fat}g", food.FatG);
                _logger.LogInformation(" Carbs: {Carbs}g", food.CarbsG);

                var result = await _foodServ.UpdateCustomFoodAsync(food, userId);

                _logger.LogInformation(" SUCCESS! Food was gotten by ID:");
                _logger.LogInformation("  Name: {Name}", result.Name);
                _logger.LogInformation("  Type: {Type}", result.Type);
                _logger.LogInformation("  Weight: {Weight}g", result.WeightG);
                _logger.LogInformation("  Protein: {Protein}g", result.ProteinG);
                _logger.LogInformation("  Fat: {Fat}g", result.FatG);
                _logger.LogInformation("  Carbs: {Carbs}g", result.CarbsG);
                _logger.LogInformation("END");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating food {id} for user {userId}", food.Id, userId);
                throw;
            }
        }
    }
}
 