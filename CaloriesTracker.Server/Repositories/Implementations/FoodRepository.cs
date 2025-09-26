using CaloriesTracker.Server.Data.Ado;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class FoodRepository : IFoodRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        private readonly ILogger<FoodRepository> _logger;
        public FoodRepository(IDbConnectionFactory connectionFactory, ILogger<FoodRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _logger = logger;
        }

        public async Task<Food?> GetFoodByIdAsync(long Id)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"SELECT id, user_id, type, name, weight_g, protein_g, fat_g, carbs_g FROM Foods
                WHERE Id = @id", connection);
                cmd.Parameters.AddWithValue("@id", Id);

                using var reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    var food = new Food
                    {
                        Id = reader.GetInt64("id"),
                        UserId = await reader.IsDBNullAsync("user_id") ? null : reader.GetInt64("user_id"),
                        Type = Enum.Parse<Models.Type>(reader.GetString("type"), true),
                        Name = reader.GetString("name"),
                        WeightG = reader.IsDBNull("weight_g") ? null : reader.GetDecimal("weight_g"),
                        ProteinG =  reader.IsDBNull("protein_g") ? null : reader.GetDecimal("protein_g"),
                        FatG =  reader.IsDBNull("fat_g") ? null : reader.GetDecimal("fat_g"),
                        CarbsG =  reader.IsDBNull("carbs_g") ? null : reader.GetDecimal("carbs_g"),
                    };
                    return food;
                }
                return null;
            }
            catch(SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting food with ID {FoodId}", Id);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while getting food with ID {FoodId}", Id);
                throw;
            }
        }

        public async Task<List<Food>> GetCustomFoodsAsync(long UserId)
        {
            try
            {
                var foods = new List<Food>();

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"SELECT id, user_id, type, name, weight_g, protein_g, fat_g, carbs_g FROM Foods
                WHERE UserId = @user_id", connection);
                cmd.Parameters.AddWithValue("@user_id", UserId);

                using var reader = await cmd.ExecuteReaderAsync();
                while(await reader.ReadAsync())
                {
                    var newFood = new Food
                    {
                        Id = reader.GetInt64("id"),
                        UserId = await reader.IsDBNullAsync("user_id") ? null : reader.GetInt64("user_id"),
                        Type = Enum.Parse<Models.Type>(reader.GetString("type"), true),
                        Name = reader.GetString("name"),
                        WeightG = reader.IsDBNull("weight_g") ? null : reader.GetDecimal("weight_g"),
                        ProteinG = reader.IsDBNull("protein_g") ? null : reader.GetDecimal("protein_g"),
                        FatG = reader.IsDBNull("fat_g") ? null : reader.GetDecimal("fat_g"),
                        CarbsG = reader.IsDBNull("carbs_g") ? null : reader.GetDecimal("carbs_g"),
                    };
                    foods.Add(newFood);
                }
                return null;
            }
            catch(SqlException ex)
            {

            }
        }
        public async Task<Food> CreateCustomFoodAsync(Food food, long UserId)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"
                    INSERT INTO Foods (user_id, type, name, weight_g, protein_g, fat_g, carbs_g) 
                    VALUES (@User_id, @Type, @Name, @WeightG, @ProteinG, @FatG, @CarbsG )", connection);

                cmd.Parameters.AddWithValue("@user_id", UserId);
                cmd.Parameters.AddWithValue("@type", food.Type.ToString().ToLower());
                cmd.Parameters.AddWithValue("@name", food.Name);
                cmd.Parameters.AddWithValue("@weight_g", food.WeightG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@protein_g", food.ProteinG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@fat_g", food.FatG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@carbs_g", food.CarbsG ?? (object)DBNull.Value);

                await cmd.ExecuteNonQueryAsync();

                food.UserId = UserId;
                food.Type = Models.Type.custom;

                return food;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while creating custom food for user {UserId}", UserId);
                throw;
            }
        }

        public async Task<Food> DeleteCustomFoodAsync(long Id, long UserId)
        {
            try
            {
                var foodToDelete = await GetFoodByIdAsync(Id);
                if (foodToDelete == null || foodToDelete.UserId != UserId)
                    return null;

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"DELETE From Foods Where Id = @id AND UserId = @user_id", connection);

                cmd.Parameters.AddWithValue("@id", Id);
                cmd.Parameters.AddWithValue("@user_id", UserId);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0 ? foodToDelete : null;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while deleting custom food {FoodId} for user {UserId}", Id, UserId);
                throw;
            }
        }

        public Task<List<Food>> SearchFoodAsync(string query, long UserId)
        {
            throw new NotImplementedException();
        }

        public Task<Food> UpdateCustomFoodAsync(Food food, long UserId)
        {
            throw new NotImplementedException();
        }
    }
}