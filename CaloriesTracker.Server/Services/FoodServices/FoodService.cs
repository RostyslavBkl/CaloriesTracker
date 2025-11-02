using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Repositories.Interfaces;

namespace CaloriesTracker.Server.Services.FoodService
{
    public class FoodService
    {
        private readonly IFoodRepository _foodRepository;
        private readonly FoodValidator _foodValidator;
        private readonly IHttpContextAccessor _http;
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenRepository _jwt;
        private readonly ILogger<FoodService> _logger;

        public FoodService(IFoodRepository foodRepository, FoodValidator foodValidator,
            IHttpContextAccessor http, IUserRepository userRepository, JwtTokenRepository jwt,
            ILogger<FoodService> logger)
        {
            _foodRepository = foodRepository;
            _foodValidator = foodValidator;
            _http = http;
            _userRepository = userRepository;
            _jwt = jwt;
            _logger = logger;
        }

        private async Task<Guid> GetUserId()
        {
            if (_http.HttpContext == null)
                return Guid.Empty;

            var jwt = _http.HttpContext!.Request.Cookies["jwt"];
            if (jwt == null)
                return Guid.Empty;

            var token = _jwt.EncodeAndVerify(jwt);

            if (!Guid.TryParse(token.Issuer, out var userId))
                return Guid.Empty;

            var user = await _userRepository.GetById(userId);
            if (user == null)
                return Guid.Empty;

            return user.Id;
        }

        public async Task<Food> GetFoodByIdAsync(Guid id)
        {
            var userId = await GetUserId();
            var food = await _foodRepository.GetFoodByIdAsync(id);

            _foodValidator.ValidateCommonArgs(food);
            if (food.UserId != userId && food.Type == Models.Type.custom)
                throw new Exception($"Can't get food: {food.Id} that belongs to other user");
          
            return food;
        }

        public async Task<List<Food>> GetCustomFoodsAsync()
        {
            // Validate user 
            var userId = await GetUserId();
            if(userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");
            return await _foodRepository.GetCustomFoodsAsync(userId);
        }

        public async Task<Food> CreateCustomFoodAsync(Food food)
        {
            // Check if user exist in db
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            _foodValidator.ValidateAdd(food);

            var customFoodsExist = await _foodRepository.GetCustomFoodsAsync(userId); ;
            if (customFoodsExist.Any(f => string.Equals(f.Name, food.Name, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException($"Food with Name: {food.Name} already exist");

            food.Type = Models.Type.custom;
            food.UserId = userId;
            food.Name = food.Name.Trim();

            SetDefaultNutrients(food);

            var gen64 = Convert.ToInt64(food.Name);
            Console.WriteLine(gen64);

            return await _foodRepository.CreateCustomFoodAsync(food, userId);
        }

        public async Task<Food> UpdateCustomFoodAsync(Food food)
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            _foodValidator.ValidateUpdating(food, userId);

            var customFoodsExist = await _foodRepository.GetCustomFoodsAsync(userId);
            if (customFoodsExist.Any(f => f.Id != food.Id && string.Equals(f.Name?.Trim(), food.Name?.Trim(), StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException($"Food with Name: {food.Name} already exist");

            food.UserId = userId;
            food.Name = food.Name.Trim();

            return await _foodRepository.UpdateCustomFoodAsync(food, userId);
        }

        public async Task<Food> DeleteCustomFoodAsync(Guid id)
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");
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
