using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Meal;
using CaloriesTracker.Server.Services;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class MealRepository : IMealRepository
    {
        private readonly IDbConnectionFactory connectionFactory;

        public MealRepository(IDbConnectionFactory connectionFactory)
        {
            this.connectionFactory = connectionFactory;
        }

        public async Task<Guid> CreateMealWithItemsAsync(Meal meal, List<MealItem> items)
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
                mealCmd.Parameters.Add("@DiaryDayId", SqlDbType.UniqueIdentifier).Value = meal.DiaryDayId;
                mealCmd.Parameters.Add("@MealType", SqlDbType.NVarChar, 16).Value = MealService.MapMealTypeToDb(meal.MealType);
                mealCmd.Parameters.Add("@EatenAt", SqlDbType.DateTimeOffset).Value = (object?)meal.EatenAt ?? DBNull.Value;

                var mealId = (Guid)await mealCmd.ExecuteScalarAsync();

                const string itemSql = @"
                    INSERT INTO MealItems (MealId, DishId, FoodId, WeightG)
                    OUTPUT INSERTED.Id
                    VALUES (@MealId, @DishId, @FoodId, @WeightG);";

                foreach (var item in items)
                {
                    item.MealId = mealId;

                    using var itemCmd = new SqlCommand(itemSql, (SqlConnection)connection, (SqlTransaction)transaction);
                    itemCmd.Parameters.Add("@MealId", SqlDbType.UniqueIdentifier).Value = item.MealId;
                    itemCmd.Parameters.Add("@DishId", SqlDbType.UniqueIdentifier).Value = (object?)item.DishId ?? DBNull.Value;
                    itemCmd.Parameters.Add("@FoodId", SqlDbType.UniqueIdentifier).Value = (object?)item.FoodId ?? DBNull.Value;
                    itemCmd.Parameters.Add("@WeightG", SqlDbType.Decimal).Value = (object?)item.WeightG ?? DBNull.Value;

                    item.Id = (Guid)await itemCmd.ExecuteScalarAsync();
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

        public async Task<List<Meal>> GetMealsByDiaryDayAsync(Guid diaryDayId)
        {
            const string sql = @"
                SELECT 
                    m.Id, m.DiaryDayId, m.MealType, m.EatenAt,
                    mi.Id AS MealItemId,
                    mi.MealId AS MealItemMealId,
                    mi.DishId, mi.FoodId, mi.WeightG
                FROM Meals m
                LEFT JOIN MealItems mi ON m.Id = mi.MealId
                WHERE m.DiaryDayId = @DiaryDayId
                ORDER BY m.Id, mi.Id;";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.Add("@DiaryDayId", SqlDbType.UniqueIdentifier).Value = diaryDayId;

            var meals = new Dictionary<Guid, Meal>();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var mealId = (Guid)reader["Id"];
                if (!meals.TryGetValue(mealId, out var meal))
                {
                    meal = new Meal
                    {
                        Id = mealId,
                        DiaryDayId = (Guid)reader["DiaryDayId"],
                        MealType = MealService.MapMealTypeFromDb(reader["MealType"] as string ?? "other"),
                        EatenAt = reader["EatenAt"] == DBNull.Value ? null : (DateTimeOffset)reader["EatenAt"],
                        Items = new List<MealItem>()
                    };
                    meals.Add(mealId, meal);
                }

                if (reader["MealItemId"] == DBNull.Value)
                    continue;

                meal.Items.Add(new MealItem
                {
                    Id = (Guid)reader["MealItemId"],
                    MealId = (Guid)reader["MealItemMealId"],
                    DishId = reader["DishId"] == DBNull.Value ? null : (Guid?)reader["DishId"],
                    FoodId = reader["FoodId"] == DBNull.Value ? null : (Guid?)reader["FoodId"],
                    WeightG = reader["WeightG"] == DBNull.Value ? null : (decimal?)reader["WeightG"]
                });
            }

            return meals.Values.ToList();
        }

        public async Task<bool> DeleteMealAsync(Guid mealId)
        {
            const string sql = @"
                DELETE FROM MealItems WHERE MealId = @MealId;
                DELETE FROM Meals WHERE Id = @MealId;";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.Add("@MealId", SqlDbType.UniqueIdentifier).Value = mealId;

            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<Meal?> GetMealByIdAsync(Guid mealId)
        {
            const string sql = @"
                SELECT 
                    m.Id, m.DiaryDayId, m.MealType, m.EatenAt,
                    mi.Id AS MealItemId, mi.MealId, mi.DishId, mi.FoodId, mi.WeightG
                FROM Meals m
                LEFT JOIN MealItems mi ON m.Id = mi.MealId
                WHERE m.Id = @MealId
                ORDER BY mi.Id;";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.Add("@MealId", SqlDbType.UniqueIdentifier).Value = mealId;

            Meal? meal = null;
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                if (meal == null)
                {
                    meal = new Meal
                    {
                        Id = (Guid)reader["Id"],
                        DiaryDayId = (Guid)reader["DiaryDayId"],
                        MealType = MealService.MapMealTypeFromDb(reader["MealType"] as string ?? "other"),
                        EatenAt = reader["EatenAt"] == DBNull.Value ? null : (DateTimeOffset)reader["EatenAt"],
                        Items = new List<MealItem>()
                    };
                }

                if (reader["MealItemId"] == DBNull.Value)
                    continue;

                meal.Items.Add(new MealItem
                {
                    Id = (Guid)reader["MealItemId"],
                    MealId = (Guid)reader["MealId"],
                    DishId = reader["DishId"] == DBNull.Value ? null : (Guid?)reader["DishId"],
                    FoodId = reader["FoodId"] == DBNull.Value ? null : (Guid?)reader["FoodId"],
                    WeightG = reader["WeightG"] == DBNull.Value ? null : (decimal?)reader["WeightG"]
                });
            }

            return meal;
        }

        public async Task<bool> UpdateMealItemAsync(Guid itemId, Guid? dishId, Guid? foodId, decimal? weightG)
        {
            using var conn = connectionFactory.Create();
            await conn.OpenAsync();

            using (var check = new SqlCommand("SELECT 1 FROM MealItems WHERE Id = @Id", (SqlConnection)conn))
            {
                check.Parameters.Add("@Id", SqlDbType.UniqueIdentifier).Value = itemId;
                if (await check.ExecuteScalarAsync() is null) return false;
            }

            var sets = new List<string>();
            var cmd = new SqlCommand { Connection = (SqlConnection)conn };

            if (dishId.HasValue) { sets.Add("DishId = @DishId"); cmd.Parameters.Add("@DishId", SqlDbType.UniqueIdentifier).Value = dishId.Value; }
            if (foodId.HasValue) { sets.Add("FoodId = @FoodId"); cmd.Parameters.Add("@FoodId", SqlDbType.UniqueIdentifier).Value = foodId.Value; }
            if (weightG.HasValue) { sets.Add("WeightG = @WeightG"); cmd.Parameters.Add("@WeightG", SqlDbType.Decimal).Value = weightG.Value; }

            if (sets.Count == 0) return true;

            cmd.CommandText = $"UPDATE MealItems SET {string.Join(", ", sets)} WHERE Id = @Id";
            cmd.Parameters.Add("@Id", SqlDbType.UniqueIdentifier).Value = itemId;

            await cmd.ExecuteNonQueryAsync();
            return true;
        }

        public async Task<SummaryNutrition> GetMealNutritionAsync(Guid mealId)
        {
            const string sql = @"
                SELECT 
                    mi.WeightG AS ItemWeight,
                    f.WeightG AS FoodBaseWeight,
                    f.ProteinG, f.FatG, f.CarbsG
                FROM MealItems mi
                LEFT JOIN Foods f ON mi.FoodId = f.Id
                WHERE mi.MealId = @MealId;";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.Add("@MealId", SqlDbType.UniqueIdentifier).Value = mealId;

            var summary = new SummaryNutrition();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                if (reader.IsDBNull(1)) continue;

                var itemWeight = reader.GetDecimal(0);
                var foodBaseWeight = reader.GetDecimal(1);
                var protein = reader.GetDecimal(2);
                var fat = reader.GetDecimal(3);
                var carbs = reader.GetDecimal(4);

                if (foodBaseWeight == 0) continue;

                var coeff = itemWeight / foodBaseWeight;
                summary.ProteinG += protein * coeff;
                summary.FatG += fat * coeff;
                summary.CarbsG += carbs * coeff;
            }

            summary.Kcal = summary.ProteinG * 4 + summary.FatG * 9 + summary.CarbsG * 4;
            return summary;
        }

        public async Task<SummaryNutrition> GetDiaryDayNutritionAsync(Guid diaryDayId)
        {
            const string sql = @"
                SELECT 
                    mi.WeightG AS ItemWeight,
                    f.WeightG AS FoodBaseWeight,
                    f.ProteinG, f.FatG, f.CarbsG
                FROM Meals m
                INNER JOIN MealItems mi ON m.Id = mi.MealId
                LEFT JOIN Foods f ON mi.FoodId = f.Id
                WHERE m.DiaryDayId = @DiaryDayId;";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.Add("@DiaryDayId", SqlDbType.UniqueIdentifier).Value = diaryDayId;

            var summary = new SummaryNutrition();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                if (reader.IsDBNull(1)) continue;

                var itemWeight = reader.GetDecimal(0);
                var foodBaseWeight = reader.GetDecimal(1);
                var protein = reader.GetDecimal(2);
                var fat = reader.GetDecimal(3);
                var carbs = reader.GetDecimal(4);

                if (foodBaseWeight == 0) continue;

                var coeff = itemWeight / foodBaseWeight;
                summary.ProteinG += protein * coeff;
                summary.FatG += fat * coeff;
                summary.CarbsG += carbs * coeff;
            }

            summary.Kcal = summary.ProteinG * 4 + summary.FatG * 9 + summary.CarbsG * 4;
            return summary;
        }
    }
}
