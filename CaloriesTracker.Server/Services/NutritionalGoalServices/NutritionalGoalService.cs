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

        // повертає активну ціль
        public async Task<NutritionGoal?> GetActiveGoal()
        {
            var userId = await GetUserId();
            if(userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            var goal = await _goalRepo.GetActiveGoal(userId);
        
            if(goal != null)
            {
                if (goal.isActive == false)
                    throw new Exception("Goal is not active anymore");
            }
         

            return goal;
        }

        public async Task<NutritionGoal> SetGoal(NutritionGoal goal)
        {
            var userId = await GetUserId();
            // отримати активну ціль
            var currGoal = await GetActiveGoal();
            if (currGoal != null)
            {
                currGoal.EndDate ??= DateTime.UtcNow.Date;
                currGoal.isActive = false;
                await _goalRepo.UpdateGoal(currGoal, userId);
            }

            ValidateGoal(goal);
            goal.StartDate ??= DateTime.UtcNow.Date;
            goal.isActive = true;

            await CalculateNutr(goal);
            return await _goalRepo.SetGoal(goal, userId);
        }

        public async Task<NutritionGoal> UpdateGoal(NutritionGoal goal)
        {
            ValidateGoal(goal);

            var userId = await GetUserId();

            // Втановити аби уникнути нулів в айді
            goal.UserId = userId;

            Console.WriteLine($"userId = {userId}, goal.UserId = {goal.UserId}");

            await CalculateNutr(goal);

            var upd = await _goalRepo.UpdateGoal(goal, userId);
            if (upd == null)
                throw new UnauthorizedAccessException("Goal not found or access denied");


            return upd;
        }

        private async Task<NutritionGoal> CalculateNutr(NutritionGoal goal)
        {
            goal.ProteinG = (goal.TargetCalories * 0.20m) / 4m;
            goal.FatG = (goal.TargetCalories * 0.30m) / 9m;
            goal.CarbG = (goal.TargetCalories * 0.50m) / 4m;

            return goal;
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
