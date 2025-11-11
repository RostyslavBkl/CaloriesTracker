using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Mutations
{
    public class RootMutations : ObjectGraphType
    {
        public RootMutations(IServiceProvider provider)
        {
            var foodM = provider.GetRequiredService<FoodMutation>();
            var authM = provider.GetRequiredService<AuthMutation>();
            var mealM = provider.GetRequiredService<MealMutation>();

            foreach (var field in foodM.Fields)
            {
                AddField(field);
            }
            foreach (var field in authM.Fields)
            {
                AddField(field);
            }
            foreach (var field in mealM.Fields)
            {
                AddField(field);
            }
        }
    }
}
