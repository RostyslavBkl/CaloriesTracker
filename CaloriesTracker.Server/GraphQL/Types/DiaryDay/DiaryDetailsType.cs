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
            Field<NonNullGraphType<GuidGraphType>>("nutritionGoalId");
            Field<NonNullGraphType<IntGraphType>>("targetCalories");
            Field<DecimalGraphType>("ProteinG");
            Field<DecimalGraphType>("FatG");
            Field<DecimalGraphType>("CarbG");
        }
    }
}
