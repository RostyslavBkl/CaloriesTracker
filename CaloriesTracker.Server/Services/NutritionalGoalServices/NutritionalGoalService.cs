using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Nutrition;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Repositories.Interfaces;

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

        public async Task<List<NutritionGoal>> GetGoalsHistory()
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            var history = await _goalRepo.GetGoalsHistory(userId);

            return history;
        }

        public async Task<NutritionGoal?> GetActiveGoal()
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            var goal = await _goalRepo.GetActiveGoal(userId);

            return goal;
        }

        public async Task<NutritionGoal> SetGoal(NutritionGoal goal, Plan plan)
        {
            var userId = await GetUserId();
            var currGoal = await GetActiveGoal();

            goal.StartDate ??= DateTime.UtcNow.Date;
            if (goal.StartDate > DateTime.UtcNow.Date)
                throw new ArgumentException("The goal cannot be set for the future");

            ValidateGoal(goal);
            await CalculateNutritionPlan(goal, plan);

            if (currGoal != null)
                await _goalRepo.DeactivateGoal(currGoal.Id, userId);

            goal.isActive = true;
            return await _goalRepo.SetGoal(goal, userId);
        }

        public async Task<NutritionGoal> UpdateGoal(NutritionGoal goal, Plan plan)
        {
            var userId = await GetUserId();
            await CalculateNutritionPlan(goal, plan);

            ValidateGoal(goal);

            var upd = await _goalRepo.UpdateGoal(goal, userId);

            return upd;
        }

        private async Task CalculateNutritionPlan(NutritionGoal goal, Plan plan)
        {
            switch (plan)
            {
                case Plan.Balanced:
                    goal.ProteinG = (goal.TargetCalories * 0.20m) / 4m;
                    goal.FatG = (goal.TargetCalories * 0.30m) / 9m;
                    goal.CarbG = (goal.TargetCalories * 0.50m) / 4m;
                    break;
                case Plan.HighProtein:
                    goal.ProteinG = (goal.TargetCalories * 0.40m) / 4m;
                    goal.FatG = (goal.TargetCalories * 0.30m) / 9m;
                    goal.CarbG = (goal.TargetCalories * 0.30m) / 4m;
                    break;
                case Plan.LowCarb:
                    goal.ProteinG = (goal.TargetCalories * 0.30m) / 4m;
                    goal.FatG = (goal.TargetCalories * 0.50m) / 9m;
                    goal.CarbG = (goal.TargetCalories * 0.20m) / 4m;
                    break;
                case Plan.HighCarb:
                    goal.ProteinG = (goal.TargetCalories * 0.20m) / 4m;
                    goal.FatG = (goal.TargetCalories * 0.20m) / 9m;
                    goal.CarbG = (goal.TargetCalories * 0.60m) / 4m;
                    break;
                case Plan.Custom:
                    ValidateCustomPlan(goal);
                    break;
                default:
                    throw new ArgumentException($"Unknown name of: {plan}");
            }
        }

        private void ValidateCustomPlan(NutritionGoal goal)
        {
            if (goal.ProteinG.HasValue && goal.FatG.HasValue && goal.CarbG.HasValue)
            {
                var totalKcal = (goal.ProteinG.Value * 4m) + (goal.FatG.Value * 9m)
                    + (goal.CarbG.Value * 4m);

                // дозволяємо 10% відхилення
                var tolerance = goal.TargetCalories * 0.10m;
                var diff = Math.Abs(totalKcal - goal.TargetCalories);

                if (diff > tolerance)
                    throw new ArgumentException($"The total amount of calories: {totalKcal} kcal based on nutritions: Protein({goal.ProteinG}g), Fat({goal.FatG}g), Carb({goal.CarbG}g) don't match with TargetCalories: {goal.TargetCalories} kcal. Difference: {diff} kcal", nameof(goal));
            }
        }


        private void ValidateGoal(NutritionGoal goal)
        {
            // валідація калорій і бжв
            if (goal.TargetCalories <= 0)
                throw new ArgumentException("TargetCalories must be positive", nameof(goal.TargetCalories));
            if (goal.TargetCalories < 1000 || goal.TargetCalories > 3500)
                throw new ArgumentException("Target calories must be in the range 1000-3500 kcal per day", nameof(goal.TargetCalories));
            if (goal.ProteinG.HasValue && goal.ProteinG.Value < 0)
                throw new ArgumentException("Proteins must be positive", nameof(goal.ProteinG));
            if (goal.FatG.HasValue && goal.FatG.Value < 0)
                throw new ArgumentException("Fats must be positive", nameof(goal.FatG));
            if (goal.CarbG.HasValue && goal.CarbG.Value < 0)
                throw new ArgumentException("Carbs must be positive", nameof(goal.CarbG));

            var today = DateTime.UtcNow.Date;

            // валідація дати(початок)
            if (goal.StartDate.HasValue)
            {
                if (goal.StartDate.Value < today)
                    throw new ArgumentException("StartDate cannot be in the past");
            }

            // валідація дати(кінець)
            if (goal.EndDate.HasValue && goal.StartDate.HasValue)
            {
                if (goal.EndDate.Value <= goal.StartDate.Value)
                    throw new ArgumentException("The difference between EndDate and StartDate must be at least one day");
            }
        }
    }
}
