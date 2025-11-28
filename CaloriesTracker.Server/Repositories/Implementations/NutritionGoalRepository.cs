using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models.Nutrition;
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

        public async Task<NutritionGoal?> GetActiveGoal(Guid userId)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("UserId cannot be empty", nameof(userId));
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"SELECT * FROM NutritionGoals Where UserId = @UserId and IsActive = 1";
                var active = await conn.QueryFirstOrDefaultAsync<NutritionGoal>(sql, new { UserId = userId });

                return active;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting active goal for user {userId}", userId);
                throw;
            }
        }

        public async Task<List<NutritionGoal>> GetGoalsHistory(Guid userId)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("UserId cannot be empty", nameof(userId));
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"SELECT * FROM NutritionGoals Where UserId = @UserId";
                var history = (await conn.QueryAsync<NutritionGoal>(sql, new { UserId = userId })).ToList();

                return history;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting history of goals for user {userId}", userId);
                throw;
            }
        }

        public async Task<NutritionGoal> SetGoal(NutritionGoal goal, Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"INSERT INTO NutritionGoals (UserId, StartDate, EndDate, TargetCalories, ProteinG, FatG, CarbG, IsActive) OUTPUT INSERTED.Id VALUES (@UserId, @StartDate, @EndDate, @TargetCalories, @ProteinG, @FatG, @CarbG, @IsActive)";
                var goalId = await conn.QuerySingleAsync<Guid>(sql, new
                {
                    UserId = userId,
                    StartDate = goal.StartDate,
                    EndDate = goal.EndDate,
                    TargetCalories = goal.TargetCalories,
                    ProteinG = goal.ProteinG,
                    FatG = goal.FatG,
                    CarbG = goal.CarbG,
                    IsActive = goal.isActive
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

        public async Task<NutritionGoal> UpdateGoal(NutritionGoal goal, Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var activeGoal = await GetActiveGoal(userId);
                if (activeGoal == null)
                    throw new InvalidOperationException($"Active goal not found for user");

                var sql = @"UPDATE NutritionGoals " +
                    "SET StartDate = @StartDate, " +
                    "EndDate = @EndDate, " +
                    "TargetCalories = @TargetCalories, " +
                    "ProteinG = @ProteinG, " +
                    "FatG = @FatG, " +
                    "CarbG = @CarbG " +
                    "OUTPUT INSERTED.*  " +
                    "WHERE id = @Id AND userId = @UserId";

                var updGoal = await conn.QueryFirstOrDefaultAsync<NutritionGoal>(sql, new
                {
                    Id = activeGoal.Id,
                    UserId = userId,
                    StartDate = activeGoal?.StartDate,
                    EndDate = goal.EndDate ?? activeGoal?.EndDate,
                    TargetCalories = goal.TargetCalories > 0 ? goal.TargetCalories : activeGoal?.TargetCalories,
                    ProteinG = goal.ProteinG,
                    FatG = goal.FatG,
                    CarbG = goal.CarbG,
                });

                if (updGoal == null)
                    throw new InvalidOperationException($"Failed to update goal {goal.Id}");

                return updGoal;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while updating goal for user {userId}", userId);
                throw;
            }
        }

        public async Task<NutritionGoal> DeactivateGoal(Guid id, Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"UPDATE NutritionGoals " +
                    "SET EndDate = @EndDate, IsActive = 0 " +
                    "OUTPUT INSERTED.* " +
                    "WHERE Id = @Id AND UserId = @UserId";

                var deactivate = await conn.QueryFirstOrDefaultAsync<NutritionGoal>(sql, new
                {
                    Id = id,
                    UserId = userId,
                    EndDate = DateTime.UtcNow.Date
                });

                if (deactivate == null)
                    throw new InvalidOperationException($"Goal: {id} not found for user {userId}");

                return deactivate;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while deactivating goal: {id} for user {userId}", id, userId);
                throw;
            }
        }
    }
}
