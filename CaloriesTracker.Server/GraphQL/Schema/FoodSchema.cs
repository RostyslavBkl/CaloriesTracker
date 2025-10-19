using CaloriesTracker.Server.GraphQL.Mutations;
using CaloriesTracker.Server.GraphQL.Queries;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Schemas
{
    public class FoodSchema : Schema
    {
        public FoodSchema(IServiceProvider provider) : base(provider)
        {
            Query = provider.GetRequiredService<FoodQuery>();
            Mutation = provider.GetRequiredService<FoodMutation>();
        }
    }
}
