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

        public async Task<DiaryDay> CreateRecord(Guid userId)
        {
            // перевірка на пустий айді
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var currGoal = await _goalRepo.GetActiveGoal(userId);

                var sql = @"INSERT INTO DiaryDays (UserId, Date, NutritionGoalId) " +
                    "OUTPUT INSERTED.* " +
                    "VALUES (@UserId, @Date, @NutritionGoalId)";

                var diaryDay = await conn.QuerySingleAsync<DiaryDay>(sql, new
                {
                    UserId = userId,
                    Date = DateTime.Now.Date,
                    NutritionGoalId = currGoal.Id
                });

             
                return diaryDay;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Error while creating record for {userId} at {date}", userId, DateTime.UtcNow.Date);
                throw;
            }
        }

        public async Task<DiaryDayDetails?> GetRecordByDate(DateTime date, Guid userId)
        {
            try
            {
                using var conn = _connectionFactory.Create();
                await conn.OpenAsync();

                var sql = @"SELECT DiaryDays.Id AS DiaryDayId, DiaryDays.UserId, DiaryDays.Date, " +
                    "NutritionGoals.TargetCalories, NutritionGoals.ProteinG, NutritionGoals.FatG, NutritionGoals.CarbG, " +
                    "NutritionGoals.Id AS NutritionGoalId " +
                    "FROM DiaryDays " +
                    "INNER JOIN NutritionGoals ON DiaryDays.NutritionGoalId = NutritionGoals.Id " +
                    "WHERE Date = @Date AND DiaryDays.UserId = @UserId";

                var diaryDayDetails = await conn.QueryFirstOrDefaultAsync<DiaryDayDetails>(sql, new
                {
                    UserId = userId,
                    Date = date
                });
                return diaryDayDetails;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Error while getting record for {userId} by {date}", userId, date);
                throw;
            }
        }
    }
}
