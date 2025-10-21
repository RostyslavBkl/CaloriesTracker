using CaloriesTracker.Server.GraphQL.Mutations;
using CaloriesTracker.Server.GraphQL.Queries;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Schemas
{
    public class RootSchema : Schema
    {
        public RootSchema(IServiceProvider provider)
        {
            Query = provider.GetRequiredService<RootQuery>();
            Mutation = provider.GetRequiredService<RootMutations>();
        }
    }
}
