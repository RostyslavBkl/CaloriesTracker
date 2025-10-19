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

        public async Task<Food> GetFoodByIdAsync(Guid id)
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

        public async Task<List<Food>> GetCustomFoodsAsync(Guid userId)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "SELECT * FROM Foods WHERE userId = @UserId";
                var foods = (await connection.QueryAsync<Food>(sql, new { UserId = userId })).ToList();

                return foods;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while getting custom foods for user {userId}", userId);
                throw;
            }
        }

        public async Task<Food> CreateCustomFoodAsync(Food food, Guid userId)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "INSERT INTO Foods (UserId, Type, Name, WeightG, ProteinG, FatG, CarbsG) VALUES (@UserId, @Type, @Name, @WeightG, @ProteinG, @FatG, @CarbsG )";

                await connection.ExecuteAsync(sql, new
                {
                    UserId = userId,
                    Type = food.Type.ToString(),
                    Name = food.Name,
                    WeightG = food.WeightG,
                    ProteinG = food.ProteinG,
                    FatG = food.FatG,
                    CarbsG = food.CarbsG,
                });

                food.UserId = userId;
                food.Type = Models.Type.custom;

                return food;
            }
            catch(SqlException ex)
            {
                _logger.LogError(ex, "Database error while creating custom food for user {userId}", userId);
                throw;
            }
        }

        public async Task<Food?> DeleteCustomFoodAsync(Guid id, Guid userId)
        {
            try
            {
                var foodToDelete = await GetFoodByIdAsync(id);
                if (foodToDelete == null || foodToDelete.UserId != userId)
                    return null;

                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "DELETE FROM Foods WHERE id = @Id AND userId = @UserId";

                var rowsAffected = await connection.ExecuteAsync(sql, new {Id = id, UserId = userId});
                if (rowsAffected == 0)
                    return null;

                return foodToDelete;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while deleting custom food {id} for user {userId}", id, userId);
                throw;
            }
        }

        public async Task<Food> UpdateCustomFoodAsync(Food food, Guid userId)
        {
            try
            {
 
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "UPDATE Foods " +
                    "SET Name = @Name, WeightG = @WeightG, ProteinG = @ProteinG, FatG = @FatG, CarbsG = @CarbsG " +
                    "OUTPUT INSERTED.Id, INSERTED.UserId, INSERTED.Type, INSERTED.Name, INSERTED.WeightG, INSERTED.ProteinG, INSERTED.FatG, INSERTED.CarbsG " +
                    "WHERE id = @Id AND userId = @UserId";

                var updatedFood = await connection.QueryFirstOrDefaultAsync<Food>(sql, new
                {
                    food.Id,
                    UserId = userId,
                    // target-typed property shorthand
                    food.Name,
                    food.WeightG,
                    food.ProteinG,
                    food.FatG,
                    food.CarbsG,
                    //food.Type,
                });
                return updatedFood;
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while updating food custom {food.Id} for user {userId}", food.Id, userId);
                throw;
            }
        }

        public Task<List<Food>> SearchFoodAsync(string query, Guid UserId)
        {
            throw new NotImplementedException();
        }

       
    }
}