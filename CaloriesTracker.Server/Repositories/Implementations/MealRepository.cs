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
                    itemCmd.Parameters.AddWithValue("@DishId", (object?)item.DishId ?? DBNull.Value);
                    itemCmd.Parameters.AddWithValue("@FoodId", (object?)item.FoodId ?? DBNull.Value);
                    itemCmd.Parameters.AddWithValue("@WeightG", (object?)item.WeightG ?? DBNull.Value);

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
            mi.Id      AS MealItemId,
            mi.MealId  AS MealItemMealId,
            mi.DishId, mi.FoodId, mi.WeightG
        FROM Meals m
        LEFT JOIN MealItems mi ON m.Id = mi.MealId
        WHERE m.DiaryDayId = @DiaryDayId
        ORDER BY m.Id, mi.Id";

            using var connection = connectionFactory.Create();
            await connection.OpenAsync();

            using var cmd = new SqlCommand(sql, (SqlConnection)connection);
            cmd.Parameters.AddWithValue("@DiaryDayId", diaryDayId);

            var meals = new Dictionary<long, Meal>();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var mealId = (long)reader["Id"];

                if (!meals.TryGetValue(mealId, out var meal))
                {
                    var mealTypeStr = reader["MealType"] as string;

                    meal = new Meal
                    {
                        Id = mealId,
                        DiaryDayId = (long)reader["DiaryDayId"],
                        MealType = MealService.MapMealTypeFromDb(mealTypeStr ?? "breakfast"),
                        EatenAt = reader["EatenAt"] == DBNull.Value
                            ? (DateTimeOffset?)null
                            : (DateTimeOffset)reader["EatenAt"],
                        Items = new List<MealItem>()
                    };

                    meals.Add(mealId, meal);
                }

                if (reader["MealItemId"] == DBNull.Value)
                    continue;

                meal.Items.Add(new MealItem
                {
                    Id = (long)reader["MealItemId"],
                    MealId = (long)reader["MealItemMealId"],
                    DishId = reader["DishId"] == DBNull.Value ? (long?)null : (long)reader["DishId"],
                    FoodId = reader["FoodId"] == DBNull.Value ? (long?)null : (long)reader["FoodId"],
                    WeightG = reader["WeightG"] == DBNull.Value ? (decimal?)null : (decimal)reader["WeightG"]
                });
            }

            return meals.Values.ToList();
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
            mi.Id AS MealItemId, mi.MealId, mi.DishId, mi.FoodId, mi.WeightG
        FROM Meals m
        LEFT JOIN MealItems mi ON m.Id = mi.MealId
        WHERE m.Id = @MealId
        ORDER BY mi.Id;";

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
                    var mealTypeStr = reader["MealType"] as string;

                    meal = new Meal
                    {
                        Id = (long)reader["Id"],
                        DiaryDayId = (long)reader["DiaryDayId"],
                        MealType = MealService.MapMealTypeFromDb(mealTypeStr ?? "breakfast"),
                        EatenAt = reader["EatenAt"] == DBNull.Value
                            ? (DateTimeOffset?)null
                            : (DateTimeOffset)reader["EatenAt"],
                        Items = new List<MealItem>()
                    };
                }

                if (reader["MealItemId"] == DBNull.Value)
                    continue;

                var item = new MealItem
                {
                    Id = (long)reader["MealItemId"],
                    MealId = (long)reader["MealId"],
                    DishId = reader["DishId"] == DBNull.Value ? (long?)null : (long)reader["DishId"],
                    FoodId = reader["FoodId"] == DBNull.Value ? (long?)null : (long)reader["FoodId"],
                    WeightG = reader["WeightG"] == DBNull.Value ? (decimal?)null : (decimal)reader["WeightG"]
                };

                meal.Items.Add(item);
            }

            return meal;
        }

        public async Task<bool> UpdateMealItemAsync(long itemId, long? dishId, long? foodId, decimal? weightG)
        {
            using var conn = connectionFactory.Create();
            await conn.OpenAsync();

            using (var check = new SqlCommand("SELECT 1 FROM MealItems WHERE Id = @Id", (SqlConnection)conn))
            {
                check.Parameters.Add(new SqlParameter("@Id", System.Data.SqlDbType.BigInt) { Value = itemId });
                if (await check.ExecuteScalarAsync() is null) return false;
            }

            var sets = new List<string>();
            var cmd = new SqlCommand { Connection = (SqlConnection)conn };

            if (dishId.HasValue) { sets.Add("DishId = @DishId"); cmd.Parameters.Add(new SqlParameter("@DishId", System.Data.SqlDbType.BigInt) { Value = dishId.Value }); }
            if (foodId.HasValue) { sets.Add("FoodId = @FoodId"); cmd.Parameters.Add(new SqlParameter("@FoodId", System.Data.SqlDbType.BigInt) { Value = foodId.Value }); }
            if (weightG.HasValue)
            {
                var p = new SqlParameter("@WeightG", System.Data.SqlDbType.Decimal) { Precision = 18, Scale = 2, Value = weightG.Value };
                sets.Add("WeightG = @WeightG");
                cmd.Parameters.Add(p);
            }

            if (sets.Count == 0) return true;

            cmd.CommandText = $"UPDATE MealItems SET {string.Join(", ", sets)} WHERE Id = @Id";
            cmd.Parameters.Add(new SqlParameter("@Id", System.Data.SqlDbType.BigInt) { Value = itemId });

            await cmd.ExecuteNonQueryAsync(); // не залежимо від affected
            return true;
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