using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Type
{
    public class FoodInputType : InputObjectGraphType
    {
        public FoodInputType()
        {
            Name = "FoodInput";
            Field<StringGraphType>("name");
            Field<DecimalGraphType>("weightG");
            Field<DecimalGraphType>("proteinG");
            Field<DecimalGraphType>("fatG");
            Field<DecimalGraphType>("carbsG");
        }
    }
}
