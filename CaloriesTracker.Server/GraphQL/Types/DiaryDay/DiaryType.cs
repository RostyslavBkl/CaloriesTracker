using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.DiaryDay
{
    public class DiaryType : ObjectGraphType
    {
        public DiaryType()
        {
            Name = "DiaryDay";
            Field<NonNullGraphType<GuidGraphType>>("id");
            Field<NonNullGraphType<GuidGraphType>>("userId");
            Field<NonNullGraphType<DateGraphType>>("date");
            Field<NonNullGraphType<GuidGraphType>>("nutritionGoalId");
        }
    }
}
