using CaloriesTracker.Server.Models.Meal;
using CaloriesTracker.Server.Services;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class MealTypeGraph : ObjectGraphType<Meal>
    {
        public MealTypeGraph()
        {
            Field(x => x.Id);
            Field(x => x.DiaryDayId);
            Field<NonNullGraphType<MealTypeEnum>>("mealType", resolve: ctx => ctx.Source.MealType);
            Field<DateTimeOffsetGraphType>("eatenAt", resolve: ctx => ctx.Source.EatenAt);
            Field<ListGraphType<MealItemType>>("items", resolve: ctx => ctx.Source.Items);
            Field<SummaryNutritionType>("summary").ResolveAsync(async ctx =>
                {
                    var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                    return await mealService.GetMealNutritionAsync(ctx.Source.Id);
                }
            );
        }
    }
}
