using CaloriesTracker.Server.GraphQL.Types.NutritionGoal;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Services.NutritionalGoalServices;
using GraphQL;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Mutations
{
    public class NutritionGoalMutations : ObjectGraphType
    {
        public NutritionGoalMutations()
        {
            Field<NutritionGoalType>("setGoal")
                .Argument<NonNullGraphType<GoalInputType>>("goal")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();
                    var goal = context.GetArgument<NutritionGoal>("goal");

                    return await service.SetGoal(goal);
                });
            Field<NutritionGoalType>("updateGoal")
                .Argument<NonNullGraphType<GuidGraphType>>("id")
                .Argument<NonNullGraphType<GoalInputType>>("goal")
                 .ResolveAsync(async context =>
                 {
                     var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();

                     var id = context.GetArgument<Guid>("id");
                     var goal = context.GetArgument<NutritionGoal>("goal");

                     goal.Id = id;

                     return await service.UpdateGoal(goal);
                 });
        }
    }
}
