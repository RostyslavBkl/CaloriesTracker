using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Type
{
    public class FoodApiInputType : InputObjectGraphType
    {
        public FoodApiInputType()
        {
            Name = "FoodApiInput";
            Field<NonNullGraphType<StringGraphType>>("externalId");
            Field<StringGraphType>("name");
            Field<DecimalGraphType>("weightG").DefaultValue(100m);
            Field<DecimalGraphType>("proteinG");
            Field<DecimalGraphType>("fatG");
            Field<DecimalGraphType>("carbsG");
        }
    }
}
