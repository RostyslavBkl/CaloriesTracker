using CaloriesTracker.Server.Data.Ado;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using Dapper;
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

        public async Task<Food?> GetFoodByIdAsync(long id)
        {
            try {

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "SELECT * FROM Foods WHERE id = @Id";
                var food = await connection.QuerySingleOrDefaultAsync<Food>(sql, new {Id = id});

                return food;
            }
            catch(SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting food with ID {id}", id);
                throw;
            }
        }

        /*public async Task<Food?> GetFoodByIdAsync(long Id)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();
        
                using var cmd = new SqlCommand(@"SELECT id, UserId, type, name, weight_g, protein_g, fat_g, carbs_g FROM Foods
                WHERE Id = @id", connection);
                cmd.Parameters.AddWithValue("@id", Id);

                using var reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    var food = new Food
                    {
                        Id = reader.GetInt64("id"),
                        UserId = await reader.IsDBNullAsync("UserId") ? null : reader.GetInt64("UserId"),
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
                _logger.LogError(ex, $"Database error while getting food with ID {Id}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while getting food with ID {Id}");
                throw;
            }
        }*/

        public async Task<List<Food>> GetCustomFoodsAsync(long userId)
        {
            try
            {
                var foods = new List<Food>();

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"SELECT Id, UserId, Type, Name, WeightG, ProteinG, FatG, CarbsG FROM Foods
                WHERE userId = @UserId", connection);
                cmd.Parameters.AddWithValue("@UserId", userId);

                using var reader = await cmd.ExecuteReaderAsync();
                while(await reader.ReadAsync())
                {
                    var newFood = new Food
                    {
                        Id = reader.GetInt64("Id"),
                        UserId = await reader.IsDBNullAsync("UserId") ? null : reader.GetInt64("UserId"),
                        Type = Enum.Parse<Models.Type>(reader.GetString("Type"), true),
                        Name = reader.GetString("Name"),
                        WeightG = reader.IsDBNull("WeightG") ? null : reader.GetDecimal("WeightG"),
                        ProteinG = reader.IsDBNull("ProteinG") ? null : reader.GetDecimal("ProteinG"),
                        FatG = reader.IsDBNull("FatG") ? null : reader.GetDecimal("FatG"),
                        CarbsG = reader.IsDBNull("CarbsG") ? null : reader.GetDecimal("CarbsG"),
                    };
                    foods.Add(newFood);
                }
                return foods;
            }
            catch(SqlException ex)
            {
                _logger.LogError(ex, $"Database error while getting custom foods for user {userId}");
                throw;
            }
        }
        public async Task<Food> CreateCustomFoodAsync(Food food, long userId)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"
                    INSERT INTO Foods (UserId, Type, Name, WeightG, ProteinG, FatG, CarbsG) 
                    VALUES (@UserId, @Type, @Name, @WeightG, @ProteinG, @FatG, @CarbsG )", connection);

                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@Type", food.Type.ToString().ToLower());
                cmd.Parameters.AddWithValue("@Name", food.Name);
                cmd.Parameters.AddWithValue("@WeightG", food.WeightG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ProteinG", food.ProteinG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FatG", food.FatG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CarbsG", food.CarbsG ?? (object)DBNull.Value);

                await cmd.ExecuteNonQueryAsync();

                food.UserId = userId;
                food.Type = Models.Type.custom;

                return food;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, $"Database error while creating custom food for user {userId}");
                throw;
            }
        }

        public async Task<Food> DeleteCustomFoodAsync(long id, long userId)
        {
            try
            {
                var foodToDelete = await GetFoodByIdAsync(id);
                if (foodToDelete == null || foodToDelete.UserId != userId)
                    return null;

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"DELETE From Foods Where id = @Id AND userId = @UserId", connection);

                cmd.Parameters.AddWithValue("@Id", foodToDelete.Id);
                cmd.Parameters.AddWithValue("@UserId", foodToDelete.UserId);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0 ? foodToDelete : null;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, $"Database error while deleting custom food {id} for user {userId}");
                throw;
            }
        }

        public async Task<Food?> UpdateCustomFoodAsync(Food food, long userId)
        {
            try
            {
                var foodToUpdate = await GetFoodByIdAsync(food.Id);
                if (foodToUpdate == null || foodToUpdate.UserId != userId)
                    return null;

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                using var cmd = new SqlCommand(@"UPDATE Foods SET Name = @Name, WeightG = @WeightG, 
                ProteinG = @ProteinG, FatG = @FatG, CarbsG = @CarbsG WHERE Id = @Id AND userId = @UserId", connection);

                cmd.Parameters.AddWithValue("@id", food.Id);
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@Name", food.Name);
                cmd.Parameters.AddWithValue("@WeightG", food.WeightG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ProteinG", food.ProteinG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FatG", food.FatG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CarbsG", food.CarbsG ?? (object)DBNull.Value);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if(rowsAffected > 0)
                {
                    food.UserId = userId;
                    return food;
                }
                return null;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, $"Database error while updating food custom {food.Id} for user {userId}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while updating custom food {food.Id} for user {userId}");
                throw;
            }
        }

        public Task<List<Food>> SearchFoodAsync(string query, long UserId)
        {
            throw new NotImplementedException();
        }

       
    }
}