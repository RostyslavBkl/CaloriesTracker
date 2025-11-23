using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.NutritionGoal
{
    public class GoalInputType : InputObjectGraphType
    {
        public GoalInputType()
        {
            Name = "GoalInput";
            Field<DateGraphType>("startDate");
            Field<DateGraphType>("endDate");
            Field<NonNullGraphType<IntGraphType>>("targetCalories");
            Field<DecimalGraphType>("ProteinG");
            Field<DecimalGraphType>("FatG");
            Field<DecimalGraphType>("CarbG");
            //Field<EnumerationGraphType<Plan>>("plan");
        }
    }
}
