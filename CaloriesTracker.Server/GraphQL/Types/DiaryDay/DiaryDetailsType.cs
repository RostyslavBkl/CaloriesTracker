using CaloriesTracker.Server.GraphQL.Types.MealTypes;
using CaloriesTracker.Server.GraphQL.Types.NutritionGoal;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.DiaryDay
{
    public class DiaryDetailsType : ObjectGraphType
    {
        public DiaryDetailsType()
        {
            Name = "DiaryDayDetails";
            // diary
            Field<NonNullGraphType<GuidGraphType>>("diaryDayId");
            Field<NonNullGraphType<GuidGraphType>>("userId");
            Field<NonNullGraphType<DateGraphType>>("date");

            // goals
            Field<NonNullGraphType<NutrtionGoalSummaryType>>("nutritionGoalSummary");
            //Field<ListGraphType<MealTypeGraph>>("meals", resolve: ctx => ctx.Source.);
            Field<ListGraphType<MealTypeGraph>>("meals");
        }
    }
}
