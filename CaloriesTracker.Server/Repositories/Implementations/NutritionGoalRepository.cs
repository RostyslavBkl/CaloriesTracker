using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class NutritionGoalRepository : INutritionGoalRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        private readonly ILogger<NutritionGoalRepository> _logger;
        public NutritionGoalRepository(IDbConnectionFactory connectionFactory, ILogger<NutritionGoalRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _logger = logger;
        }

        public async Task<NutritionGoal> GetGoalById(Guid id)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"SELECT * FROM NutritionGoals Where id = @Id";

                var goal = await conn.QuerySingleOrDefaultAsync<NutritionGoal>(sql, new
                {
                    Id = id
                });

                return goal;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting goals by id: {Id}", id);
                throw;
            }
        }

        public async Task<NutritionGoal> SetGoal(NutritionGoal goal, Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"INSERT INTO NutritionGoals (UserId, StartDate, EndDate, TargetCalories, ProteinG, FatG, CarbG) OUTPUT INSERTED.Id VALUES (@UserId, @StartDate, @EndDate, @TargetCalories, @ProteinG, @FatG, @CarbG)";
                var goalId = await conn.QuerySingleAsync<Guid>(sql, new
                {
                    UserId = userId,
                    StartDate = goal.StartDate,
                    EndDate = goal.EndDate,
                    TargetCalories = goal.TargetCalories,
                    ProteinG = goal.ProteinG,
                    FatG = goal.FatG,
                    CarbG = goal.CarbG,
                });

                goal.Id = goalId;
                goal.UserId = userId;

                return goal;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while setting goals for user {userId}", userId);
                throw;
            }
        }

    }
}
