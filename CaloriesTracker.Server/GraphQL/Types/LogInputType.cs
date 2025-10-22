using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types
{
    public class LogInputType : InputObjectGraphType
    {
        public LogInputType()
        {
            Name = "LogInput";
            Field<NonNullGraphType<StringGraphType>>("email");
            Field<NonNullGraphType<StringGraphType>>("password");
        }
    }
}
