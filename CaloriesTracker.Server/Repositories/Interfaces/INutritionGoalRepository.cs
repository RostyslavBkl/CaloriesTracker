using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Repositories.Interfaces
{
    public interface INutritionGoalRepository
    {
        Task<NutritionGoal> GetGoalById(Guid id);

        Task<NutritionGoal> SetGoal(NutritionGoal goal, Guid userId);
    }
}
