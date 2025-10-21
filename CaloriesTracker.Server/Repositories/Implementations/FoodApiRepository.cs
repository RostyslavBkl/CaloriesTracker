//using CaloriesTracker.Server.Data.Ado;
using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using Dapper;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class FoodApiRepository : IFoodApiRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        private readonly ILogger<FoodApiRepository> _logger;

        public FoodApiRepository(IDbConnectionFactory connectionFactory, ILogger<FoodApiRepository> logger)
        {
            _connectionFactory = connectionFactory;
            _logger = logger;
        }

        public async Task<Food> GetFoodByExternalIdAsync(string externalId)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "SELECT * FROM Foods Where externalId = @ExternalId";
                var food = await connection.QuerySingleOrDefaultAsync<Food>(sql, new { ExternalId = externalId });

                return food;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error while getting food by ExternalId: {externalId}", externalId);
                throw;
            }
        }

        public async Task<Food> AddApiFoodAsync(Food food)
        {
            try
            {
                using var connection = _connectionFactory.Create();
                await connection.OpenAsync();

                var sql = "INSERT INTO Foods (UserId, Type, Name, WeightG, ProteinG, FatG, CarbsG, ExternalId) VALUES (@UserId, @Type, @Name, @WeightG, @ProteinG, @FatG, @CarbsG, @ExternalId)";

                await connection.ExecuteAsync(sql, new
                {
                    UserId = food.UserId,
                    Type = food.Type.ToString(),
                    Name = food.Name,
                    WeightG = food.WeightG,
                    ProteinG = food.ProteinG,
                    FatG = food.FatG,
                    CarbsG = food.CarbsG,
                    ExternalId = food.ExternalId,
                });

                food.UserId = null;
                food.Type = Models.Type.api;

                return food;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while saving API food to Db");
                throw;
            }
        }
    }
}
