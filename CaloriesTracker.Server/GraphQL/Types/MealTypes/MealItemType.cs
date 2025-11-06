using CaloriesTracker.Server.Models.Meal;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class MealItemType : ObjectGraphType<MealItem>
    {
        public MealItemType()
        {
            Field(x => x.Id);
            Field(x => x.MealId);
            Field<LongGraphType>("dishId", resolve: ctx => ctx.Source.DishId);
            Field<LongGraphType>("foodId", resolve: ctx => ctx.Source.FoodId);
            Field<DecimalGraphType>("weightG", resolve: ctx => ctx.Source.WeightG);
        }
    }
}
