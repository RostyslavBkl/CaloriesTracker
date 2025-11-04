using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Diary;
using CaloriesTracker.Server.Repositories.Interfaces;
using Dapper;
using GraphQL.Types.Relay.DataObjects;
using Microsoft.Data.SqlClient;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class DiaryDayRepository : IDiaryDay
    {
        private readonly IDbConnectionFactory _connectionFactory;
        private readonly INutritionGoalRepository _goalRepo;
        private readonly ILogger<FoodRepository> _logger;
        public DiaryDayRepository(IDbConnectionFactory connectionFactory, INutritionGoalRepository goalRepo, ILogger<FoodRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _goalRepo = goalRepo;
            _logger = logger;
        }

        public async Task<DiaryDay> CreateRecord(DiaryDay day, Guid userId)
        {
            // перевірка на пустий айді
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var currGoal = await _goalRepo.GetActiveGoal(userId);

                var sql = @"INSERT INTO DiaryDays (UserId, Date, NutritionGoalId) " +
                    "OUTPUT INSERTED.Id " +
                    "VALUES (@UserId, @Date, @NutritionGoalId)";

                var recordId = await conn.QuerySingleAsync<Guid>(sql, new
                {
                    UserId = userId,
                    Date = DateTime.UtcNow.AddDays(-1),
                    NutritionGoalId = 1
                });

                day.Id = recordId;
                day.UserId = userId;

                return day;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Error while creating record for {userId} at {date}", userId, DateTime.UtcNow.Date);
                throw;
            }
        }
    }
}
