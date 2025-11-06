using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class MealItemInputType : InputObjectGraphType
    {
        public MealItemInputType()
        {
            Name = "MealItemInput";

            Field<LongGraphType>("dishId");
            Field<LongGraphType>("foodId");
            Field<DecimalGraphType>("weightG");
        }
    }
}
