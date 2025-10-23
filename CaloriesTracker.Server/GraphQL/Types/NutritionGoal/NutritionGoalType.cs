using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.NutritionGoal
{
    public class NutritionGoalType : ObjectGraphType
    {
        public NutritionGoalType()
        {
            Name = "NutritionGoal";
            Field<NonNullGraphType<GuidGraphType>>("id");
            Field<DateGraphType>("startDate");
            Field<DateGraphType>("endDate");
            Field<NonNullGraphType<IntGraphType>>("targetCalories");
            Field<DecimalGraphType>("ProteinG");
            Field<DecimalGraphType>("FatG");
            Field<DecimalGraphType>("CarbG");
            Field<NonNullGraphType<GuidGraphType>>("userId");
        }
    }
}
