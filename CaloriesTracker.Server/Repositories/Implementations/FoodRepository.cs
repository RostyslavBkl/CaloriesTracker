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
        public FoodRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Food?> GetFoodByIdAsync(long Id)
        {
            //Food? food = null;
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
                        WeightG = await reader.IsDBNullAsync("weight_g") ? null : reader.GetDecimal("weight_g"),
                        ProteinG = await reader.IsDBNullAsync("protein_g") ? null : reader.GetDecimal("protein_g"),
                        FatG = await reader.IsDBNullAsync("fat_g") ? null : reader.GetDecimal("fat_g"),
                        CarbsG = await reader.IsDBNullAsync("carbs_g") ? null : reader.GetDecimal("carbs_g"),
                    };
                    return food;
                }
                return null;
            }
            catch (Exception ex)
            {
                // TODO Right catch block
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }


        public Task<Food> CreateCustomFoodAsync(Food food, long UserId)
        {
            throw new NotImplementedException();
        }

        public Task<Food> DeleteCustomFoodAsync(long Id, long UserId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Food>> GetCustomFoodsAsync(long UserId)
        {
            throw new NotImplementedException();
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
