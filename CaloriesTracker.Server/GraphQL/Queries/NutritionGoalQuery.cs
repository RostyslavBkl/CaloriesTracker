using CaloriesTracker.Server.GraphQL.Types.NutritionGoal;
using CaloriesTracker.Server.Services.NutritionalGoalServices;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries
{
    public class NutritionGoalQuery : ObjectGraphType
    {
        public NutritionGoalQuery()
        {
            Field<NutritionGoalType>("getActive")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();
                    return await service.GetActiveGoal();
                });
            Field<ListGraphType<NutritionGoalType>>("getHistory")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();
                    return await service.GetGoalsHistory();
                });
        }
    }
}
