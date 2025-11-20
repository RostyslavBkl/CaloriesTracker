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
            var goalQuery = provider.GetRequiredService<NutritionGoalQuery>();
            var diaryQuery = provider.GetRequiredService<DiaryQuery>();
            var mealQuery = provider.GetRequiredService<MealQuery>();

            foreach (var field in authQuery.Fields)
            {
                AddField(field);
            }

            foreach (var field in foodQuery.Fields)
            {
                AddField(field);
            }
            foreach (var field in goalQuery.Fields)
            {
                AddField(field);
            }
            foreach (var field in diaryQuery.Fields)
            {
                AddField(field);
            }
            foreach (var field in mealQuery.Fields)
            {
                AddField(field);
            }
        }
    }
}
