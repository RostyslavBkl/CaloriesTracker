using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class UpdateMealItemInput : InputObjectGraphType
    {
        public UpdateMealItemInput()
        {
            Name = "UpdateMealItemInput";
            Field<NonNullGraphType<LongGraphType>>("itemId");
            Field<LongGraphType>("dishId");
            Field<LongGraphType>("foodId");
            Field<DecimalGraphType>("weightG");
        }
    }
}
