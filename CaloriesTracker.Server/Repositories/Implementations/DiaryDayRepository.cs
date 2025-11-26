using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models.Diary;
using CaloriesTracker.Server.Models.Meal;
using CaloriesTracker.Server.Models.Nutrition;
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

                //var sql = @"SELECT DiaryDays.Id AS DiaryDayId, DiaryDays.UserId, DiaryDays.Date, " +
                //    "NutritionGoals.Id AS NutritionGoalId, " +
                //    "NutritionGoals.TargetCalories, NutritionGoals.ProteinG, NutritionGoals.FatG, NutritionGoals.CarbG " +
                //    "FROM DiaryDays " +
                //    "INNER JOIN NutritionGoals ON DiaryDays.NutritionGoalId = NutritionGoals.Id " +
                //    "WHERE Date = @Date AND DiaryDays.UserId = @UserId";

                var sql = @"
                SELECT 
                    d.Id AS DiaryDayId, d.UserId, d.Date, 
                    n.Id AS NutritionGoalId, n.TargetCalories, n.ProteinG, n.FatG, n.CarbG, 
                    m.Id As Id, m.MealType, m.EatenAt,
                    mi.Id AS Id,mi.DishId, mi.FoodId, mi.WeightG
                FROM DiaryDays d
                LEFT JOIN NutritionGoals n ON d.NutritionGoalId = n.Id
                LEFT JOIN Meals m ON m.DiaryDayId = d.Id
                LEFT JOIN MealItems mi ON mi.MealId = m.Id
                WHERE d.UserId = @UserId AND d.Date = @Date
                ORDER BY m.Id, mi.Id;";

                var diaryDict = new Dictionary<Guid, DiaryDayDetails>();
                var mealDict = new Dictionary<Guid, Meal>();

                var result = await conn.QueryAsync<DiaryDayDetails, NutritionGoalSummary, Meal, MealItem, DiaryDayDetails>(
                    sql,
                    (diary, goal, meal, item) =>
                    {
                        if(!diaryDict.TryGetValue(diary.DiaryDayId, out var currentDay))
                        {
                            currentDay = diary;
                            currentDay.nutritionGoalSummary = goal;
                            currentDay.Meals = new List<Meal>();
                            diaryDict.Add(currentDay.DiaryDayId, currentDay); 
                        }
                        if(meal != null && !mealDict.ContainsKey(meal.Id))
                        {
                            meal.Items = new List<MealItem>();
                            currentDay.Meals.Add(meal);
                            mealDict.Add(meal.Id, meal);
                        }
                        if (item != null && meal != null)
                            mealDict[meal.Id].Items.Add(item);
                        return currentDay;
                    },
                    new
                    {
                        UserId = userId,
                        Date = date
                    },
                    splitOn: "NutritionGoalId, Id, Id"
                    );
                return diaryDict.Values.FirstOrDefault();
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Error while getting record for {userId} by {date}", userId, date);
                throw;
            }
        }
    }
}
