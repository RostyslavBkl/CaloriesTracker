using CaloriesTracker.Server.Models.Meal;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class MealItemType : ObjectGraphType<MealItem>
    {
        public MealItemType()
        {
            Name = "MealItem";

            Field<NonNullGraphType<GuidGraphType>>("id", resolve: ctx => ctx.Source.Id);
            Field<NonNullGraphType<GuidGraphType>>("mealId", resolve: ctx => ctx.Source.MealId);
            Field<GuidGraphType>("dishId", resolve: ctx => ctx.Source.DishId);
            Field<GuidGraphType>("foodId", resolve: ctx => ctx.Source.FoodId);
            Field<DecimalGraphType>("weightG", resolve: ctx => ctx.Source.WeightG);
        }
    }
}
