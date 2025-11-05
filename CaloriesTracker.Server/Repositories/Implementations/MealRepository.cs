using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Meal;
using CaloriesTracker.Server.Services;
using Microsoft.Data.SqlClient;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class MealRepository : IMealRepository
    {
        private readonly IDbConnectionFactory connectionFactory;

        public MealRepository(IDbConnectionFactory connectionFactory)
        {
            this.connectionFactory = connectionFactory;
        }

        public async Task<long> CreateMealWithItemsAsync(Meal meal, List<MealItem> items)
        {
            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var transaction = connection.BeginTransaction();

            try
            {
                const string mealSql = @"
                    INSERT INTO Meals (DiaryDayId, MealType, EatenAt)
                    OUTPUT INSERTED.Id
                    VALUES (@DiaryDayId, @MealType, @EatenAt);";

                using var mealCmd = new SqlCommand(mealSql, (SqlConnection)connection, (SqlTransaction)transaction);
                mealCmd.Parameters.AddWithValue("@DiaryDayId", meal.DiaryDayId);
                mealCmd.Parameters.AddWithValue("@MealType", MealService.MapMealTypeToDb(meal.MealType));
                mealCmd.Parameters.AddWithValue("@EatenAt", (object?)meal.EatenAt ?? DBNull.Value);

                long mealId = Convert.ToInt64(await mealCmd.ExecuteScalarAsync());

                const string itemSql = @"
                    INSERT INTO MealItems (MealId, DishId, FoodId, WeightG)
                    OUTPUT INSERTED.Id
                    VALUES (@MealId, @DishId, @FoodId, @WeightG);";

                foreach (var item in items)
                {
                    using var itemCmd = new SqlCommand(itemSql, (SqlConnection)connection, (SqlTransaction)transaction);
                    item.MealId = mealId;

                    itemCmd.Parameters.AddWithValue("@MealId", item.MealId);
                    itemCmd.Parameters.AddWithValue("@DishId", item.DishId);
                    itemCmd.Parameters.AddWithValue("@FoodId", item.FoodId);
                    itemCmd.Parameters.AddWithValue("@WeightG", item.WeightG);

                    item.Id = Convert.ToInt64(await itemCmd.ExecuteScalarAsync());
                }

                transaction.Commit();
                return mealId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<List<Meal>> GetMealsByDiaryDayAsync(long diaryDayId)
        {
            const string sql = @"
                SELECT 
                    m.Id, m.DiaryDayId, m.MealType, m.EatenAt,
                    mi.Id, mi.MealId, mi.DishId, mi.FoodId, mi.WeightG
                FROM Meals m
                LEFT JOIN MealItems mi ON m.Id = mi.MealId
                WHERE m.DiaryDayId = @DiaryDayId
                ORDER BY m.Id";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.AddWithValue("@DiaryDayId", diaryDayId);

            var mealsDict = new Dictionary<long, Meal>();

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                long mealId = reader.GetInt64(0);

                if (!mealsDict.ContainsKey(mealId))
                {
                    mealsDict[mealId] = new Meal
                    {
                        Id = mealId,
                        DiaryDayId = reader.GetInt64(1),
                        MealType = MealService.MapMealTypeFromDb(reader.GetString(2)),
                        EatenAt = reader.GetDateTimeOffset(3),
                        Items = new List<MealItem>()
                    };
                }

                if (!reader.IsDBNull(4))
                {
                    mealsDict[mealId].Items.Add(new MealItem
                    {
                        Id = reader.GetInt64(4),
                        MealId = reader.GetInt64(5),
                        DishId = reader.GetInt64(6),
                        FoodId = reader.GetInt64(7),
                        WeightG = reader.GetDecimal(8)
                    });
                }
            }
            return mealsDict.Values.ToList();
        }

        public async Task<bool> DeleteMealAsync(long mealId)
        {
            const string sql = @"
                DELETE FROM MealItems WHERE MealId = @MealId;
                DELETE FROM Meals WHERE Id = @MealId;";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.AddWithValue("@MealId", mealId);

            int rowsAffected = await cmd.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }

        public async Task<Meal?> GetMealByIdAsync(long mealId)
        {
            const string sql = @"
                SELECT 
                    m.Id, m.DiaryDayId, m.MealType, m.EatenAt,
                    mi.Id, mi.MealId, mi.DishId, mi.FoodId, mi.WeightG
                FROM Meals m
                LEFT JOIN MealItems mi ON m.Id = mi.MealId
                WHERE m.Id = @MealId
                ORDER BY mi.Id";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.AddWithValue("@MealId", mealId);

            Meal? meal = null;

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                if (meal == null)
                {
                    meal = new Meal
                    {
                        Id = reader.GetInt64(0),
                        DiaryDayId = reader.GetInt64(1),
                        MealType = MealService.MapMealTypeFromDb(reader.GetString(2)),
                        EatenAt = reader.GetDateTimeOffset(3),
                        Items = new List<MealItem>()
                    };
                }

                meal.Items.Add(new MealItem
                {
                    Id = reader.GetInt64(4),
                    MealId = reader.GetInt64(5),
                    DishId = reader.GetInt64(6),
                    FoodId = reader.GetInt64(7),
                    WeightG = reader.GetDecimal(8)
                });
            }

            return meal;
        }

        public async Task<bool> UpdateMealItemAsync(long itemId, long? dishId, long? foodId, decimal? weightG)
        {
            const string sql = @"
                UPDATE MealItems
                SET 
                    DishId = COALESCE(@DishId, DishId),
                    FoodId = COALESCE(@FoodId, FoodId),
                    WeightG = COALESCE(@WeightG, WeightG)
                WHERE Id = @ItemId";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();
            using var cmd = new SqlCommand(sql, (SqlConnection)connection);

            cmd.Parameters.AddWithValue("@ItemId", itemId);
            cmd.Parameters.AddWithValue("@DishId", (object?)dishId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@FoodId", (object?)foodId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@WeightG", (object?)weightG ?? DBNull.Value);

            int affected = await cmd.ExecuteNonQueryAsync();
            return affected > 0;
        }

        public async Task<SummaryNutrition> GetMealNutritionAsync(long mealId)
        {
            const string sql = @"
                SELECT 
                    mi.WeightG AS ItemWeight,
                    f.WeightG AS FoodBaseWeight,
                    f.ProteinG, f.FatG, f.CarbsG
                FROM MealItems mi
                LEFT JOIN Foods f ON mi.FoodId = f.Id
                WHERE mi.MealId = @MealId";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();
            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.AddWithValue("@MealId", mealId);

            var summary = new SummaryNutrition();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                if (reader.IsDBNull(1))
                    continue;

                var itemWeight = reader.GetDecimal(0);
                var foodBaseWeight = reader.GetDecimal(1);
                var proteinPerBase = reader.GetDecimal(2);
                var fatPerBase = reader.GetDecimal(3);
                var carbsPerBase = reader.GetDecimal(4);

                if (foodBaseWeight == 0)
                    continue;

                var coeff = itemWeight / foodBaseWeight;

                var protein = proteinPerBase * coeff;
                var fat = fatPerBase * coeff;
                var carbs = carbsPerBase * coeff;

                summary.ProteinG += protein;
                summary.FatG += fat;
                summary.CarbsG += carbs;
                summary.Kcal += protein * 4 + fat * 9 + carbs * 4;
            }

            return summary;
        }

        public async Task<SummaryNutrition> GetDiaryDayNutritionAsync(long diaryDayId)
        {
            const string sql = @"
                SELECT 
                    mi.WeightG AS ItemWeight,
                    f.WeightG AS FoodBaseWeight,
                    f.ProteinG, f.FatG, f.CarbsG
                FROM Meals m
                INNER JOIN MealItems mi ON m.Id = mi.MealId
                LEFT JOIN Foods f ON mi.FoodId = f.Id
                WHERE m.DiaryDayId = @DiaryDayId";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();
            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.AddWithValue("@DiaryDayId", diaryDayId);

            var summary = new SummaryNutrition();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                if (reader.IsDBNull(1))
                    continue;

                var itemWeight = reader.GetDecimal(0);
                var foodBaseWeight = reader.GetDecimal(1);
                var proteinPerBase = reader.GetDecimal(2);
                var fatPerBase = reader.GetDecimal(3);
                var carbsPerBase = reader.GetDecimal(4);

                if (foodBaseWeight == 0)
                    continue;

                var coeff = itemWeight / foodBaseWeight;

                var protein = proteinPerBase * coeff;
                var fat = fatPerBase * coeff;
                var carbs = carbsPerBase * coeff;

                summary.ProteinG += protein;
                summary.FatG += fat;
                summary.CarbsG += carbs;
                summary.Kcal += protein * 4 + fat * 9 + carbs * 4;
            }

            return summary;
        }
    }
}