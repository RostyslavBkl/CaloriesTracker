using GraphQL.Types;

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
    }
}
