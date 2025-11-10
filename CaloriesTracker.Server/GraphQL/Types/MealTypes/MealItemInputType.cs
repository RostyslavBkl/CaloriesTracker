using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class MealItemInputType : InputObjectGraphType
    {
        public MealItemInputType()
        {
            Name = "MealItemInput";

            Field<GuidGraphType>("dishId");
            Field<GuidGraphType>("foodId");
            Field<DecimalGraphType>("weightG");
        }
    }
}
