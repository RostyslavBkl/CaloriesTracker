using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.NutritionGoal
{
    public class NutrtionGoalSummaryType : ObjectGraphType
    {
        public NutrtionGoalSummaryType()
        {
            Name = "NutritionGoalSummary";
            Field<NonNullGraphType<GuidGraphType>>("nutritionGoalId");
            Field<NonNullGraphType<DecimalGraphType>>("targetCalories");
            Field<DecimalGraphType>("proteinG");
            Field<DecimalGraphType>("fatG");
            Field<DecimalGraphType>("carbG");
        }
    }
}
