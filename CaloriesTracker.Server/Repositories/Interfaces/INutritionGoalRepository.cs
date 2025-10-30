using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Repositories.Interfaces
{
    public interface INutritionGoalRepository
    {
        Task<NutritionGoal> GetGoal(Guid id, Guid userId);
        Task<NutritionGoal> GetActiveGoal(Guid userId);
        Task<List<NutritionGoal>> GetGoalsHistory(Guid userId);
        Task<NutritionGoal> SetGoal(NutritionGoal goal, Guid userId);
        Task<NutritionGoal> UpdateGoal(NutritionGoal goal, Guid userId);
        Task<NutritionGoal> DeactivateGoal(Guid id, Guid userId);

    }
}
