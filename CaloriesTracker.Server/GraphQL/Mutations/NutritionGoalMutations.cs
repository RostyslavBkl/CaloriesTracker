using CaloriesTracker.Server.GraphQL.Types.NutritionGoal;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Nutrition;
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
                .Argument<NonNullGraphType<StringGraphType>>("plan")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();

                    var goal = context.GetArgument<NutritionGoal>("goal");
                    var planStr = context.GetArgument<string>("plan");

                    if (!Enum.TryParse<Plan>(planStr, ignoreCase: true, out var plan))
                    {
                        throw new ExecutionError($"Invalid plan value: {planStr}");
                    }

                    return await service.SetGoal(goal, plan);
                });

            Field<NutritionGoalType>("updateGoal")
                .Argument<NonNullGraphType<GoalInputType>>("goal")
                .Argument<NonNullGraphType<StringGraphType>>("plan")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();

                    var goal = context.GetArgument<NutritionGoal>("goal");
                    var planStr = context.GetArgument<string>("plan");

                    if (!Enum.TryParse<Plan>(planStr, ignoreCase: true, out var plan))
                    {
                        throw new ExecutionError($"Invalid plan value: {planStr}");
                    }

                    return await service.UpdateGoal(goal, plan);
                });
            Field<NutritionGoalType>("deleteGoal")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<NutritionalGoalService>();
                    return await service.DeleteActiveGoal();
                });
        }
    }
}
