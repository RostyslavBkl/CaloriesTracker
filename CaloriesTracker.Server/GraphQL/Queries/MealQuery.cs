using CaloriesTracker.Server.GraphQL.Types;
using CaloriesTracker.Server.GraphQL.Types.MealTypes;
using CaloriesTracker.Server.Services;
using GraphQL;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries
{
    public sealed class MealQuery : ObjectGraphType
    {
        public MealQuery()
        {
            Field<ListGraphType<MealTypeGraph>>("mealsByDiaryDayId")
                .Argument<NonNullGraphType<GuidGraphType>>("diaryDayId")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var id = ctx.GetArgument<Guid>("diaryDayId");
                        return await mealService.GetMealsByDiaryDayAsync(id);
                    }
                    catch (Exception ex)
                    {
                        throw new ExecutionError("Failed to load meals for diary day", ex);
                    }
                });

            Field<MealTypeGraph>("meal")
                .Argument<NonNullGraphType<GuidGraphType>>("id")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var id = ctx.GetArgument<Guid>("id");
                        return await mealService.GetMealByIdAsync(id);
                    }
                    catch (Exception ex)
                    {
                        throw new ExecutionError("Failed to load meal", ex);
                    }
                });

            Field<SummaryNutritionType>("mealNutrition")
                .Argument<NonNullGraphType<GuidGraphType>>("mealId")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var id = ctx.GetArgument<Guid>("mealId");
                        return await mealService.GetMealNutritionAsync(id);
                    }
                    catch (Exception ex)
                    {
                        throw new ExecutionError("Failed to load meal nutrition", ex);
                    }
                });

            Field<SummaryNutritionType>("diaryDayNutrition")
                .Argument<NonNullGraphType<GuidGraphType>>("diaryDayId")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var id = ctx.GetArgument<Guid>("diaryDayId");
                        return await mealService.GetDiaryDayNutritionAsync(id);
                    }
                    catch (Exception ex)
                    {
                        throw new ExecutionError("Failed to load diary day nutrition", ex);
                    }
                });
        }
    }
}
