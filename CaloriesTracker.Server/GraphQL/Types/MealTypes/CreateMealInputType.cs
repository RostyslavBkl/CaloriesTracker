using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public sealed class CreateMealInputType : InputObjectGraphType
    {
        public CreateMealInputType()
        {
            Name = "CreateMealInput";

            Field<NonNullGraphType<DateGraphType>>("date");
            Field<NonNullGraphType<MealTypeEnum>>("mealType");
            Field<DateTimeOffsetGraphType>("eatenAt");
            Field<ListGraphType<NonNullGraphType<MealItemInputType>>>("items");
        }
    }
}
