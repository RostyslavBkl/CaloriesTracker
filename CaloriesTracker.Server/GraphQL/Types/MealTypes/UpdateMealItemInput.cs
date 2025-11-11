using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class UpdateMealItemInput : InputObjectGraphType
    {
        public UpdateMealItemInput()
        {
            Name = "UpdateMealItemInput";

            Field<NonNullGraphType<GuidGraphType>>("itemId");
            Field<GuidGraphType>("dishId");
            Field<GuidGraphType>("foodId");
            Field<DecimalGraphType>("weightG");
        }
    }
}
