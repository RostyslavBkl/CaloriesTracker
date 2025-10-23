using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CaloriesTracker.Server.Services.NutritionalGoalServices
{
    public class NutritionalGoalService
    {
        private readonly INutritionGoalRepository _goalRepo;
        private readonly IHttpContextAccessor _http;
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenRepository _jwt;

        public NutritionalGoalService(INutritionGoalRepository goalRepo, IHttpContextAccessor http, IUserRepository userRepository, JwtTokenRepository jwt)
        {
            _goalRepo = goalRepo;
            _http = http;
            _userRepository = userRepository;
            _jwt = jwt;
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

        public async Task<NutritionGoal> GetGoalById(Guid id)
        {
            var goal = await _goalRepo.GetGoalById(id);
            return goal;
        }

        public async Task<NutritionGoal> SetGoal(NutritionGoal goal)
        {
            ValidateGoal(goal);

            var userId = await GetUserId();

            goal.ProteinG = (decimal)(goal.TargetCalories * 0.20) / 4;
            goal.FatG = (decimal)(goal.TargetCalories * 0.30) / 9;
            goal.CarbG = (decimal)(goal.TargetCalories * 0.50) / 4;

            return await _goalRepo.SetGoal(goal, userId);
        }

        private void ValidateGoal(NutritionGoal goal)
        {
            // Validate Dates
            if (goal.TargetCalories <= 0)
                throw new ArgumentException("TargetCalories must be positive", nameof(goal.TargetCalories));
            if (goal.ProteinG.HasValue && goal.ProteinG.Value < 0)
                throw new ArgumentException("Proteins must be positive", nameof(goal.ProteinG));
            if (goal.FatG.HasValue && goal.FatG.Value < 0)
                throw new ArgumentException("Fats must be positive", nameof(goal.FatG));
            if (goal.CarbG.HasValue && goal.CarbG.Value < 0)
                throw new ArgumentException("Carbs must be positive", nameof(goal.CarbG));
        }
    }
}
