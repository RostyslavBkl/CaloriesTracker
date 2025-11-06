using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes
{
    public class CreateMealInputType : InputObjectGraphType
    {
        public CreateMealInputType()
        {
            Name = "CreateMealInputType";

            Field<NonNullGraphType<LongGraphType>>("diaryDayId");
            Field<NonNullGraphType<MealTypeEnum>>("mealType");
            Field<DateTimeOffsetGraphType>("eatenAt");
            Field<ListGraphType<MealItemInputType>>("items");
        }
    }
}
