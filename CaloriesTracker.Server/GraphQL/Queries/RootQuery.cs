using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(IServiceProvider provider)
        {
            Name = "RootQuery";

            var authQuery = provider.GetRequiredService<AuthQuery>();
            var foodQuery = provider.GetRequiredService<FoodQuery>();
            var mealQuery = provider.GetRequiredService<MealQuery>();
            var userProfileQuery = provider.GetRequiredService<UserProfileQuery>();

            foreach (var field in authQuery.Fields)
            {
                AddField(field);
            }

            foreach (var field in foodQuery.Fields)
            {
                AddField(field);
            }
            foreach (var field in mealQuery.Fields)
            {
                AddField(field);
            }
            foreach (var field in userProfileQuery.Fields)
            {
                AddField(field);
            }
        }
    }
}
