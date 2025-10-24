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

        public async Task<NutritionGoal> GetActiveGoal(Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                if (userId == Guid.Empty)
                    throw new ArgumentException("UserId cannot be empty", nameof(userId));

                var sql = @"SELECT TOP 1 * FROM NutritionGoals Where UserId = @UserId AND StartDate <= @Today AND EndDate >= @Today ORDER BY StartDate DESC";

                var today = DateTime.UtcNow.Date;

                var active = await conn.QueryFirstOrDefaultAsync<NutritionGoal>(sql, new
                {
                    UserId = userId,
                    Today = today,
                });

                return active;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting active goal for user {userId}", userId);
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

        public async Task<NutritionGoal?> UpdateGoal(NutritionGoal goal, Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"UPDATE NutritionGoals SET StartDate = @StartDate, EndDate = @EndDate, TargetCalories = @TargetCalories, ProteinG = @ProteinG, FatG = @FatG, CarbG = @CarbG OUTPUT INSERTED.Id, INSERTED.UserId, INSERTED.StartDate, INSERTED.EndDate, INSERTED.TargetCalories, INSERTED.ProteinG, INSERTED.FatG, INSERTED.CarbG
                  WHERE id = @Id AND userId = @UserId";

                var updGoal = await conn.QueryFirstOrDefaultAsync<NutritionGoal>(sql, new
                {
                    goal.Id,
                    UserId = userId,
                    StartDate = goal.StartDate,
                    EndDate = goal.EndDate,
                    TargetCalories = goal.TargetCalories,
                    ProteinG = goal.ProteinG,
                    FatG = goal.FatG,
                    CarbG = goal.CarbG
                });

                return updGoal;

            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while updating goal for user {userId}", userId);
                throw;
            }
        }

    }
}
